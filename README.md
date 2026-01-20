# Typhoon Tracking Dashboard

## Overview
A comprehensive web application for tracking and visualizing typhoon data with interactive maps and detailed bulletin information.

## Features
- **Interactive Typhoon Tracking Map**: Real-time visualization of typhoon paths with Google Maps integration
- **Enhanced Data Management**: Add tracking points with complete bulletin information including:
  - Bulletin number and timestamp
  - Typhoon name and category
  - Precise coordinates and location descriptions
  - Movement direction and speed
  - Wind speed and central pressure data
- **CSV Import/Export**: Backup and restore tracking data with full typhoon information
- **Satellite Map View**: Additional map view for comprehensive monitoring
- **Forecast Table**: View predicted typhoon trajectories
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Quick Start
1. Access the dashboard at the frontend URL
2. View the current typhoon tracking data
3. Add new tracking points using the "Add Point" button
4. Import/export data using CSV files for backup and analysis

## Data Management

### Adding Tracking Points
Click "Add Point" to open a comprehensive form with the following fields:
- **Bulletin Information**: Number, time, and date
- **Typhoon Details**: Name and category
- **Location**: Coordinates and descriptive location
- **Movement & Intensity**: Direction, speed, wind speed, and pressure

### CSV Format
The system supports enhanced CSV format with 13 columns:
```
id, tc_bulletin_number, as_of_time, as_of_date, typhoon_name, 
typhoon_category, typhoon_location, coordinate_latitude, 
coordinate_longitude, typhoon_movement, wind_speed, 
central_pressure, current
```

See `CSV_FORMAT_GUIDE.md` for detailed documentation.

## Sample Files
The application starts fresh with no pre-loaded data. You can add tracking points manually or import CSV files.

## Technical Stack
- **Frontend**: React with Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Maps**: Google Maps integration

## Support
For detailed CSV format information, refer to `CSV_FORMAT_GUIDE.md`

