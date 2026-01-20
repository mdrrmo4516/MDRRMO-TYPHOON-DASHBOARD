import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import {
  FileText,
  Clock,
  CloudLightning,
  MapPin,
  Navigation,
  Wind,
  Gauge,
} from "lucide-react";

function InfoRow({ label, value, icon: Icon, highlight = false }) {
  return (
    <div className="dashboard-panel p-2 rounded-md">
      <div className="flex items-center gap-1 mb-0.5">
        {Icon && <Icon className="w-3 h-3 text-secondary" />}
        <span className="dashboard-label text-xs">{label}</span>
      </div>
      <p
        className={`dashboard-value text-xs md:text-sm ${
          highlight ? 'text-secondary font-extrabold text-sm md:text-base' : ''
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function TyphoonInfoPanel({ data }) {
  // Helper function to format category display
  const formatCategory = (category) => {
    if (!category || category === "N/A") return "N/A";
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to format wind speed
  const formatWindSpeed = (windSpeed) => {
    if (!windSpeed || windSpeed === "N/A") return "N/A";
    // If already formatted with units, return as is
    if (windSpeed.toString().includes("km/h")) return windSpeed;
    return `${windSpeed} km/h`;
  };

  // Helper function to format central pressure
  const formatPressure = (pressure) => {
    if (!pressure || pressure === "N/A") return "N/A";
    // If already formatted with units, return as is
    if (pressure.toString().includes("hPa")) return pressure;
    return `${pressure} hPa`;
  };

  return (
    <Card className="dashboard-panel p-2 h-full">
      <div className="space-y-1.5">
        {/* Bulletin Number */}
        <div className="grid grid-cols-2 gap-1.5">
          <InfoRow
            label="TC Bulletin #:"
            value={data.bulletinNumber}
            icon={FileText}
          />
          <div className="dashboard-panel p-2 rounded-md">
            <div className="flex items-center gap-1 mb-0.5">
              <Clock className="w-3 h-3 text-secondary" />
              <span className="dashboard-label text-xs">As of (Time & Date)</span>
            </div>
            <p className="dashboard-value text-xs">
              {data.timestamp}
            </p>
            <p className="dashboard-value text-xs">
              {data.date}
            </p>
          </div>
        </div>

        <Separator className="bg-secondary/30 my-1" />

        {/* Typhoon Name */}
        <InfoRow
          label="Typhoon Cyclone Name:"
          value={data.name}
          icon={CloudLightning}
          highlight
        />

        {/* Category */}
        <InfoRow
          label="Typhoon Category:"
          value={formatCategory(data.category)}
          icon={CloudLightning}
        />

        {/* Location */}
        <InfoRow
          label="Typhoon Location:"
          value={data.location}
          icon={MapPin}
        />

        {/* Coordinates */}
        <div className="dashboard-panel p-2 rounded-md">
          <div className="flex items-center gap-1 mb-0.5">
            <Navigation className="w-3 h-3 text-secondary" />
            <span className="dashboard-label text-xs">Typhoon Coordinates:</span>
          </div>
          <p className="dashboard-value text-xs">
            Lat: {data.coordinates.lat}°N | Lon: {data.coordinates.lon}°E
          </p>
        </div>

        {/* Movement */}
        <InfoRow
          label="Typhoon Movement (Direction & Speed):"
          value={`${data.movement.direction} ${data.movement.speed}${data.movement.speed !== "0" && !data.movement.speed.includes("km/h") ? " km/h" : ""}`}
          icon={Navigation}
        />

        {/* Wind Speed & Central Pressure - 2 Column Layout */}
        <div className="grid grid-cols-2 gap-1.5">
          <InfoRow
            label="Wind Speed:"
            value={formatWindSpeed(data.windSpeed)}
            icon={Wind}
          />
          <InfoRow
            label="Central Pressure:"
            value={formatPressure(data.centralPressure)}
            icon={Gauge}
          />
        </div>
      </div>
    </Card>
  );
}
