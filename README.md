# PathScape

PathScape | Next.js, FastAPI, Three.js, Python

PathScape is an AI-powered accessibility planning platform for campuses, neighborhoods, and buildings.

## What is included

- `frontend/`: Next.js app with React, TypeScript, and React Three Fiber.
- `backend/`: FastAPI service with route simulation endpoints.

## Getting started

### Frontend

1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Backend

1. `cd backend`
2. `python -m venv .venv`
3. `source .venv/bin/activate`
4. `pip install -r requirements.txt`
5. `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`

## App idea

- Developed an AI-powered accessibility platform that generates personalized campus routes based on mobility needs, walking distance, stairs, hills, and elevator access.
- Built an interactive 3D environment using Three.js, allowing users to visualize and compare accessible routes in real time.
- Implemented an A* pathfinding system and natural-language input processing to convert user requests into route constraints.
- Designed a full-stack architecture using Next.js and FastAPI to connect user preferences, map data, and route simulations.

## Architecture

- Frontend: Next.js + React Three Fiber
- Backend: FastAPI + Pydantic
- Pathfinding: A* or custom accessibility-aware route planning
- Data: Campus maps, OpenStreetMap, building floor plans
