import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Trash2, MapPin, Clock, Wind, Gauge } from "lucide-react";

const categoryLabels = {
  "super-typhoon": "Super Typhoon",
  "typhoon": "Typhoon",
  "severe-tropical-storm": "Severe TS",
  "tropical-storm": "Tropical Storm",
  "tropical-depression": "TD",
  "low-pressure": "LPA",
  "low-pressure-area": "LPA",
};

// Helper function to get icon path from category
const getCategoryIcon = (category) => {
  const iconMap = {
    "super-typhoon": "/legend_icon/super_typhoon.png",
    "typhoon": "/legend_icon/typhoon.png",
    "severe-tropical-storm": "/legend_icon/severe_tropical_storm.png",
    "tropical-storm": "/legend_icon/tropical_storm.png",
    "tropical-depression": "/legend_icon/tropical_depression.png",
    "low-pressure": "/legend_icon/low_pressure_area.png",
  };
  return iconMap[category] || "/legend_icon/tropical_storm.png";
};

export function ManageTrackingDialog({ open, onOpenChange, points, onDelete }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-secondary sm:max-w-[700px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-secondary flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Manage Tracking Points
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            View and manage typhoon tracking history points with detailed information.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-180px)] pr-4">
          <div className="space-y-3">
            {points.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No tracking points added yet.
              </p>
            ) : (
              points.map((point) => (
                <div
                  key={point.id}
                  className={`p-4 rounded-lg border ${
                    point.current 
                      ? 'bg-secondary/10 border-secondary shadow-md' 
                      : 'bg-card border-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <img
                        src={getCategoryIcon(point.category || point.typhoon_category)}
                        alt={point.category || point.typhoon_category}
                        className="w-6 h-6 object-contain mt-1"
                      />
                      <div className="flex-1 space-y-2">
                        {/* Header with name and bulletin */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {point.typhoon_name && (
                            <span className="font-bold text-foreground text-base">
                              {point.typhoon_name}
                            </span>
                          )}
                          {point.tc_bulletin_number && (
                            <Badge variant="outline" className="text-xs border-secondary text-secondary">
                              Bulletin #{point.tc_bulletin_number}
                            </Badge>
                          )}
                          {point.current && (
                            <Badge className="bg-secondary text-secondary-foreground text-xs">
                              Current Position
                            </Badge>
                          )}
                        </div>

                        {/* Category */}
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs border-border">
                            {categoryLabels[point.category || point.typhoon_category] || point.category || point.typhoon_category}
                          </Badge>
                          {(point.datetime || (point.as_of_date && point.as_of_time)) && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {point.datetime || `${point.as_of_date} ${point.as_of_time}`}
                            </span>
                          )}
                        </div>

                        {/* Coordinates */}
                        <div className="font-mono text-sm text-foreground">
                           {point.lat || point.coordinate_latitude}°N, {point.lon || point.coordinate_longitude}°E
                        </div>

                        {/* Location Description */}
                        {point.typhoon_location && (
                          <div className="text-xs text-muted-foreground">
                            {point.typhoon_location}
                          </div>
                        )}

                        {/* Movement, Wind Speed, Pressure */}
                        <div className="flex flex-wrap gap-3 text-xs">
                          {point.typhoon_movement && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              <span>{point.typhoon_movement}</span>
                            </div>
                          )}
                          {point.wind_speed && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Wind className="w-3 h-3" />
                              <span>{point.wind_speed}</span>
                            </div>
                          )}
                          {point.central_pressure && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Gauge className="w-3 h-3" />
                              <span>{point.central_pressure}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(point.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                      disabled={point.current}
                      title={point.current ? "Cannot delete current position" : "Delete point"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Total: {points.length} points
          </p>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-secondary text-secondary"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
