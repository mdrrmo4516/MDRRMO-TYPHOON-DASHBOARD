import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Satellite, Maximize2, Minimize2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function SatelliteMap() {
  const timestamp = "January 15, 2026, 9:20 am PHT";
  const source = "SA HIMAWARI-8 IR1";
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cardRef = useRef(null);

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
            <Satellite className="w-4 h-4" />
            Map 1 - Satellite Imagery
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-secondary text-secondary text-xs">
              LIVE
            </Badge>
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
        <div className={`map-frame rounded-md overflow-hidden ${isFullscreen ? 'h-full' : 'aspect-[4/3]'}`}>
          <div className="relative w-full h-full bg-primary-dark overflow-hidden">
            {/* Satellite Image - Cropped to Red Box Area */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="https://src.meteopilipinas.gov.ph/repo/mtsat-colored/24hour/latest-him-colored.gif"
                alt="Satellite imagery showing typhoon (cropped to area of interest)"
                className="w-full h-full object-cover"
                style={{
                  transform: 'scale(1.67)',
                  objectFit: 'cover'
                }}
                loading="eager"
              />
            </div>
            {/* Red border overlay to show the cropped area boundary */}
            <div className="absolute inset-0 border-2 border-red-500 pointer-events-none"></div>
          </div>
        </div>
        {/* Legend */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-red-500"></span>
            <span className="text-muted-foreground">Intense</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-orange-500"></span>
            <span className="text-muted-foreground">Strong</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-yellow-400"></span>
            <span className="text-muted-foreground">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-blue-400"></span>
            <span className="text-muted-foreground">Weak</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
