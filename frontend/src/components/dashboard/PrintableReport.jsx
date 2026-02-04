import React, { forwardRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Helper function to get icon path from category
const getCategoryIcon = (category) => {
  const iconMap = {
    "super-typhoon": "/legend_icon/super_typhoon.png",
    "typhoon": "/legend_icon/typhoon.png",
    "severe-tropical-storm": "/legend_icon/severe_tropical_storm.png",
    "tropical-storm": "/legend_icon/tropical_storm.png",
    "tropical-depression": "/legend_icon/tropical_depression.png",
    "low-pressure-area": "/legend_icon/low_pressure_area.png",
  };
  return iconMap[category] || "/legend_icon/tropical_storm.png";
};

// Helper function to create Leaflet icon from category
const createLeafletIcon = (category, isCurrent = false) => {
  const iconUrl = getCategoryIcon(category);
  const iconSize = isCurrent ? [40, 40] : [28, 28];
  
  return L.icon({
    iconUrl: iconUrl,
    iconSize: iconSize,
    iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
    popupAnchor: [0, -iconSize[1] / 2],
  });
};

// Format date for display
const formatDate = (dateStr) => {
  if (!dateStr || dateStr === "N/A") return "N/A";
  return dateStr;
};

// Format time for display
const formatTime = (timeStr) => {
  if (!timeStr || timeStr === "N/A") return "N/A";
  return timeStr;
};

// Get current date and time for bulletin issue date
const getCurrentDateTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[now.getMonth()];
  const day = now.getDate().toString().padStart(2, '0');
  const year = now.getFullYear();
  
  return `${hours}:${minutes}H ${month} ${day}, ${year}`;
};

// Category display name mapping
const getCategoryDisplay = (category) => {
  const displayMap = {
    "super-typhoon": "SUPER TYPHOON",
    "typhoon": "TYPHOON",
    "severe-tropical-storm": "SEVERE TROPICAL STORM",
    "tropical-storm": "TROPICAL STORM",
    "tropical-depression": "TROPICAL DEPRESSION",
    "low-pressure-area": "LOW PRESSURE AREA",
  };
  return displayMap[category] || (category ? category.toUpperCase().replace(/-/g, ' ') : "N/A");
};

// Component to load and display KML file
function KMLLayer() {
  const map = useMap();
  
  useEffect(() => {
    fetch('/Philippine_Area_of_Responsibility.kml')
      .then(response => response.text())
      .then(kmlText => {
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmlText, 'text/xml');
        const coordinates = [];
        const coordElements = kml.getElementsByTagName('coordinates');
        
        for (let i = 0; i < coordElements.length; i++) {
          const coords = coordElements[i].textContent.trim().split(/\s+/);
          const latLngs = coords.map(coord => {
            const [lng, lat] = coord.split(',').map(Number);
            return [lat, lng];
          }).filter(coord => !isNaN(coord[0]) && !isNaN(coord[1]));
          
          if (latLngs.length > 0) {
            coordinates.push(latLngs);
          }
        }
        
        coordinates.forEach(coords => {
          L.polyline(coords, {
            color: '#00FFFF',
            weight: 2,
            opacity: 0.8,
            dashArray: '10, 5'
          }).addTo(map);
        });
      })
      .catch(error => console.error('Error loading KML:', error));
  }, [map]);
  
  return null;
}

// Component to fit map bounds
function FitBounds({ trackingPoints }) {
  const map = useMap();
  
  useEffect(() => {
    if (trackingPoints && trackingPoints.length > 0) {
      const bounds = [];
      trackingPoints.forEach(point => {
        const lat = point.coordinate_latitude || point.lat;
        const lon = point.coordinate_longitude || point.lon;
        if (lat && lon && !isNaN(lat) && !isNaN(lon)) {
          bounds.push([lat, lon]);
        }
      });
      
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 7 });
      }
    }
  }, [map, trackingPoints]);
  
  return null;
}

// Legend Item Component
const LegendItem = ({ icon, label }) => (
  <div className="flex items-center gap-1 text-[9px]">
    <img src={icon} alt={label} className="w-4 h-4" />
    <span>{label}</span>
  </div>
);

const PrintableReport = forwardRef(({ typhoonData, trackingPoints, typhoonName, typhoonColor }, ref) => {
  const [mapReady, setMapReady] = useState(false);
  
  // Get the latest tracking point data for current position
  const latestPoint = trackingPoints && trackingPoints.length > 0 
    ? trackingPoints[trackingPoints.length - 1] 
    : null;
  
  // Calculate map center
  const center = trackingPoints && trackingPoints.length > 0 
    ? [
        trackingPoints.reduce((sum, p) => sum + (p.coordinate_latitude || p.lat || 0), 0) / trackingPoints.length,
        trackingPoints.reduce((sum, p) => sum + (p.coordinate_longitude || p.lon || 0), 0) / trackingPoints.length
      ]
    : [12.8797, 121.7740];

  // Create polyline positions
  const polylinePositions = trackingPoints
    ?.map(point => {
      const lat = point.coordinate_latitude || point.lat;
      const lon = point.coordinate_longitude || point.lon;
      return lat && lon && !isNaN(lat) && !isNaN(lon) ? [lat, lon] : null;
    })
    .filter(pos => pos !== null) || [];

  // Get bulletin number from latest point or count
  const bulletinNumber = latestPoint?.tc_bulletin_number || trackingPoints?.length || 1;

  // Sort tracking points by bulletin number in descending order for table
  const sortedTrackingPoints = [...(trackingPoints || [])].sort((a, b) => {
    const aNum = a.tc_bulletin_number || 0;
    const bNum = b.tc_bulletin_number || 0;
    return bNum - aNum;
  });

  return (
    <div 
      ref={ref} 
      className="printable-report bg-white text-black"
      style={{ 
        width: '1200px', 
        minHeight: '1600px',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      {/* Header */}
      <div className="report-header" style={{ 
        borderBottom: '3px solid #003366',
        paddingBottom: '15px',
        marginBottom: '15px'
      }}>
        <div className="flex items-center justify-between">
          {/* Left Logo */}
          <div className="flex-shrink-0" style={{ width: '80px' }}>
            <img 
              src="/PIODURAN_SEAL.png" 
              alt="Municipality of Pioduran Seal" 
              style={{ width: '80px', height: '80px', objectFit: 'contain' }}
            />
          </div>
          
          {/* Center Title */}
          <div className="text-center flex-grow px-4">
            <h1 style={{ 
              color: '#003366', 
              fontSize: '22px', 
              fontWeight: 'bold',
              margin: '0 0 5px 0',
              letterSpacing: '1px'
            }}>
              MUNICIPAL DISASTER RISK REDUCTION AND MANAGEMENT COUNCIL
            </h1>
            <h2 style={{ 
              color: '#FFD700', 
              backgroundColor: '#003366',
              fontSize: '18px', 
              fontWeight: 'bold',
              margin: '0',
              padding: '5px 20px',
              display: 'inline-block',
              letterSpacing: '2px'
            }}>
              TROPICAL CYCLONE BULLETIN
            </h2>
            <div style={{ marginTop: '10px' }}>
              <p style={{ 
                fontSize: '14px', 
                fontWeight: 'bold',
                color: '#003366',
                margin: '5px 0'
              }}>
                Bulletin No. {bulletinNumber}
              </p>
              <p style={{ 
                fontSize: '12px',
                color: '#666',
                margin: '0'
              }}>
                Issued at {getCurrentDateTime()}
              </p>
            </div>
          </div>
          
          {/* Right Logo */}
          <div className="flex-shrink-0" style={{ width: '80px' }}>
            <img 
              src="/MDRRMO_PIODURAN.png" 
              alt="MDRRMO Pioduran Logo" 
              style={{ width: '80px', height: '80px', objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {/* Left Column - Typhoon Information */}
        <div style={{ width: '45%' }}>
          {/* Tropical Cyclone Information Section */}
          <div style={{ 
            borderBottom: '2px solid #003366',
            paddingBottom: '10px',
            marginBottom: '15px'
          }}>
            <h3 style={{ 
              color: '#003366', 
              fontSize: '14px', 
              fontWeight: 'bold',
              marginBottom: '10px',
              borderBottom: '1px solid #003366',
              paddingBottom: '5px'
            }}>
              TROPICAL CYCLONE INFORMATION
            </h3>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '5px 0', fontWeight: 'bold', width: '35%', fontSize: '12px' }}>NAME:</td>
                  <td style={{ padding: '5px 0', color: '#CC0000', fontWeight: 'bold', fontSize: '14px' }}>
                    {typhoonData?.name || typhoonName || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '5px 0', fontWeight: 'bold', fontSize: '12px' }}>CLASSIFICATION:</td>
                  <td style={{ padding: '5px 0', fontSize: '12px' }}>
                    {getCategoryDisplay(typhoonData?.category)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Current Position and Intensity Section */}
          <div>
            <h3 style={{ 
              color: '#003366', 
              fontSize: '14px', 
              fontWeight: 'bold',
              marginBottom: '10px',
              borderBottom: '1px solid #003366',
              paddingBottom: '5px'
            }}>
              CURRENT POSITION AND INTENSITY
            </h3>
            
            <p style={{ 
              color: '#CC0000', 
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              As of {formatTime(typhoonData?.timestamp)}, {formatDate(typhoonData?.date)}
            </p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '5px 0', fontWeight: 'bold', width: '45%', fontSize: '12px' }}>LOCATION:</td>
                  <td style={{ padding: '5px 0', fontSize: '12px' }}>{typhoonData?.location || "N/A"}</td>
                </tr>
                <tr>
                  <td style={{ padding: '5px 0', fontWeight: 'bold', fontSize: '12px' }}>COORDINATES:</td>
                  <td style={{ padding: '5px 0', fontSize: '12px' }}>
                    {typhoonData?.coordinates?.lat || 0}°N, {typhoonData?.coordinates?.lon || 0}°E
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '5px 0', fontWeight: 'bold', fontSize: '12px' }}>MOVEMENT:</td>
                  <td style={{ padding: '5px 0', fontSize: '12px' }}>
                    {typhoonData?.movement?.direction || "N/A"} at {typhoonData?.movement?.speed || "0"} km/h
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '5px 0', fontWeight: 'bold', fontSize: '12px' }}>MAXIMUM SUSTAINED WINDS:</td>
                  <td style={{ padding: '5px 0', fontSize: '12px' }}>
                    {typhoonData?.windSpeed || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '5px 0', fontWeight: 'bold', fontSize: '12px' }}>CENTRAL PRESSURE:</td>
                  <td style={{ padding: '5px 0', fontSize: '12px' }}>
                    {typhoonData?.centralPressure || "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Map */}
        <div style={{ width: '55%' }}>
          <div style={{ 
            border: '2px solid #003366', 
            borderRadius: '5px', 
            overflow: 'hidden',
            height: '350px',
            position: 'relative'
          }}>
            <MapContainer
              center={center}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
              scrollWheelZoom={false}
              whenReady={() => setMapReady(true)}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <KMLLayer />
              <FitBounds trackingPoints={trackingPoints} />
              
              {/* Polyline connecting tracking points */}
              {polylinePositions.length > 1 && (
                <Polyline
                  positions={polylinePositions}
                  color={typhoonColor?.primary || "#EF4444"}
                  weight={3}
                  opacity={0.9}
                />
              )}
              
              {/* Tracking Point Markers */}
              {trackingPoints?.map((point, index) => {
                const category = point.typhoon_category || point.category || "tropical-storm";
                const lat = point.coordinate_latitude || point.lat;
                const lon = point.coordinate_longitude || point.lon;
                const isCurrent = index === trackingPoints.length - 1;
                
                if (!lat || !lon || isNaN(lat) || isNaN(lon)) return null;
                
                const icon = createLeafletIcon(category, isCurrent);
                
                return (
                  <React.Fragment key={point.id || index}>
                    {isCurrent && (
                      <CircleMarker
                        center={[lat, lon]}
                        radius={15}
                        pathOptions={{
                          color: typhoonColor?.primary || "#EF4444",
                          fillColor: typhoonColor?.primary || "#EF4444",
                          fillOpacity: 0.3,
                          weight: 2,
                        }}
                      />
                    )}
                    <Marker
                      position={[lat, lon]}
                      icon={icon}
                    />
                  </React.Fragment>
                );
              })}
            </MapContainer>
            
            {/* Map Legend Overlay */}
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'rgba(255,255,255,0.95)',
              padding: '8px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              zIndex: 1000,
              fontSize: '10px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px', borderBottom: '1px solid #ccc', paddingBottom: '3px' }}>
                Legend
              </div>
              <LegendItem icon="/legend_icon/super_typhoon.png" label="Super Typhoon" />
              <LegendItem icon="/legend_icon/typhoon.png" label="Typhoon" />
              <LegendItem icon="/legend_icon/severe_tropical_storm.png" label="Severe Tropical Storm" />
              <LegendItem icon="/legend_icon/tropical_storm.png" label="Tropical Storm" />
              <LegendItem icon="/legend_icon/tropical_depression.png" label="Tropical Depression" />
              <LegendItem icon="/legend_icon/low_pressure_area.png" label="Low Pressure Area" />
              <div style={{ marginTop: '5px', borderTop: '1px solid #ccc', paddingTop: '5px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>Typhoon Tracks</div>
                <div className="flex items-center gap-1">
                  <div style={{ 
                    width: '20px', 
                    height: '3px', 
                    backgroundColor: typhoonColor?.primary || "#EF4444" 
                  }} />
                  <span>{typhoonName || "MARING"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Track History Table */}
      <div>
        <h3 style={{ 
          color: '#003366', 
          fontSize: '14px', 
          fontWeight: 'bold',
          marginBottom: '10px',
          borderBottom: '2px solid #003366',
          paddingBottom: '5px'
        }}>
          TRACK HISTORY
        </h3>
        
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '10px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#003366', color: 'white' }}>
              <th style={{ padding: '8px 4px', textAlign: 'center', border: '1px solid #003366' }}>Bulletin No.</th>
              <th style={{ padding: '8px 4px', textAlign: 'center', border: '1px solid #003366' }}>Date</th>
              <th style={{ padding: '8px 4px', textAlign: 'center', border: '1px solid #003366' }}>Time</th>
              <th style={{ padding: '8px 4px', textAlign: 'left', border: '1px solid #003366' }}>Location</th>
              <th style={{ padding: '8px 4px', textAlign: 'center', border: '1px solid #003366' }}>Coordinates</th>
              <th style={{ padding: '8px 4px', textAlign: 'center', border: '1px solid #003366' }}>Category</th>
              <th style={{ padding: '8px 4px', textAlign: 'center', border: '1px solid #003366' }}>Movement</th>
              <th style={{ padding: '8px 4px', textAlign: 'center', border: '1px solid #003366' }}>Max Winds</th>
              <th style={{ padding: '8px 4px', textAlign: 'center', border: '1px solid #003366' }}>Pressure</th>
            </tr>
          </thead>
          <tbody>
            {sortedTrackingPoints.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  No tracking data available
                </td>
              </tr>
            ) : (
              sortedTrackingPoints.map((point, index) => (
                <tr 
                  key={point.id || index} 
                  style={{ 
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5'
                  }}
                >
                  <td style={{ padding: '6px 4px', textAlign: 'center', border: '1px solid #ddd', fontWeight: 'bold' }}>
                    {point.tc_bulletin_number || (sortedTrackingPoints.length - index)}
                  </td>
                  <td style={{ padding: '6px 4px', textAlign: 'center', border: '1px solid #ddd' }}>
                    {point.as_of_date || "-"}
                  </td>
                  <td style={{ padding: '6px 4px', textAlign: 'center', border: '1px solid #ddd' }}>
                    {point.as_of_time || "-"}
                  </td>
                  <td style={{ padding: '6px 4px', textAlign: 'left', border: '1px solid #ddd', maxWidth: '200px' }}>
                    {point.typhoon_location || "-"}
                  </td>
                  <td style={{ padding: '6px 4px', textAlign: 'center', border: '1px solid #ddd', whiteSpace: 'nowrap' }}>
                    {(point.coordinate_latitude || point.lat || 0)}°N, {(point.coordinate_longitude || point.lon || 0)}°E
                  </td>
                  <td style={{ padding: '6px 4px', textAlign: 'center', border: '1px solid #ddd', fontWeight: 'bold' }}>
                    {getCategoryDisplay(point.typhoon_category || point.category)}
                  </td>
                  <td style={{ padding: '6px 4px', textAlign: 'center', border: '1px solid #ddd' }}>
                    {point.typhoon_movement || "-"}
                  </td>
                  <td style={{ padding: '6px 4px', textAlign: 'center', border: '1px solid #ddd' }}>
                    {point.wind_speed || "-"}
                  </td>
                  <td style={{ padding: '6px 4px', textAlign: 'center', border: '1px solid #ddd' }}>
                    {point.central_pressure || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

PrintableReport.displayName = "PrintableReport";

export default PrintableReport;
