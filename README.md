# Typhoon Tracking Dashboard - SPA

A Single Page Application (SPA) for tracking and visualizing typhoon data with interactive maps and detailed bulletin information.

## Features
- **Interactive Typhoon Tracking Map**: Real-time visualization of typhoon paths with Google Maps integration
- **Enhanced Data Management**: Add tracking points with complete bulletin information
- **CSV Import/Export**: Backup and restore tracking data with full typhoon information
- **Satellite Map View**: Additional map view for comprehensive monitoring
- **Forecast Table**: View predicted typhoon trajectories
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Quick Start

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Data Management

### Adding Tracking Points
Click "Add Point" to open a comprehensive form with the following fields:
- **Bulletin Information**: Number, time, and date
- **Typhoon Details**: Name and category
- **Location**: Coordinates and descriptive location
- **Movement & Intensity**: Direction, speed, wind speed, and pressure

### CSV Format
The system supports enhanced CSV format with 13 columns. See `CSV_FORMAT_GUIDE.md` for detailed documentation.

## Technical Stack
- **Frontend**: React with Tailwind CSS
- **UI Components**: shadcn/ui
- **Maps**: Google Maps integration
- **Build Tool**: CRACO (Create React App Configuration Override)

## Project Structure
```
/app
├── src/               # React source code
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components (Dashboard)
│   ├── hooks/         # Custom React hooks
│   └── lib/           # Utility functions
├── public/            # Static assets
├── package.json       # Dependencies
└── README.md          # This file
```
