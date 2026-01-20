import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { History } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const categoryColors = {
  "super-typhoon": "text-red-600 font-bold",
  "typhoon": "text-orange-600 font-bold",
  "severe-tropical-storm": "text-yellow-600 font-bold",
  "tropical-storm": "text-blue-600 font-bold",
  "tropical-depression": "text-green-600 font-semibold",
  "low-pressure-area": "text-gray-600",
};

const getCategoryDisplay = (category) => {
  const displayMap = {
    "super-typhoon": "Super Typhoon",
    "typhoon": "Typhoon",
    "severe-tropical-storm": "Severe TS",
    "tropical-storm": "Tropical Storm",
    "tropical-depression": "TD",
    "low-pressure-area": "LPA",
  };
  return displayMap[category] || category;
};

export function TrackHistoryTable({ trackingPoints = [], currentPage = 1, totalPages = 1, totalPoints = 0 }) {
  return (
    <Card className="dashboard-panel" data-testid="track-history-table">
      <CardHeader className="pt-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm md:text-base font-semibold text-secondary flex items-center gap-4">
            <History className="w-4 h-4" />
            Track History ({totalPoints} total points)
          </CardTitle>
          <div className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <Table>
            <TableHeader>

              <TableRow className="border-secondary/30 hover:bg-transparent">
                <TableHead className="bg-secondary/20 text-foreground text-xs font-semibold text-center">
                  Bulletin No.
                </TableHead>
                <TableHead className="bg-secondary/20 text-foreground text-xs font-semibold text-center">
                  Time
                </TableHead>
                <TableHead className="bg-secondary/20 text-foreground text-xs font-semibold text-center">
                  Date
                </TableHead>
                <TableHead className="bg-secondary/20 text-foreground text-xs font-semibold text-center">
                  Typhoon Name
                </TableHead>
                <TableHead className="bg-secondary/20 text-foreground text-xs font-semibold text-center">
                  Lat. (°N)
                </TableHead>
                <TableHead className="bg-secondary/20 text-foreground text-xs font-semibold text-center">
                  Lon. (°E)
                </TableHead>
                <TableHead className="bg-secondary/20 text-foreground text-xs font-semibold">
                  Location
                </TableHead>
                <TableHead className="bg-secondary/20 text-foreground text-xs font-semibold text-center">
                  Category
                </TableHead>
                <TableHead className="bg-secondary/20 text-foreground text-xs font-semibold text-center">
                  Wind Speed
                </TableHead>
                <TableHead className="bg-secondary/20 text-foreground text-xs font-semibold text-center">
                  Pressure hPa
                </TableHead>
                <TableHead className="bg-secondary/20 text-foreground text-xs font-semibold text-center">
                  Direction
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trackingPoints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center text-muted-foreground">
                    No tracking data available. Add tracking points or import CSV file.
                  </TableCell>
                </TableRow>
              ) : (
                trackingPoints.map((point, index) => (
                  <TableRow
                    key={point.id}
                    className={`border-secondary/20 hover:bg-secondary/5 ${
                      index % 2 === 1 ? 'bg-primary-light/30' : ''
                    } ${point.current ? 'bg-yellow-50 border-yellow-400 border-2' : ''}`}
                    data-testid={`track-history-row-${index}`}
                  >
                    <TableCell className="text-center font-semibold text-secondary">
                      {point.tc_bulletin_number || index + 1}
                      {point.current && ""}
                    </TableCell>
                    <TableCell className="text-center text-xs">
                      {point.as_of_time || "-"}
                    </TableCell>
                    <TableCell className="text-center text-xs whitespace-nowrap">
                      {point.as_of_date || "-"}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-secondary">
                      {point.typhoon_name || "N/A"}
                    </TableCell>
                    <TableCell className="text-center font-mono text-sm">
                      {point.coordinate_latitude || point.lat}
                    </TableCell>
                    <TableCell className="text-center font-mono text-sm">
                      {point.coordinate_longitude || point.lon}
                    </TableCell>
                    <TableCell className="text-sm max-w-[250px] truncate">
                      {point.typhoon_location || "-"}
                    </TableCell>
                    <TableCell
                      className={`text-center text-xs ${
                        categoryColors[point.typhoon_category || point.category] || 'text-foreground'
                      }`}
                    >
                      {getCategoryDisplay(point.typhoon_category || point.category)}
                    </TableCell>
                    <TableCell className="text-center text-xs">
                      {point.wind_speed || "-"}
                    </TableCell>
                    <TableCell className="text-center text-xs">
                      {point.central_pressure || "-"}
                    </TableCell>
                    <TableCell className="text-center text-xs max-w-[150px] truncate">
                      {point.typhoon_movement || "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
