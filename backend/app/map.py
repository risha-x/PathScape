from .pathfinding import Node, Edge, AccessibilityGraph

def create_campus_graph() -> AccessibilityGraph:
    """
    Create UCSC campus map with real building locations and accessibility info.
    Based on UCSC Main Campus layout.
    Coordinates are in meters, where origin is roughly the center of campus.
    Z-axis represents elevation change.
    """
    graph = AccessibilityGraph()
    
    # Nodes: actual UCSC buildings and landmarks
    # Using relative coordinates based on campus layout
    nodes = [
        # Academic Buildings
        Node(id='engineering', x=0, y=200, z=0, label='Engineering Building', has_elevator=True, has_ramp=True),
        Node(id='natural_sciences', x=-150, y=150, z=0, label='Natural Sciences Building', has_elevator=True, has_ramp=True),
        Node(id='mchenry', x=-200, y=0, z=0, label='McHenry Library', has_elevator=True, has_ramp=True),
        Node(id='humanities', x=-100, y=-100, z=0, label='Humanities Building', has_elevator=False, has_ramp=True),
        Node(id='social_sciences', x=100, y=-150, z=0, label='Social Sciences Building', has_elevator=True, has_ramp=True),
        
        # Colleges/Residential
        Node(id='crown_college', x=-300, y=100, z=0, label='Crown College', has_elevator=False, has_ramp=False),
        Node(id='merrill_college', x=-250, y=-200, z=0, label='Merrill College', has_elevator=False, has_ramp=False),
        Node(id='oakes_college', x=200, y=-300, z=0, label='Oakes College', has_elevator=False, has_ramp=True),
        Node(id='ten_college', x=250, y=100, z=0, label='Ten College', has_elevator=False, has_ramp=False),
        
        # Facilities
        Node(id='health_center', x=-50, y=50, z=0, label='Health Center', has_elevator=True, has_ramp=True),
        Node(id='student_center', x=50, y=0, z=0, label='Student Center', has_elevator=True, has_ramp=True),
        Node(id='recreation', x=150, y=100, z=0, label='Recreation Center', has_elevator=True, has_ramp=True),
        Node(id='dining_hall', x=0, y=-250, z=0, label='Dining Hall', has_elevator=False, has_ramp=True),
        Node(id='parking', x=300, y=200, z=0, label='Parking Lot', has_elevator=False, has_ramp=False),
        
        # Specific Locations
        Node(id='quarry', x=400, y=300, z=50, label='The Quarry', has_elevator=False, has_ramp=False),
        Node(id='arboretum', x=-400, y=400, z=20, label='Arboretum', has_elevator=False, has_ramp=False),
        Node(id='bay_trail', x=-350, y=-350, z=0, label='Bay Trail Entrance', has_elevator=False, has_ramp=True),
    ]
    
    for node in nodes:
        graph.add_node(node)
    
    # Edges with accessibility info
    edges = [
        # Main quad connections
        Edge('engineering', 'natural_sciences', distance=180.0, elevation_gain=0.1, 
             accessibility_difficulty=0.1, has_ramp=True),
        Edge('engineering', 'student_center', distance=220.0, elevation_gain=-0.2,
             accessibility_difficulty=0.1, has_ramp=True),
        Edge('natural_sciences', 'mchenry', distance=120.0, elevation_gain=0.0,
             accessibility_difficulty=0.05, has_ramp=True),
        Edge('mchenry', 'humanities', distance=140.0, elevation_gain=-0.1,
             accessibility_difficulty=0.1, has_ramp=True),
        Edge('humanities', 'social_sciences', distance=220.0, elevation_gain=0.3,
             accessibility_difficulty=0.15, has_ramp=True),
        
        # Health and wellness
        Edge('student_center', 'health_center', distance=100.0, elevation_gain=0.0,
             accessibility_difficulty=0.05, has_ramp=True),
        Edge('health_center', 'recreation', distance=150.0, elevation_gain=0.2,
             accessibility_difficulty=0.1, has_ramp=True),
        
        # Residential to academic
        Edge('crown_college', 'natural_sciences', distance=200.0, elevation_gain=0.1,
             accessibility_difficulty=0.2, has_ramp=False),
        Edge('merrill_college', 'humanities', distance=180.0, elevation_gain=0.2,
             accessibility_difficulty=0.15, has_ramp=False),
        Edge('oakes_college', 'social_sciences', distance=250.0, elevation_gain=-0.1,
             accessibility_difficulty=0.15, has_ramp=True),
        Edge('ten_college', 'engineering', distance=200.0, elevation_gain=0.3,
             accessibility_difficulty=0.2, has_ramp=False),
        
        # To dining
        Edge('engineering', 'dining_hall', distance=280.0, elevation_gain=-0.3,
             accessibility_difficulty=0.15, has_ramp=True),
        Edge('student_center', 'dining_hall', distance=250.0, elevation_gain=-0.2,
             accessibility_difficulty=0.1, has_ramp=True),
        Edge('recreation', 'dining_hall', distance=300.0, elevation_gain=-0.4,
             accessibility_difficulty=0.2, has_ramp=True),
        
        # To parking
        Edge('engineering', 'parking', distance=320.0, elevation_gain=0.2,
             accessibility_difficulty=0.15, has_ramp=True),
        
        # To outdoor areas (harder terrain)
        Edge('recreation', 'quarry', distance=350.0, elevation_gain=2.5,
             accessibility_difficulty=0.6, has_stairs=True),
        Edge('arboretum', 'crown_college', distance=280.0, elevation_gain=-0.5,
             accessibility_difficulty=0.3, has_ramp=False),
        Edge('bay_trail', 'merrill_college', distance=250.0, elevation_gain=0.0,
             accessibility_difficulty=0.2, has_ramp=True),
        
        # Inter-college paths
        Edge('crown_college', 'merrill_college', distance=300.0, elevation_gain=-0.2,
             accessibility_difficulty=0.2, has_ramp=False),
        Edge('merrill_college', 'oakes_college', distance=450.0, elevation_gain=0.3,
             accessibility_difficulty=0.25, has_ramp=False),
        Edge('oakes_college', 'ten_college', distance=280.0, elevation_gain=0.1,
             accessibility_difficulty=0.15, has_ramp=True),
    ]
    
    for edge in edges:
        graph.add_edge(edge)
    
    return graph

