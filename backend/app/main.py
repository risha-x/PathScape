from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from .pathfinding import PathFinder
from .map import create_campus_graph

class RouteRequest(BaseModel):
    origin: str
    destination: str
    constraints: List[str] = []

class RoutePoint(BaseModel):
    x: float
    y: float
    z: float
    label: str

class RouteResponse(BaseModel):
    path: List[RoutePoint]
    distance: float
    duration_minutes: float
    accessibility_score: float

# Initialize campus graph and pathfinder
campus_graph = create_campus_graph()
pathfinder = PathFinder(campus_graph)

app = FastAPI(title='PathScape API', version='0.1.0')

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000', 'http://localhost:*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get('/')
async def root():
    return {'message': 'Welcome to PathScape API'}

@app.get('/locations')
async def list_locations():
    """List all available campus locations."""
    return {
        'locations': [
            {'id': node_id, 'label': node.label, 'x': node.x, 'y': node.y, 'z': node.z}
            for node_id, node in campus_graph.nodes.items()
        ]
    }

@app.post('/route', response_model=RouteResponse)
async def plan_route(request: RouteRequest):
    """
    Plan an accessible route between two locations.
    
    Constraints can include:
    - 'no_stairs': Avoid stairs
    - 'no_hills': Avoid steep elevation changes
    - 'prefer_ramps': Prefer paths with ramps
    - 'wheelchair': Strict wheelchair accessibility
    """
    result = pathfinder.find_path(
        start_id=request.origin,
        goal_id=request.destination,
        constraints=request.constraints
    )
    
    if result is None:
        raise HTTPException(
            status_code=404,
            detail=f"No accessible route found from {request.origin} to {request.destination} with constraints {request.constraints}"
        )
    
    path_node_ids, total_distance, elevation_gain, accessibility_score = result
    
    # Convert node IDs to RoutePoints
    path_points = []
    for node_id in path_node_ids:
        node = campus_graph.nodes[node_id]
        path_points.append(RoutePoint(
            x=node.x,
            y=node.y,
            z=node.z,
            label=node.label
        ))
    
    # Estimate walking time: ~1.4 m/s average pace, adjusted for elevation
    base_time = total_distance / 1.4
    elevation_penalty = elevation_gain * 0.5  # Extra 30s per meter of elevation
    duration_minutes = (base_time + elevation_penalty) / 60
    
    return RouteResponse(
        path=path_points,
        distance=round(total_distance, 2),
        duration_minutes=round(duration_minutes, 1),
        accessibility_score=round(accessibility_score, 2),
    )
