import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Plus, Eye, EyeOff, Trash2, Cloud } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";

export function TyphoonSelector({
  typhoons,
  selectedTyphoonId,
  onSelectTyphoon,
  onCreateTyphoon,
  onDeleteTyphoon,
  onToggleVisibility,
}) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTyphoonName, setNewTyphoonName] = useState("");

  const handleCreate = () => {
    if (!newTyphoonName.trim()) {
      toast.error("Please enter a typhoon name");
      return;
    }
    
    onCreateTyphoon(newTyphoonName.trim());
    setNewTyphoonName("");
    setIsCreateDialogOpen(false);
  };

  const handleDelete = (e, typhoonId) => {
    e.stopPropagation();
    
    const typhoon = typhoons.find(t => t.id === typhoonId);
    if (!typhoon) return;
    
    if (window.confirm(`Are you sure you want to delete typhoon "${typhoon.name}"? This will remove all ${typhoon.trackingPoints.length} tracking points.`)) {
      onDeleteTyphoon(typhoonId);
    }
  };

  const handleToggleVisibility = (e, typhoonId) => {
    e.stopPropagation();
    onToggleVisibility(typhoonId);
  };

  const totalActiveTyphoons = typhoons.filter(t => t.isActive).length;

  return (
    <Card className="bg-card border-secondary/30">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-secondary" />
            <h3 className="text-sm font-semibold text-secondary">Active Typhoons</h3>
            <Badge variant="outline" className="border-secondary text-secondary text-xs">
              {totalActiveTyphoons} of {typhoons.length}
            </Badge>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-secondary text-secondary hover:bg-secondary/10"
              >
                <Plus className="w-3 h-3 mr-1" />
                New Typhoon
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Typhoon</DialogTitle>
                <DialogDescription>
                  Add a new typhoon to track. You can add tracking points after creation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="typhoon-name">Typhoon Name</Label>
                  <Input
                    id="typhoon-name"
                    placeholder="e.g., Yolanda, Haiyan"
                    value={newTyphoonName}
                    onChange={(e) => setNewTyphoonName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCreate();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Typhoon Tabs */}
        <div className="flex flex-wrap gap-2">
          {/* All Typhoons Tab */}
          <button
            onClick={() => onSelectTyphoon('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-2 ${
              selectedTyphoonId === 'all'
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All Typhoons
            <Badge variant="secondary" className="text-[10px] h-4 px-1">
              {typhoons.reduce((sum, t) => sum + t.trackingPoints.length, 0)}
            </Badge>
          </button>

          {/* Individual Typhoon Tabs */}
          {typhoons.map((typhoon) => (
            <div
              key={typhoon.id}
              className={`relative group flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                selectedTyphoonId === typhoon.id
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              } ${!typhoon.isActive ? 'opacity-50' : ''}`}
              onClick={() => onSelectTyphoon(typhoon.id)}
              style={{
                borderLeft: `4px solid ${typhoon.color.primary}`,
              }}
            >
              {/* Color indicator */}
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: typhoon.color.primary }}
              />
              
              <span className="max-w-[120px] truncate">{typhoon.name}</span>
              
              <Badge variant="secondary" className="text-[10px] h-4 px-1">
                {typhoon.trackingPoints.length}
              </Badge>

              {/* Action Buttons */}
              <div className="flex items-center gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleToggleVisibility(e, typhoon.id)}
                  className="p-0.5 hover:bg-background/20 rounded"
                  title={typhoon.isActive ? "Hide from map" : "Show on map"}
                >
                  {typhoon.isActive ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <EyeOff className="w-3 h-3" />
                  )}
                </button>
                <button
                  onClick={(e) => handleDelete(e, typhoon.id)}
                  className="p-0.5 hover:bg-destructive/20 rounded text-destructive"
                  title="Delete typhoon"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {typhoons.length === 0 && (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <Cloud className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>No typhoons yet. Create one to start tracking!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
