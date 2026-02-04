import { useState, useCallback, useRef, useMemo } from "react";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { SatelliteMap } from "../components/dashboard/SatelliteMap";
import { TrackingMap } from "../components/dashboard/TrackingMap";
import { TyphoonInfoPanel } from "../components/dashboard/TyphoonInfoPanel";
import { TrackHistoryTable } from "../components/dashboard/TrackHistoryTable";
import { NavigationControls } from "../components/dashboard/NavigationControls";
import { AddTrackingPointDialog } from "../components/dashboard/AddTrackingPointDialog";
import { ManageTrackingDialog } from "../components/dashboard/ManageTrackingDialog";
import { TyphoonSelector } from "../components/dashboard/TyphoonSelector";
import { toast } from "sonner";

// Typhoon color palette for visual distinction
const TYPHOON_COLORS = [
  { primary: "#EF4444", light: "#FCA5A5", name: "Red" },      // Red
  { primary: "#3B82F6", light: "#93C5FD", name: "Blue" },     // Blue
  { primary: "#10B981", light: "#6EE7B7", name: "Green" },    // Green
  { primary: "#8B5CF6", light: "#C4B5FD", name: "Purple" },   // Purple
  { primary: "#F97316", light: "#FDBA74", name: "Orange" },   // Orange
  { primary: "#EC4899", light: "#F9A8D4", name: "Pink" },     // Pink
  { primary: "#06B6D4", light: "#67E8F9", name: "Cyan" },     // Cyan
  { primary: "#EAB308", light: "#FDE047", name: "Yellow" },   // Yellow
];

// Initial typhoon data - empty for fresh start
const initialTyphoonData = {
  bulletinNumber: 0,
  timestamp: "N/A",
  date: "N/A",
  name: "N/A",
  category: "N/A",
  location: "N/A",
  coordinates: { lat: 12.8797, lon: 121.7740 }, // Philippines center
  movement: { direction: "N/A", speed: "N/A" },
  windSpeed: "N/A",
  centralPressure: "N/A",
};

// Initial typhoons array - empty for fresh start
const initialTyphoons = [];

export default function Dashboard() {
  const [typhoons, setTyphoons] = useState(initialTyphoons);
  const [selectedTyphoonId, setSelectedTyphoonId] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef(null);
  
  // Get selected typhoon or create a virtual "All" view
  const selectedTyphoon = useMemo(() => {
    if (selectedTyphoonId === 'all') {
      // Return virtual typhoon representing all typhoons
      const allPoints = typhoons.flatMap(t => t.trackingPoints);
      return {
        id: 'all',
        name: 'All Typhoons',
        trackingPoints: allPoints,
        color: TYPHOON_COLORS[0],
        isActive: true
      };
    }
    return typhoons.find(t => t.id === selectedTyphoonId) || null;
  }, [selectedTyphoonId, typhoons]);

  // Get all tracking points from selected typhoon
  const trackingPoints = selectedTyphoon?.trackingPoints || [];
  
  // Pagination settings
  const itemsPerPage = 3;
  const totalPages = Math.ceil(trackingPoints.length / itemsPerPage);
  
  // Derive typhoon data from the last tracking point (most recent bulletin)
  const typhoonData = trackingPoints.length > 0 
    ? {
        bulletinNumber: trackingPoints[trackingPoints.length - 1].tc_bulletin_number || trackingPoints.length,
        timestamp: trackingPoints[trackingPoints.length - 1].as_of_time || "N/A",
        date: trackingPoints[trackingPoints.length - 1].as_of_date || "N/A",
        name: trackingPoints[trackingPoints.length - 1].typhoon_name || selectedTyphoon?.name || "N/A",
        category: trackingPoints[trackingPoints.length - 1].typhoon_category || trackingPoints[trackingPoints.length - 1].category || "N/A",
        location: trackingPoints[trackingPoints.length - 1].typhoon_location || "N/A",
        coordinates: {
          lat: trackingPoints[trackingPoints.length - 1].coordinate_latitude || trackingPoints[trackingPoints.length - 1].lat || 0,
          lon: trackingPoints[trackingPoints.length - 1].coordinate_longitude || trackingPoints[trackingPoints.length - 1].lon || 0
        },
        movement: {
          direction: (trackingPoints[trackingPoints.length - 1].typhoon_movement || "N/A").split(" at ")[0] || "N/A",
          speed: (trackingPoints[trackingPoints.length - 1].typhoon_movement || "").split(" at ")[1]?.replace(" km/h", "") || "0"
        },
        windSpeed: trackingPoints[trackingPoints.length - 1].wind_speed || "N/A",
        centralPressure: trackingPoints[trackingPoints.length - 1].central_pressure || "N/A"
      }
    : initialTyphoonData;
  
  // Get paginated tracking points
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTrackingPoints = trackingPoints.slice(startIndex, endIndex);

  // Create new typhoon
  const handleCreateTyphoon = useCallback((typhoonName) => {
    const newTyphoon = {
      id: `typhoon_${Date.now()}`,
      name: typhoonName,
      trackingPoints: [],
      color: TYPHOON_COLORS[typhoons.length % TYPHOON_COLORS.length],
      isActive: true,
      createdAt: Date.now()
    };
    
    setTyphoons((prev) => [...prev, newTyphoon]);
    setSelectedTyphoonId(newTyphoon.id);
    toast.success(`Typhoon "${typhoonName}" created`);
    return newTyphoon.id;
  }, [typhoons.length]);

  // Delete typhoon
  const handleDeleteTyphoon = useCallback((typhoonId) => {
    const typhoon = typhoons.find(t => t.id === typhoonId);
    if (!typhoon) return;
    
    setTyphoons((prev) => prev.filter(t => t.id !== typhoonId));
    
    // If deleted typhoon was selected, switch to 'all' or first typhoon
    if (selectedTyphoonId === typhoonId) {
      if (typhoons.length > 1) {
        setSelectedTyphoonId('all');
      } else {
        setSelectedTyphoonId(null);
      }
    }
    
    toast.success(`Typhoon "${typhoon.name}" deleted`);
  }, [typhoons, selectedTyphoonId]);

  // Toggle typhoon visibility
  const handleToggleTyphoonVisibility = useCallback((typhoonId) => {
    setTyphoons((prev) =>
      prev.map((t) =>
        t.id === typhoonId ? { ...t, isActive: !t.isActive } : t
      )
    );
  }, []);

  // Add new tracking point
  const handleAddTrackingPoint = useCallback((newPoint, targetTyphoonId = null) => {
    const point = {
      ...newPoint,
      id: Date.now(),
    };
    
    const typhoonId = targetTyphoonId || selectedTyphoonId;
    
    // If no typhoon exists or selected, create a new one
    if (!typhoonId || typhoonId === 'all') {
      const typhoonName = newPoint.typhoon_name || 'Unnamed Typhoon';
      const newTyphoonId = handleCreateTyphoon(typhoonName);
      
      setTyphoons((prev) =>
        prev.map((t) =>
          t.id === newTyphoonId
            ? { ...t, trackingPoints: [...t.trackingPoints, point] }
            : t
        )
      );
    } else {
      setTyphoons((prev) =>
        prev.map((t) =>
          t.id === typhoonId
            ? { ...t, trackingPoints: [...t.trackingPoints, point] }
            : t
        )
      );
    }
    
    // Navigate to the last page to show the new point
    const currentTyphoon = typhoons.find(t => t.id === typhoonId);
    const newLength = (currentTyphoon?.trackingPoints.length || 0) + 1;
    const newTotalPages = Math.ceil(newLength / itemsPerPage);
    setCurrentPage(newTotalPages);
    
    toast.success("Tracking point added successfully");
  }, [selectedTyphoonId, typhoons, handleCreateTyphoon]);

  // Delete tracking point
  const handleDeleteTrackingPoint = useCallback((id) => {
    setTrackingPoints((prev) => prev.filter((p) => p.id !== id));
    toast.success("Tracking point removed");
  }, []);

  // Update tracking point
  const handleUpdateTrackingPoint = useCallback((id, updates) => {
    setTrackingPoints((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    toast.success("Tracking point updated");
  }, []);

  // Navigation handlers for pagination
  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      toast.info(`Viewing page ${currentPage - 1} of ${totalPages}`);
    }
  }, [currentPage, totalPages]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      toast.info(`Viewing page ${currentPage + 1} of ${totalPages}`);
    }
  }, [currentPage, totalPages]);

  // Refresh data
  const handleRefresh = useCallback(() => {
    // Reset to last page to show most recent data
    const newTotalPages = Math.ceil(trackingPoints.length / itemsPerPage);
    setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
    toast.success("Data refreshed - showing latest bulletin");
  }, [trackingPoints.length]);

  // Export tracking points to CSV
  const handleExportCSV = useCallback(() => {
    try {
      // Create CSV header with all fields
      const headers = [
        "id",
        "tc_bulletin_number",
        "as_of_time",
        "as_of_date",
        "typhoon_name",
        "typhoon_category",
        "typhoon_location",
        "coordinate_latitude",
        "coordinate_longitude",
        "typhoon_movement",
        "wind_speed",
        "central_pressure",
        "current"
      ];
      
      // Create CSV rows
      const rows = trackingPoints.map((point) => [
        point.id,
        point.tc_bulletin_number || "",
        point.as_of_time || "",
        point.as_of_date || "",
        point.typhoon_name || "",
        point.typhoon_category || point.category || "",
        `"${(point.typhoon_location || "").replace(/"/g, '""')}"`, // Escape quotes in location
        point.coordinate_latitude || point.lat || "",
        point.coordinate_longitude || point.lon || "",
        `"${(point.typhoon_movement || "").replace(/"/g, '""')}"`,
        point.wind_speed || "",
        point.central_pressure || "",
        point.current ? "true" : "false",
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `typhoon_tracking_${Date.now()}.csv`);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Exported ${trackingPoints.length} tracking points to CSV`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export CSV file");
    }
  }, [trackingPoints]);

  // Import tracking points from CSV
  const handleImportCSV = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      toast.error("Please select a valid CSV file");
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== "string") {
          throw new Error("Invalid file content");
        }

        // Parse CSV
        const lines = text.split("\n").filter((line) => line.trim());
        if (lines.length < 2) {
          throw new Error("CSV file is empty or invalid");
        }

        // Get headers and validate
        const headers = lines[0].split(",").map((h) => h.trim());
        
        // Support both old and new format
        const isNewFormat = headers.includes("tc_bulletin_number") || headers.includes("typhoon_name");
        
        // Parse data rows
        const newPoints = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          if (!line.trim()) continue;
          
          // Handle quoted fields properly
          const values = [];
          let currentValue = "";
          let insideQuotes = false;
          
          for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
              insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
              values.push(currentValue.trim());
              currentValue = "";
            } else {
              currentValue += char;
            }
          }
          values.push(currentValue.trim());
          
          if (values.length < headers.length - 2) continue; // Allow some flexibility

          const point = {};
          headers.forEach((header, index) => {
            const value = values[index] || "";
            
            if (header === "id") {
              point[header] = parseInt(value) || Date.now() + i;
            } else if (header === "lat" || header === "lon" || 
                       header === "coordinate_latitude" || header === "coordinate_longitude") {
              point[header] = parseFloat(value) || 0;
            } else if (header === "current") {
              point[header] = value.toLowerCase() === "true";
            } else if (header === "tc_bulletin_number") {
              point[header] = value ? parseInt(value) : "";
            } else {
              // Remove surrounding quotes if present
              point[header] = value.replace(/^"(.*)"$/, '$1').replace(/""/g, '"');
            }
          });

          // Ensure backward compatibility - map new fields to old fields
          if (isNewFormat) {
            point.lat = point.coordinate_latitude || point.lat || 0;
            point.lon = point.coordinate_longitude || point.lon || 0;
            point.category = point.typhoon_category || point.category || "tropical-storm";
            if (!point.datetime && point.as_of_date && point.as_of_time) {
              point.datetime = `${point.as_of_date} ${point.as_of_time}`;
            }
          } else {
            // Old format - ensure new fields exist
            point.coordinate_latitude = point.lat;
            point.coordinate_longitude = point.lon;
            point.typhoon_category = point.category;
          }

          newPoints.push(point);
        }

        if (newPoints.length === 0) {
          throw new Error("No valid data found in CSV file");
        }

        // Overwrite all tracking points
        setTrackingPoints(newPoints);
        // Reset to last page to show most recent data
        const newTotalPages = Math.ceil(newPoints.length / itemsPerPage);
        setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
        toast.success(`Successfully imported ${newPoints.length} tracking points (all previous data overwritten)`);
      } catch (error) {
        console.error("Import error:", error);
        toast.error(error.message || "Failed to import CSV file");
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read CSV file");
    };

    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // Trigger file input click
  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="min-h-screen bg-background p-2 md:p-4">
      {/* Dashboard Header with Control Buttons */}
      <DashboardHeader
        onRefresh={handleRefresh}
        onExportCSV={handleExportCSV}
        onImportCSV={handleImportClick}
        onAddPoint={() => setIsAddDialogOpen(true)}
        onManagePoints={() => setIsManageDialogOpen(true)}
        trackingPointsCount={trackingPoints.length}
      />

      {/* Hidden File Input for CSV Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleImportCSV}
        style={{ display: "none" }}
      />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-2">
        {/* Left Column - Satellite Map */}
        <div className="lg:col-span-4">
          <SatelliteMap />
        </div>

        {/* Middle Column - Tracking Map */}
        <div className="lg:col-span-5">
          <TrackingMap
            trackingPoints={trackingPoints}
            onAddPoint={() => setIsAddDialogOpen(true)}
          />
        </div>

        {/* Right Column - Info Panel */}
        <div className="lg:col-span-3">
          <TyphoonInfoPanel data={typhoonData} />
        </div>
      </div>

      {/* Track History Table */}
      <div className="mt-4 px-2">
        <TrackHistoryTable 
          trackingPoints={paginatedTrackingPoints}
          currentPage={currentPage}
          totalPages={totalPages}
          totalPoints={trackingPoints.length}
        />
      </div>

      {/* Navigation Controls */}
      <NavigationControls
        onPrevious={handlePrevious}
        onNext={handleNext}
        canGoPrevious={currentPage > 1}
        canGoNext={currentPage < totalPages}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      {/* Dialogs */}
      <AddTrackingPointDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddTrackingPoint}
      />

      <ManageTrackingDialog
        open={isManageDialogOpen}
        onOpenChange={setIsManageDialogOpen}
        points={trackingPoints}
        onDelete={handleDeleteTrackingPoint}
        onUpdate={handleUpdateTrackingPoint}
      />
    </div>
  );
}
