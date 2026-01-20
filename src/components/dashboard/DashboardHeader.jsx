import { Cloud, RefreshCw, Download, Upload, MapPin, List, Menu } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

export function DashboardHeader({ 
  onRefresh, 
  onExportCSV, 
  onImportCSV, 
  onAddPoint, 
  onManagePoints,
  trackingPointsCount = 0 
}) {
  return (
    <header className="dashboard-header py-3 px-2 md:px-2 mb-2">
      {/* Title on Left, Hamburger Menu on Right */}
      <div className="flex items-center justify-between gap-3">
        {/* Title - Left Side */}
        <div className="flex items-center gap-2 md:gap-3">
          <Cloud className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bebas tracking-wider text-primary leading-tight">
            MDRRMO PIO DURAN TYPHOON TRACKING DASHBOARD
          </h1>
        </div>

        {/* Hamburger Menu - Right Side */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-primary-foreground/30 text-primary hover:bg-primary-foreground/10"
              data-testid="hamburger-menu-button"
            >
              <Menu className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-background border-secondary/30"
          >
            <DropdownMenuItem 
              onClick={onRefresh}
              className="cursor-pointer"
              data-testid="refresh-menu-item"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              <span>Refresh</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-secondary/30" />
            
            <DropdownMenuItem 
              onClick={onExportCSV}
              disabled={trackingPointsCount === 0}
              className="cursor-pointer"
              data-testid="export-csv-menu-item"
            >
              <Download className="w-4 h-4 mr-2" />
              <span>Export CSV</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={onImportCSV}
              className="cursor-pointer"
              data-testid="import-csv-menu-item"
            >
              <Upload className="w-4 h-4 mr-2" />
              <span>Import CSV</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-secondary/30" />
            
            <DropdownMenuItem 
              onClick={onAddPoint}
              className="cursor-pointer"
              data-testid="add-point-menu-item"
            >
              <MapPin className="w-4 h-4 mr-2" />
              <span>Add Point</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={onManagePoints}
              className="cursor-pointer"
              data-testid="manage-points-menu-item"
            >
              <List className="w-4 h-4 mr-2" />
              <span>Manage Points</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
