import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Loader2, Download, RotateCcw } from "lucide-react";

interface ChromaKeyRemoverProps {
  imageUrl: string;
  onImageProcessed?: (processedImageUrl: string) => void;
}

export default function ChromaKeyRemover({ imageUrl, onImageProcessed }: ChromaKeyRemoverProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tolerance, setTolerance] = useState(30);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const removeBackground = async () => {
    if (!canvasRef.current) return;

    setIsProcessing(true);
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Load the image
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image to canvas
        ctx.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Detect dominant color (usually the background)
        const colorCounts: Record<string, number> = {};
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const key = `${r},${g},${b}`;
          colorCounts[key] = (colorCounts[key] || 0) + 1;
        }

        // Find most common color
        let dominantColor = { r: 0, g: 0, b: 0 };
        let maxCount = 0;
        for (const [key, count] of Object.entries(colorCounts)) {
          if (count > maxCount) {
            maxCount = count;
            const [r, g, b] = key.split(",").map(Number);
            dominantColor = { r, g, b };
          }
        }

        // Remove background by making similar colors transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Calculate color distance
          const distance = Math.sqrt(
            Math.pow(r - dominantColor.r, 2) +
              Math.pow(g - dominantColor.g, 2) +
              Math.pow(b - dominantColor.b, 2)
          );

          // If color is similar to background, make it transparent
          if (distance < tolerance) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
          }
        }

        // Put modified image data back
        ctx.putImageData(imageData, 0, 0);

        // Convert to image URL
        const resultUrl = canvas.toDataURL("image/png");
        setProcessedImage(resultUrl);
        onImageProcessed?.(resultUrl);
      };
      img.src = imageUrl;
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "background-removed.png";
    link.click();
  };

  const resetImage = () => {
    setProcessedImage(null);
    setTolerance(30);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="serif-heading text-lg mb-4">Background Removal Settings</h3>

        <div className="space-y-4">
          <div>
            <Label className="text-foreground font-medium mb-2 block">
              Tolerance Level: {tolerance}
            </Label>
            <p className="text-xs text-muted-foreground mb-3">
              Higher values remove more similar colors. Adjust to fine-tune background removal.
            </p>
            <Slider
              value={[tolerance]}
              onValueChange={(value) => setTolerance(value[0])}
              min={5}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={removeBackground}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Remove Background"
              )}
            </Button>

            {processedImage && (
              <>
                <Button
                  variant="outline"
                  className="border-2 border-border"
                  onClick={downloadImage}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>

                <Button
                  variant="outline"
                  className="border-2 border-border"
                  onClick={resetImage}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Preview */}
      <Card className="p-6">
        <h3 className="serif-heading text-lg mb-4">Preview</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Original */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Original</p>
            <img
              src={imageUrl}
              alt="Original"
              className="w-full h-64 object-cover rounded-lg border border-border"
            />
          </div>

          {/* Processed */}
          {processedImage && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Background Removed</p>
              <div className="w-full h-64 rounded-lg border border-border bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
