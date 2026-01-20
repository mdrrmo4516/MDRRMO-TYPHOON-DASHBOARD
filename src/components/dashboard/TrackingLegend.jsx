import { Card } from "../ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

const legendItems = [
  { label: "Super Typhoon", icon: "/legend_icon/super_typhoon.png" },
  { label: "Typhoon", icon: "/legend_icon/typhoon.png" },
  { label: "Severe Tropical Storm", icon: "/legend_icon/severe_tropical_storm.png" },
  { label: "Tropical Storm", icon: "/legend_icon/tropical_storm.png" },
  { label: "Tropical Depression", icon: "/legend_icon/tropical_depression.png" },
  { label: "Low Pressure Area", icon: "/legend_icon/low_pressure_area.png" },
];

export function TrackingLegend() {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <Card className="bg-card/95 backdrop-blur-sm border-secondary/50 shadow-lg overflow-hidden">
      {/* Header with Minimize Button */}
      <div className="flex items-center justify-between p-2 border-b border-secondary/30">
        <h4 className="text-xs font-semibold text-secondary">Legend</h4>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 hover:bg-secondary/20"
          onClick={() => setIsMinimized(!isMinimized)}
          data-testid="legend-toggle-button"
        >
          {isMinimized ? (
            <ChevronDown className="w-3 h-3 text-secondary" />
          ) : (
            <ChevronUp className="w-3 h-3 text-secondary" />
          )}
        </Button>
      </div>

      {/* Legend Content */}
      {!isMinimized && (
        <div className="p-2 space-y-1">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <img
                src={item.icon}
                alt={item.label}
                className="w-5 h-5 object-contain"
              />
              <span className="text-[10px] text-foreground/80">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
