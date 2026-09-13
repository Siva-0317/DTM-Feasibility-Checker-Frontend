# BIW DTM Compliance Checker - Frontend

A Next.js 14 application providing a 3D interface for Body-in-White (BIW) door feasibility checks.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **3D Rendering**: React Three Fiber / Three.js
- **Styling**: Tailwind CSS & shadcn/ui
- **Animations**: Framer Motion
- **API**: Axios

## Features
- Interactive 3D visualization of uploaded `.stp` and `.step` CAD files.
- Real-time polling for backend processing status.
- DTM Compliance results grid with Pass/Fail metrics.
- Focus-in-3D functionality for locating defects directly on the mesh.
- AI Engineering Remediation report generation using Llama 3.2.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables:
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
Ensure `NEXT_PUBLIC_API_URL` points to your backend instance (default is `http://localhost:8000`).

3. Run the development server:
```bash
npm run dev
```

## Requirements
The backend must be running on port 8000 (or the port specified in your env file) to process the uploaded STEP files and serve the 3D meshes.
