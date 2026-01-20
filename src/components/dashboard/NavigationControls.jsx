import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function NavigationControls({ 
  onPrevious, 
  onNext, 
  canGoPrevious = true, 
  canGoNext = true,
  currentPage = 1,
  totalPages = 1
}) {
  return (
    <div className="flex items-center justify-center gap-4 py-4 mt-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground disabled:opacity-50"
        data-testid="previous-page-btn"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span className="font-semibold">&lt;&lt; PREVIOUS</span>
      </Button>
      
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">|</span>
        <span className="text-sm font-semibold text-secondary">
          Page {currentPage} of {totalPages}
        </span>
        <span className="text-muted-foreground">|</span>
      </div>
      
      <Button
        variant="outline"
        onClick={onNext}
        disabled={!canGoNext}
        className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground disabled:opacity-50"
        data-testid="next-page-btn"
      >
        <span className="font-semibold">NEXT &gt;&gt;</span>
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
