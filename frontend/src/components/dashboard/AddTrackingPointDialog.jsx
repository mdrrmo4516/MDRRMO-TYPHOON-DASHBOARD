import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MapPin } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

const categoryOptions = [
  { value: "super-typhoon", label: "Super Typhoon", icon: "/legend_icon/super_typhoon.png" },
  { value: "typhoon", label: "Typhoon", icon: "/legend_icon/typhoon.png" },
  { value: "severe-tropical-storm", label: "Severe Tropical Storm", icon: "/legend_icon/severe_tropical_storm.png" },
  { value: "tropical-storm", label: "Tropical Storm", icon: "/legend_icon/tropical_storm.png" },
  { value: "tropical-depression", label: "Tropical Depression", icon: "/legend_icon/tropical_depression.png" },
  { value: "low-pressure-area", label: "Low Pressure Area", icon: "/legend_icon/low_pressure_area.png" },
];

export function AddTrackingPointDialog({ open, onOpenChange, onAdd }) {
  const [formData, setFormData] = useState({
    tc_bulletin_number: "",
    as_of_time: "",
    as_of_date: "",
    typhoon_name: "",
    typhoon_category: "tropical-storm",
    typhoon_location: "",
    coordinate_latitude: "",
    coordinate_longitude: "",
    typhoon_movement: "",
    wind_speed: "",
    central_pressure: "",
    datetime: "",
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.coordinate_latitude || !formData.coordinate_longitude) {
      return;
    }

    let datetime = formData.datetime;
    if (formData.as_of_date && formData.as_of_time) {
      datetime = `${formatDate(formData.as_of_date)} ${formData.as_of_time}`;
    }
    
    onAdd({
      tc_bulletin_number: formData.tc_bulletin_number || "",
      as_of_time: formData.as_of_time || "",
      as_of_date: formData.as_of_date || "",
      typhoon_name: formData.typhoon_name || "",
      typhoon_category: formData.typhoon_category,
      typhoon_location: formData.typhoon_location || "",
      coordinate_latitude: parseFloat(formData.coordinate_latitude),
      coordinate_longitude: parseFloat(formData.coordinate_longitude),
      typhoon_movement: formData.typhoon_movement || "",
      wind_speed: formData.wind_speed || "",
      central_pressure: formData.central_pressure || "",
      lat: parseFloat(formData.coordinate_latitude),
      lon: parseFloat(formData.coordinate_longitude),
      category: formData.typhoon_category,
      datetime: datetime || "",
    });
    
    setFormData({
      tc_bulletin_number: "",
      as_of_time: "",
      as_of_date: "",
      typhoon_name: "",
      typhoon_category: "tropical-storm",
      typhoon_location: "",
      coordinate_latitude: "",
      coordinate_longitude: "",
      typhoon_movement: "",
      wind_speed: "",
      central_pressure: "",
      datetime: "",
    });
    onOpenChange(false);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const selectedCategory = categoryOptions.find(opt => opt.value === formData.typhoon_category);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-secondary sm:max-w-[600px] max-h-[95vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-secondary flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Add Tracking Point
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new tracking point with complete typhoon information.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="grid gap-4 py-4">
              {/* Bulletin Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                  Bulletin Information
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tc_bulletin_number" className="text-foreground text-xs">
                      Bulletin #
                    </Label>
                    <Input
                      id="tc_bulletin_number"
                      type="number"
                      placeholder="e.g., 5"
                      value={formData.tc_bulletin_number}
                      onChange={(e) => handleChange("tc_bulletin_number", e.target.value)}
                      className="bg-input border-border h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="as_of_time" className="text-foreground text-xs">
                      Time
                    </Label>
                    <Input
                      id="as_of_time"
                      type="time"
                      placeholder="Select time"
                      value={formData.as_of_time}
                      onChange={(e) => handleChange("as_of_time", e.target.value)}
                      className="bg-input border-border h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="as_of_date" className="text-foreground text-xs">
                      Date
                    </Label>
                    <Input
                      id="as_of_date"
                      type="date"
                      placeholder="Select date"
                      value={formData.as_of_date}
                      onChange={(e) => handleChange("as_of_date", e.target.value)}
                      className="bg-input border-border h-9"
                    />
                  </div>
                </div>
              </div>
              
              {/* Typhoon Details */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                  Typhoon Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="typhoon_name" className="text-foreground text-xs">
                      Typhoon Name
                    </Label>
                    <Input
                      id="typhoon_name"
                      type="text"
                      placeholder="e.g., ADA"
                      value={formData.typhoon_name}
                      onChange={(e) => handleChange("typhoon_name", e.target.value)}
                      className="bg-input border-border h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="typhoon_category" className="text-foreground text-xs">
                      Category
                    </Label>
                    <Select
                      value={formData.typhoon_category}
                      onValueChange={(value) => handleChange("typhoon_category", value)}
                    >
                      <SelectTrigger className="bg-input border-border h-9">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            {selectedCategory && (
                              <img
                                src={selectedCategory.icon}
                                alt={selectedCategory.label}
                                className="w-4 h-4 object-contain"
                              />
                            )}
                            <span className="text-sm">{selectedCategory?.label}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <img
                                src={option.icon}
                                alt={option.label}
                                className="w-4 h-4 object-contain"
                              />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Location & Coordinates */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                  Location & Coordinates
                </h4>
                <div className="space-y-2">
                  <Label htmlFor="typhoon_location" className="text-foreground text-xs">
                    Location Description
                  </Label>
                  <Input
                    id="typhoon_location"
                    type="text"
                    placeholder="e.g., 256 km East of Guiuan, Eastern Samar"
                    value={formData.typhoon_location}
                    onChange={(e) => handleChange("typhoon_location", e.target.value)}
                    className="bg-input border-border h-9"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="coordinate_latitude" className="text-foreground text-xs">
                      Latitude (°N) *
                    </Label>
                    <Input
                      id="coordinate_latitude"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 11.0"
                      value={formData.coordinate_latitude}
                      onChange={(e) => handleChange("coordinate_latitude", e.target.value)}
                      className="bg-input border-border h-9"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coordinate_longitude" className="text-foreground text-xs">
                      Longitude (°E) *
                    </Label>
                    <Input
                      id="coordinate_longitude"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 128.2"
                      value={formData.coordinate_longitude}
                      onChange={(e) => handleChange("coordinate_longitude", e.target.value)}
                      className="bg-input border-border h-9"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Movement & Intensity */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                  Movement & Intensity
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="typhoon_movement" className="text-foreground text-xs">
                      Movement
                    </Label>
                    <Input
                      id="typhoon_movement"
                      type="text"
                      placeholder=""
                      value={formData.typhoon_movement}
                      onChange={(e) => handleChange("typhoon_movement", e.target.value)}
                      className="bg-input border-border h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wind_speed" className="text-foreground text-xs">
                      Wind Speed
                    </Label>
                    <Input
                      id="wind_speed"
                      type="text"
                      placeholder=""
                      value={formData.wind_speed}
                      onChange={(e) => handleChange("wind_speed", e.target.value)}
                      className="bg-input border-border h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="central_pressure" className="text-foreground text-xs">
                      Central Pressure
                    </Label>
                    <Input
                      id="central_pressure"
                      type="text"
                      placeholder=""
                      value={formData.central_pressure}
                      onChange={(e) => handleChange("central_pressure", e.target.value)}
                      className="bg-input border-border h-9"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter className="shrink-0 mt-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-muted-foreground text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Add Point
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
