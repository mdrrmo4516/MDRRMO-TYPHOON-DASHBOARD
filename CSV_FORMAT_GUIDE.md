# CSV Import/Export Format Guide

## Overview
The Typhoon Tracking Dashboard supports importing and exporting tracking point data via CSV files with comprehensive typhoon information. This allows you to backup your data, edit it externally, and restore it later.

## CSV Format

### Enhanced Format Headers
The CSV file should contain the following headers in the first row:
```
id,tc_bulletin_number,as_of_time,as_of_date,typhoon_name,typhoon_category,typhoon_location,coordinate_latitude,coordinate_longitude,typhoon_movement,wind_speed,central_pressure,current
```

### Column Descriptions

| Column                | Type    | Description                                      | Example                                      |
|----------------------|---------|--------------------------------------------------|----------------------------------------------|
| id                   | Integer | Unique identifier for the tracking point        | 1, 2, 3, etc.                                |
| tc_bulletin_number   | Integer | Bulletin number                                  | 1, 2, 5                                      |
| as_of_time           | String  | Time of observation                              | 8:00, 11:00, 14:00                          |
| as_of_date           | String  | Date of observation                              | 14-Jan-26, 15-Jan-26                        |
| typhoon_name         | String  | Name of the typhoon                              | ADA, BETTY, CARINA                          |
| typhoon_category     | String  | Typhoon category (see categories below)          | tropical-storm, typhoon                     |
| typhoon_location     | String  | Descriptive location                             | "256 km East of Guiuan, Eastern Samar"      |
| coordinate_latitude  | Float   | Latitude in degrees North                        | 11.5, 10.8                                  |
| coordinate_longitude | Float   | Longitude in degrees East                        | 130.5, 128.2                                |
| typhoon_movement     | String  | Direction and speed of movement                  | "NWestward at 10 km/h"                      |
| wind_speed           | String  | Wind speed range                                 | "55 km/h to 70 km/h"                        |
| central_pressure     | String  | Central pressure measurement                     | 965 hPa, 970 hPa                            |
| current              | Boolean | Whether this is the current position (true/false)| true, false                                 |

### Valid Category Values
- `super-typhoon` - Super Typhoon
- `typhoon` - Typhoon
- `severe-tropical-storm` - Severe Tropical Storm
- `tropical-storm` - Tropical Storm
- `tropical-depression` - Tropical Depression
- `low-pressure-area` - Low Pressure Area

## Example CSV File

```csv
id,tc_bulletin_number,as_of_time,as_of_date,typhoon_name,typhoon_category,typhoon_location,coordinate_latitude,coordinate_longitude,typhoon_movement,wind_speed,central_pressure,current
1,1,8:00,14-Jan-26,ADA,low-pressure-area,"460 km East of Hinatuan, Surigao del Sur",10.3,129.1,NWestward at 35 km/h,45 km/h to 55 km/h,965 hPa,false
2,2,11:00,15-Jan-26,ADA,tropical-depression,"465 km East of Surigao City, Surigao del Norte",11.5,128.7,WNWestward at 10 km/h,45 km/h to 55 km/h,966 hPa,false
3,3,10:00,16-Jan-26,ADA,tropical-depression,"430 km East of Maasin City, Southern Leyte",12.6,127.7,Westward at 20 km/h,45 km/h to 55 km/h,967 hPa,false
4,4,11:00,17-Jan-26,ADA,tropical-storm,"335 km East of Catarman, Northern Samar",12.8,126.5,NWestward Slowly,55 km/h to 70 km/h,968 hPa,false
5,5,12:00,18-Jan-26,ADA,tropical-storm,"Over the coastal waters of Baras, Catanduanes",13.7,125.6,NWestward at 20 km/h,55 km/h to 70 km/h,969 hPa,true
```

### Legacy Format Support
The system also supports the older simplified format for backward compatibility:
```
id,lat,lon,category,datetime,current
```

## How to Use

### Exporting Data
1. Click the **"Export CSV"** button in the dashboard
2. The file will be automatically downloaded with a timestamp in the filename
3. Format: `typhoon_tracking_[timestamp].csv`
4. Contains all tracking points with complete typhoon information

### Importing Data
1. Click the **"Import CSV"** button in the dashboard
2. Select your CSV file from your computer (supports both enhanced and legacy formats)
3. **WARNING**: All existing tracking points will be overwritten with the imported data
4. You will see a success message showing how many points were imported

## Important Notes

⚠️ **Data Overwrite Warning**
- Importing a CSV file will **completely replace** all existing tracking points
- Make sure to export your current data before importing if you want to keep a backup

✅ **Best Practices**
- Always export your data before making major changes
- Validate your CSV format before importing
- Use quotes for fields containing commas (e.g., location descriptions)
- Ensure at least one point has `current=true` for proper visualization
- Use consistent date format: `DD-MMM-YY` (e.g., 15-Jan-26)
- Use consistent time format: `HH:MM` (e.g., 11:00)

📊 **Enhanced Data Benefits**
- Complete bulletin tracking with numbers and timestamps
- Detailed typhoon information including name and category evolution
- Precise location descriptions for better context
- Movement tracking for trajectory analysis
- Wind speed and pressure data for intensity monitoring

## Error Handling

If import fails, check for:
- Missing or incorrect headers
- Invalid latitude/longitude values (must be numbers)
- Invalid category values (must match the list above)
- Empty or malformed CSV file
- Mismatched column counts in data rows
- Improperly quoted fields containing commas

## Sample File Location
Sample CSV files are available at:
- Enhanced format: `/app/typhoon_tracking.csv`
- Legacy format: `/app/sample_tracking_points.csv`

## Field Guidelines

### Location Descriptions
- Use quotes if the location contains commas
- Example: `"460 km East of Hinatuan, Surigao del Sur"`

### Movement Format
- Include direction and speed
- Example: `NWestward at 10 km/h` or `Westward Slowly`

### Wind Speed Format
- Include range if available
- Example: `55 km/h to 70 km/h` or `165 km/h`

### Pressure Format
- Include unit (hPa)
- Example: `965 hPa` or `1000 hPa`
