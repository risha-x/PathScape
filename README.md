# PathScape

**Accessibility-Focused Campus Navigation | Full-Stack Web Application**

**Status: Work in Progress — Active Development**

PathScape is a full-stack campus navigation application being developed to make university environments more accessible. Initially designed for the University of California, Santa Cruz (UCSC), the project combines interactive mapping, Python-based pathfinding, and REST API integration to explore accessibility-focused route planning.

The project applies software engineering, algorithmic problem-solving, and full-stack development to address real-world campus navigation challenges.

## Tech Stack

- **Frontend:** React, Next.js, TypeScript
- **Backend:** Python, FastAPI
- **Mapping:** Google Maps API
- **Architecture:** REST APIs
- **Development Tools:** Git, GitHub, npm

## Development Status

PathScape is currently under active development. The project includes frontend mapping components, backend routing logic, and API integration.

Current development focuses on improving route accuracy, refining frontend-backend communication, and incorporating accessibility requirements into route calculations.

Some functionality is experimental and may not yet produce fully accurate or accessibility-optimized routes.

## Key Features

### Current Implementation

- **Interactive Campus Mapping:** Google Maps integration for exploring campus locations.
- **Navigation Controls:** Interface components for selecting starting points and destinations.
- **Route Visualization:** Frontend functionality for displaying navigation routes.
- **Backend Pathfinding:** Python modules for processing navigation and route calculations.
- **REST API Integration:** FastAPI endpoints for communication between the frontend and backend.

### In Development

- **Accessibility-Aware Routing:** Improving route selection based on accessibility requirements.
- **Route Accuracy:** Refining pathfinding results and campus pathway data.
- **Navigation Experience:** Improving map interactions and overall usability.

## Technical Implementation

PathScape uses a modular full-stack architecture that separates the frontend interface from backend route-processing logic.

### Frontend — React, Next.js, TypeScript

- Developed interactive campus mapping components using React and Next.js.
- Integrated the Google Maps API for map rendering and route visualization.
- Organized the frontend into reusable components for navigation controls and map interactions.
- Connected frontend functionality to backend REST API endpoints.

### Backend — Python, FastAPI

- Developed a Python-based backend using FastAPI.
- Organized routing functionality into separate modules for API handling, map data, and pathfinding.
- Implemented routing logic to process navigation requests and calculate routes.
- Used REST endpoints to exchange route information with the frontend.

### Pathfinding and Routing

The routing system is designed to:

1. Receive a starting location and destination.
2. Process the navigation request through the FastAPI backend.
3. Execute Python-based pathfinding logic.
4. Return route information to the frontend.
5. Display the calculated route on the interactive map.

Accessibility-aware route optimization remains an ongoing development goal.

## System Architecture

```text
             User
              |
              v
     Next.js / React UI
              |
              v
      Navigation Controls
              |
              v
       REST API Request
              |
              v
      Python / FastAPI
              |
              v
      Pathfinding Logic
              |
              v
       Route Response
              |
              v
     Google Maps Display
```

## Getting Started

### Prerequisites

- Node.js and npm
- Python
- Google Maps API credentials

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/risha-x/PathScape.git
cd PathScape
```

**2. Install frontend dependencies**

Navigate to the directory containing the frontend `package.json` file and run:

```bash
npm install
```

**3. Install backend dependencies**

Navigate to the directory containing `requirements.txt` and run:

```bash
pip install -r requirements.txt
```

**4. Configure environment variables**

Configure the Google Maps API credentials using the environment variables required by the project.

Do not commit API keys, credentials, or other secrets to GitHub.

**5. Run the application**

Start the FastAPI backend using the Uvicorn command appropriate for the project's backend structure.

Start the Next.js frontend from its project directory:

```bash
npm run dev
```

Open the local development URL displayed in the terminal.

**Note:** PathScape is still in development. Some functionality may be incomplete or require additional configuration.

## Project Structure

The main application modules include:

```text
Frontend (Next.js / React)
├── page.tsx
├── layout.tsx
├── scene.tsx
├── campusMap.tsx
├── routeControls.tsx
└── globals.css

Backend (Python / FastAPI)
├── main.py
├── map.py
├── pathfinding.py
└── requirements.txt
```

*These are the main modules from the project's development structure. Their exact directory locations may vary.*

## Engineering Challenges

### 1. Accessibility-Aware Pathfinding

Traditional navigation systems often prioritize travel distance or time. PathScape explores how routing algorithms can incorporate accessibility-related requirements when evaluating campus pathways.

A continuing challenge is ensuring that the selected routes reflect real-world accessibility conditions rather than simply returning the shortest available path.

### 2. Frontend-Backend Integration

The application combines a React-based mapping interface with a separate Python routing backend.

This involves coordinating user input, HTTP requests, backend pathfinding, and route visualization while maintaining a modular codebase.

### 3. Routing Accuracy

Accurate navigation depends on reliable pathway data and routing logic.

Current development includes investigating discrepancies between calculated routes and intended navigation requirements, with the goal of improving consistency and reliability.

## Future Improvements

- Improve accessibility-aware pathfinding algorithms.
- Incorporate verified campus pedestrian and accessibility data.
- Expand navigation support to additional university campuses.
- Improve routing accuracy and route customization.
- Enhance mobile responsiveness and overall usability.
- Expand testing for backend routing and API functionality.

## Project Motivation

PathScape was created to explore how software engineering can help address real-world accessibility challenges.

By combining Python-based algorithms, full-stack web development, and interactive mapping, the project aims to make campus navigation more inclusive while providing an opportunity to develop and apply practical software engineering skills.

## Repository

**GitHub:** https://github.com/risha-x/PathScape

**Project Status:** Work in Progress — Active Development
