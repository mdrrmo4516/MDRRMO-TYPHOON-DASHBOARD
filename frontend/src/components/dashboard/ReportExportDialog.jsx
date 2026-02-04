import React, { useRef, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Printer, Download, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import PrintableReport from "./PrintableReport";
import html2canvas from "html2canvas";

export function ReportExportDialog({ 
  open, 
  onOpenChange, 
  typhoonData, 
  trackingPoints, 
  typhoonName,
  typhoonColor 
}) {
  const reportRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Handle Print Report
  const handlePrint = useCallback(async () => {
    setIsPrinting(true);
    
    try {
      // Wait for map tiles to load
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Please allow pop-ups to print the report");
        return;
      }
      
      // Get the report HTML
      const reportHtml = reportRef.current?.innerHTML;
      
      // Write the print document
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Tropical Cyclone Bulletin - ${typhoonName || 'Report'}</title>
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              background: white;
              color: black;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .printable-report {
              width: 100%;
              max-width: 1200px;
              margin: 0 auto;
              padding: 20px;
            }
            .flex {
              display: flex;
            }
            .items-center {
              align-items: center;
            }
            .justify-between {
              justify-content: space-between;
            }
            .gap-1 {
              gap: 4px;
            }
            .flex-shrink-0 {
              flex-shrink: 0;
            }
            .flex-grow {
              flex-grow: 1;
            }
            .text-center {
              text-align: center;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 6px 4px;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .leaflet-container {
                background: white !important;
              }
            }
          </style>
        </head>
        <body>
          ${reportHtml}
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          // Don't close the window - let user close it after printing
        }, 500);
      };
      
      toast.success("Print dialog opened");
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Failed to print report");
    } finally {
      setIsPrinting(false);
    }
  }, [typhoonName]);

  // Handle Export to JPEG
  const handleExportJPEG = useCallback(async () => {
    if (!reportRef.current) {
      toast.error("Report not ready for export");
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Wait for map tiles to fully load
      toast.info("Preparing report for export...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Capture the report as canvas
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          // Ensure images are loaded in cloned document
          const images = clonedDoc.getElementsByTagName('img');
          return Promise.all(
            Array.from(images).map(img => {
              if (img.complete) return Promise.resolve();
              return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
              });
            })
          );
        }
      });
      
      // Convert canvas to JPEG blob
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error("Failed to create image");
          return;
        }
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Tropical_Cyclone_Bulletin_${typhoonName || 'Report'}_${Date.now()}.jpeg`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Cleanup
        URL.revokeObjectURL(url);
        
        toast.success("Report exported as JPEG successfully!");
      }, 'image/jpeg', 0.95);
      
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export report as JPEG");
    } finally {
      setIsExporting(false);
    }
  }, [typhoonName]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[1300px] max-h-[95vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Tropical Cyclone Bulletin Report
          </DialogTitle>
          <DialogDescription>
            Preview, print, or export the bulletin report as an image
          </DialogDescription>
        </DialogHeader>
        
        {/* Action Buttons */}
        <div className="flex gap-3 mb-4">
          <Button
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex items-center gap-2"
            variant="outline"
          >
            {isPrinting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Printer className="w-4 h-4" />
            )}
            Print Report
          </Button>
          
          <Button
            onClick={handleExportJPEG}
            disabled={isExporting}
            className="flex items-center gap-2 bg-secondary hover:bg-secondary/90"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export as JPEG
          </Button>
        </div>
        
        {/* Report Preview */}
        <div 
          className="border rounded-lg overflow-auto bg-gray-100 p-4"
          style={{ maxHeight: '70vh' }}
        >
          <div className="bg-white shadow-lg mx-auto" style={{ width: 'fit-content' }}>
            <PrintableReport
              ref={reportRef}
              typhoonData={typhoonData}
              trackingPoints={trackingPoints}
              typhoonName={typhoonName}
              typhoonColor={typhoonColor}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
