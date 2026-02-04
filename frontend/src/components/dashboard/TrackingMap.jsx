import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Map, Plus, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "../ui/button";
import { TrackingLegend } from "./TrackingLegend";
import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  const iconSize = isCurrent ? [56, 56] : [40, 40];
  
  return L.icon({
    iconUrl: iconUrl,
    iconSize: iconSize,
    iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
    popupAnchor: [0, -iconSize[1] / 2],
    className: isCurrent ? 'current-typhoon-marker' : 'typhoon-marker'
  });
};

// Component to load and display KML file
function KMLLayer() {
  const map = useMap();
  
  useEffect(() => {
    // Load KML file
    fetch('/Philippine_Area_of_Responsibility.kml')
      .then(response => response.text())
      .then(kmlText => {
        // Parse KML
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmlText, 'text/xml');
        
        // Extract coordinates from KML
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
        
        // Draw the KML boundaries on map
        coordinates.forEach(coords => {
          L.polyline(coords, {
            color: '#00FFFF',  // Cyan color matching KML style
            weight: 3,
            opacity: 0.8,
            dashArray: '10, 5'
          }).addTo(map);
        });
      })
      .catch(error => {
        console.error('Error loading KML:', error);
      });
  }, [map]);
  
  return null;
}

// Component to fit map bounds to show all markers
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
        // Add some padding to the bounds
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
      }
    }
  }, [map, trackingPoints]);
  
  return null;
}

export function TrackingMap({ typhoons = [], selectedTyphoonId, onAddPoint }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cardRef = useRef(null);
  
  // Get visible typhoons (only active ones)
  const visibleTyphoons = typhoons.filter(t => t.isActive);
  
  // Get all tracking points from visible typhoons
  const allTrackingPoints = visibleTyphoons.flatMap(t => 
    t.trackingPoints.map(p => ({ ...p, typhoonColor: t.color, typhoonName: t.name }))
  );
  
  // Calculate center based on all tracking points, or use Philippines center as default
  const center = allTrackingPoints.length > 0 
    ? [
        allTrackingPoints.reduce((sum, p) => sum + (p.coordinate_latitude || p.lat || 0), 0) / allTrackingPoints.length,
        allTrackingPoints.reduce((sum, p) => sum + (p.coordinate_longitude || p.lon || 0), 0) / allTrackingPoints.length
      ]
    : [12.8797, 121.7740];
  const zoom = 6;

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await cardRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  // Listen for fullscreen changes
  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  // Add event listener for fullscreen changes
  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <Card ref={cardRef} className="dashboard-panel h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm md:text-base font-semibold text-secondary flex items-center gap-2">
            <Map className="w-4 h-4" />
            Philippine PAR - Typhoon Track
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-secondary text-secondary text-xs">
              {allTrackingPoints.length} Points ({visibleTyphoons.length} Typhoons)
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-secondary hover:bg-secondary/10"
              onClick={onAddPoint}
              title="Add Tracking Point"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-secondary hover:bg-secondary/10"
              onClick={handleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className={`pt-2 ${isFullscreen ? 'h-[calc(100vh-200px)]' : ''}`}>
        <div className={`map-frame rounded-md overflow-hidden relative ${isFullscreen ? 'h-full' : 'aspect-[4/3]'}`}>
          {/* Leaflet Map */}
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
            scrollWheelZoom={true}
          >
            {/* OpenStreetMap Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Load KML Layer */}
            <KMLLayer />
            
            {/* Auto-fit bounds to show all tracking points */}
            <FitBounds trackingPoints={allTrackingPoints} />
            
            {/* Render each typhoon's track */}
            {visibleTyphoons.map((typhoon) => {
              // Create polyline coordinates from this typhoon's tracking points
              const polylinePositions = typhoon.trackingPoints
                .map(point => {
                  const lat = point.coordinate_latitude || point.lat;
                  const lon = point.coordinate_longitude || point.lon;
                  return lat && lon && !isNaN(lat) && !isNaN(lon) ? [lat, lon] : null;
                })
                .filter(pos => pos !== null);

              return (
                <React.Fragment key={typhoon.id}>
                  {/* Polyline connecting tracking points for this typhoon */}
                  {polylinePositions.length > 1 && (
                    <Polyline
                      positions={polylinePositions}
                      color={typhoon.color.primary}
                      weight={4}
                      opacity={0.8}
                      dashArray={selectedTyphoonId === typhoon.id ? null : "5, 10"}
                    />
                  )}
                  
                  {/* Tracking Point Markers for this typhoon */}
                  {typhoon.trackingPoints.map((point, index) => {
                    const isCurrent = point.current || false;
                    const category = point.typhoon_category || point.category || "tropical-storm";
                    const lat = point.coordinate_latitude || point.lat;
                    const lon = point.coordinate_longitude || point.lon;
                    
                    // Skip if coordinates are invalid
                    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
                      return null;
                    }
                    
                    const icon = createLeafletIcon(category, isCurrent);
                    
                    return (
                      <React.Fragment key={point.id}>
                        {/* Add pulsing circle for current position */}
                        {isCurrent && (
                          <CircleMarker
                            center={[lat, lon]}
                            radius={20}
                            pathOptions={{
                              color: typhoon.color.primary,
                              fillColor: typhoon.color.primary,
                              fillOpacity: 0.3,
                              weight: 3,
                              opacity: 0.8,
                            }}
                          />
                        )}
                        
                        {/* Add colored circle behind marker */}
                        <CircleMarker
                          center={[lat, lon]}
                          radius={8}
                          pathOptions={{
                            color: typhoon.color.primary,
                            fillColor: typhoon.color.light,
                            fillOpacity: 0.6,
                            weight: 2,
                          }}
                        />
                        
                        <Marker
                          position={[lat, lon]}
                          icon={icon}
                          title={`${typhoon.name} - Point ${index + 1}${isCurrent ? ' (Current)' : ''}`}
                          zIndexOffset={isCurrent ? 1000 : index * 10}
                        >
                          <Popup>
                            <div className="min-w-[200px] p-2">
                              <h3 
                                className="font-bold text-base mb-2 border-b pb-1"
                                style={{ color: typhoon.color.primary }}
                              >
                                {typhoon.name} {isCurrent && '(Current)'}
                              </h3>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="font-semibold">Bulletin #:</span>
                                  <span>{point.tc_bulletin_number || index + 1}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">As of Time:</span>
                                  <span>{point.as_of_time || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">As of Date:</span>
                                  <span>{point.as_of_date || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">Latitude:</span>
                                  <span>{lat}°N</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">Longitude:</span>
                                  <span>{lon}°E</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">Direction:</span>
                                  <span>{point.typhoon_movement || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">Category:</span>
                                  <span className="capitalize">
                                    {(point.typhoon_category || point.category || 'N/A')
                                      .split('-')
                                      .join(' ')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </MapContainer>
          
          {/* Tracking Legend Overlay */}
          <div className="absolute top-2 right-2 z-[10] space-y-2">
            <TrackingLegend />
            
            {/* Typhoon Color Legend */}
            {visibleTyphoons.length > 0 && (
              <Card className="bg-card/95 backdrop-blur-sm border-secondary/50 shadow-lg">
                <div className="p-2">
                  <h4 className="text-xs font-semibold text-secondary mb-2">Typhoon Tracks</h4>
                  <div className="space-y-1">
                    {visibleTyphoons.map((typhoon) => (
                      <div key={typhoon.id} className="flex items-center gap-2">
                        <div 
                          className="w-4 h-1 rounded"
                          style={{ backgroundColor: typhoon.color.primary }}
                        />
                        <span className="text-[10px] text-foreground/80 max-w-[100px] truncate">
                          {typhoon.name}
                        </span>
                        <span className="text-[9px] text-muted-foreground">
                          ({typhoon.trackingPoints.length})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>


      </CardContent>
    </Card>
  );
}
