import heapq
import math
from typing import List, Tuple, Dict, Set, Optional
from dataclasses import dataclass, field

@dataclass
class Node:
    """Represents a location on the campus map."""
    id: str
    x: float
    y: float
    z: float
    label: str
    has_elevator: bool = False
    has_ramp: bool = False
    has_stairs: bool = False
    surface: str = "concrete"  # concrete, grass, gravel, asphalt

@dataclass
class Edge:
    """Represents a path between two nodes."""
    from_node: str
    to_node: str
    distance: float
    elevation_gain: float  # positive = uphill
    accessibility_difficulty: float  # 0-1, where 1 is hardest
    has_stairs: bool = False
    has_ramp: bool = False
    has_elevator: bool = False

@dataclass(order=True)
class PriorityItem:
    """Used for the priority queue in A*."""
    priority: float
    node_id: str = field(compare=False)
    cost: float = field(compare=False)

class AccessibilityGraph:
    """Campus map represented as a graph with accessibility information."""
    
    def __init__(self):
        self.nodes: Dict[str, Node] = {}
        self.edges: Dict[str, List[Edge]] = {}
    
    def add_node(self, node: Node):
        """Add a node to the graph."""
        self.nodes[node.id] = node
        self.edges[node.id] = []
    
    def add_edge(self, edge: Edge):
        """Add an edge (bidirectional) to the graph."""
        if edge.from_node not in self.edges:
            self.edges[edge.from_node] = []
        if edge.to_node not in self.edges:
            self.edges[edge.to_node] = []
        
        self.edges[edge.from_node].append(edge)
        # Add reverse edge
        reverse_edge = Edge(
            from_node=edge.to_node,
            to_node=edge.from_node,
            distance=edge.distance,
            elevation_gain=-edge.elevation_gain,
            accessibility_difficulty=edge.accessibility_difficulty,
            has_stairs=edge.has_stairs,
            has_ramp=edge.has_ramp,
            has_elevator=edge.has_elevator,
        )
        self.edges[edge.to_node].append(reverse_edge)
    
    def get_neighbors(self, node_id: str) -> List[Tuple[str, Edge]]:
        """Get all neighbors and edges from a node."""
        return [(edge.to_node, edge) for edge in self.edges.get(node_id, [])]
    
    def distance(self, node_id1: str, node_id2: str) -> float:
        """Euclidean distance between two nodes."""
        n1 = self.nodes[node_id1]
        n2 = self.nodes[node_id2]
        return math.sqrt((n1.x - n2.x)**2 + (n1.y - n2.y)**2 + (n1.z - n2.z)**2)

class PathFinder:
    """A* pathfinding with accessibility constraints."""
    
    def __init__(self, graph: AccessibilityGraph):
        self.graph = graph
    
    def heuristic(self, node_id: str, goal_id: str) -> float:
        """Heuristic for A*: Euclidean distance."""
        return self.graph.distance(node_id, goal_id)
    
    def cost_modifier(self, edge: Edge, constraints: List[str]) -> float:
        """
        Calculate cost multiplier based on accessibility constraints.
        Constraints: ['no_stairs', 'no_hills', 'prefer_ramps', 'max_distance_X']
        """
        multiplier = 1.0
        
        if 'no_stairs' in constraints and edge.has_stairs:
            return float('inf')  # Block completely
        
        if 'no_hills' in constraints:
            if edge.elevation_gain > 0.5:  # Significant uphill
                multiplier *= 3.0
            elif edge.elevation_gain > 0.1:
                multiplier *= 1.5
        
        if 'prefer_ramps' in constraints:
            if edge.has_ramp:
                multiplier *= 0.8  # Prefer ramps
            elif edge.has_stairs:
                multiplier *= 2.0
        
        if 'wheelchair' in constraints:
            if edge.has_stairs:
                return float('inf')
            if edge.elevation_gain > 0.3:
                multiplier *= 5.0
        
        return multiplier
    
    def find_path(
        self,
        start_id: str,
        goal_id: str,
        constraints: List[str] = None
    ) -> Optional[Tuple[List[str], float, float, float]]:
        """
        Find optimal path from start to goal with accessibility constraints.
        Returns: (path_node_ids, total_distance, elevation_gain, accessibility_score)
        """
        if constraints is None:
            constraints = []
        
        if start_id not in self.graph.nodes or goal_id not in self.graph.nodes:
            return None
        
        # A* algorithm
        open_set = []
        heapq.heappush(open_set, PriorityItem(priority=0, node_id=start_id, cost=0))
        
        came_from: Dict[str, str] = {}
        g_score: Dict[str, float] = {start_id: 0}
        f_score: Dict[str, float] = {start_id: self.heuristic(start_id, goal_id)}
        in_open_set: Set[str] = {start_id}
        
        while open_set:
            current_item = heapq.heappop(open_set)
            current = current_item.node_id
            in_open_set.discard(current)
            
            if current == goal_id:
                # Reconstruct path
                path = [current]
                while current in came_from:
                    current = came_from[current]
                    path.append(current)
                path.reverse()
                
                # Calculate statistics
                total_distance, elevation_gain = self._calculate_path_stats(path)
                accessibility_score = self._calculate_accessibility_score(path, constraints)
                
                return path, total_distance, elevation_gain, accessibility_score
            
            for neighbor_id, edge in self.graph.get_neighbors(current):
                # Apply constraint cost modifier
                edge_cost = edge.distance * self.cost_modifier(edge, constraints)
                
                if edge_cost == float('inf'):
                    continue
                
                tentative_g = g_score[current] + edge_cost
                
                if neighbor_id not in g_score or tentative_g < g_score[neighbor_id]:
                    came_from[neighbor_id] = current
                    g_score[neighbor_id] = tentative_g
                    f_score[neighbor_id] = tentative_g + self.heuristic(neighbor_id, goal_id)
                    
                    if neighbor_id not in in_open_set:
                        heapq.heappush(open_set, PriorityItem(
                            priority=f_score[neighbor_id],
                            node_id=neighbor_id,
                            cost=tentative_g
                        ))
                        in_open_set.add(neighbor_id)
        
        return None  # No path found
    
    def _calculate_path_stats(self, path: List[str]) -> Tuple[float, float]:
        """Calculate total distance and elevation gain for a path."""
        total_distance = 0.0
        elevation_gain = 0.0
        
        for i in range(len(path) - 1):
            current_id = path[i]
            next_id = path[i + 1]
            
            # Find edge
            for edge in self.graph.edges[current_id]:
                if edge.to_node == next_id:
                    total_distance += edge.distance
                    elevation_gain += max(0, edge.elevation_gain)
                    break
        
        return total_distance, elevation_gain
    
    def _calculate_accessibility_score(self, path: List[str], constraints: List[str]) -> float:
        """
        Calculate accessibility score (0-1).
        1.0 = perfect for constraints, lower = more challenging.
        """
        if not path:
            return 0.0
        
        score = 1.0
        has_stairs = False
        has_significant_hills = False
        has_ramps = False
        has_elevators = False
        
        for i in range(len(path) - 1):
            current_id = path[i]
            next_id = path[i + 1]
            
            for edge in self.graph.edges[current_id]:
                if edge.to_node == next_id:
                    if edge.has_stairs:
                        has_stairs = True
                    if edge.elevation_gain > 1.0:
                        has_significant_hills = True
                    if edge.has_ramp:
                        has_ramps = True
                    if edge.has_elevator:
                        has_elevators = True
                    break
        
        # Adjust score based on constraints
        if 'no_stairs' in constraints and has_stairs:
            score = 0.5
        if 'no_hills' in constraints and has_significant_hills:
            score *= 0.7
        if 'wheelchair' in constraints:
            if has_stairs:
                score = 0.0
            elif has_significant_hills:
                score *= 0.5
            elif has_ramps or has_elevators:
                score = max(score, 0.9)
        
        if has_ramps and 'prefer_ramps' in constraints:
            score = min(score * 1.2, 1.0)
        
        return score
