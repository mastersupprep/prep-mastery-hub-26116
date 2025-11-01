import { useEffect, useRef, useState } from 'react';

interface DiagramRendererProps {
  diagramData: any[];
  className?: string;
}

export function DiagramRenderer({ diagramData, className = '' }: DiagramRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
//  const [dimensions, setDimensions] = useState({ width: 600, height: 440 });

  useEffect(() => {
    console.log('DiagramRenderer received data:', diagramData);
    console.log('Is array?', Array.isArray(diagramData));
    console.log('Canvas ref exists?', !!canvasRef.current);
    
    if (!canvasRef.current || !diagramData || !Array.isArray(diagramData)) {
      console.log('Early return from DiagramRenderer');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('No canvas context');
      return;
    }

    console.log('Rendering diagram with data:', diagramData);

    // Calculate bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    diagramData.forEach((element: any) => {
      if (!element) return;
      
      const x = element.x || 0;
      const y = element.y || 0;
      const width = element.width || 0;
      const height = element.height || 0;
      
      // For lines, also consider the points
      if (element.type === 'line' && Array.isArray(element.points)) {
        element.points.forEach((point: number[]) => {
          if (Array.isArray(point) && point.length >= 2) {
            minX = Math.min(minX, x + point[0]);
            minY = Math.min(minY, y + point[1]);
            maxX = Math.max(maxX, x + point[0]);
            maxY = Math.max(maxY, y + point[1]);
          }
        });
      } else {
        // For other shapes
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + width);
        maxY = Math.max(maxY, y + height);
      }
    });
    
    // Handle case where no valid coordinates were found
    if (minX === Infinity || maxX === -Infinity) {
      console.error('Could not calculate bounds for diagram');
      return;
    }
    
    console.log('Calculated bounds:', { minX, minY, maxX, maxY });

    const padding = 40;
    const contentWidth = maxX - minX + padding * 2;
    const contentHeight = maxY - minY + padding * 2;
    
    // Set canvas size
    const scale = Math.min(600 / contentWidth, 440 / contentHeight, 1);
    const finalWidth = contentWidth * scale;
    const finalHeight = contentHeight * scale;
    
    // Use device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = finalWidth * dpr;
    canvas.height = finalHeight * dpr;
    canvas.style.width = `${finalWidth}px`;
    canvas.style.height = `${finalHeight}px`;
    
  //  setDimensions({ width: finalWidth, height: finalHeight });

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply transformations
    ctx.save();
    ctx.scale(dpr * scale, dpr * scale);
    ctx.translate(-minX + padding, -minY + padding);

    // Render each element
    diagramData.forEach((element: any) => {
      if (!element || !element.type) {
        console.warn('Skipping invalid element:', element);
        return;
      }

      const x = element.x || 0;
      const y = element.y || 0;
      const width = element.width || 0;
      const height = element.height || 0;

      ctx.strokeStyle = element.strokeColor || '#000000';
      ctx.lineWidth = element.strokeWidth || 2;

      try {
        if (element.type === 'ellipse') {
          const centerX = x + width / 2;
          const centerY = y + height / 2;
          const radiusX = width / 2;
          const radiusY = height / 2;

          ctx.beginPath();
          ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
          
          // Fill if background color is set
          if (element.backgroundColor && element.backgroundColor !== 'transparent') {
            ctx.fillStyle = element.backgroundColor;
            ctx.fill();
          }
          ctx.stroke();
          console.log('Rendered ellipse:', { centerX, centerY, radiusX, radiusY });
        } else if (element.type === 'rectangle') {
          ctx.beginPath();
          ctx.rect(x, y, width, height);
          
          // Fill if background color is set
          if (element.backgroundColor && element.backgroundColor !== 'transparent') {
            ctx.fillStyle = element.backgroundColor;
            ctx.fill();
          }
          ctx.stroke();
          console.log('Rendered rectangle:', { x, y, width, height });
        } else if (element.type === 'line' && Array.isArray(element.points)) {
          ctx.beginPath();
          const firstPoint = element.points[0];
          if (firstPoint && Array.isArray(firstPoint) && firstPoint.length >= 2) {
            ctx.moveTo(x + firstPoint[0], y + firstPoint[1]);
            for (let i = 1; i < element.points.length; i++) {
              const point = element.points[i];
              if (point && Array.isArray(point) && point.length >= 2) {
                ctx.lineTo(x + point[0], y + point[1]);
              }
            }
            ctx.stroke();
            console.log('Rendered line with', element.points.length, 'points');
          }
        } else if (element.type === 'text') {
          ctx.fillStyle = element.strokeColor || '#000000';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = `${element.fontSize || 16}px ${element.fontFamily === 1 ? 'Arial' : 'sans-serif'}`;
          ctx.fillText(element.text || '', x, y);
          console.log('Rendered text:', element.text, 'at', x, y);
        } else {
          console.warn('Unknown element type:', element.type);
        }
      } catch (error) {
        console.error('Error rendering element:', element, error);
      }
    });

    ctx.restore();
    console.log('Diagram rendered successfully');
  }, [diagramData]);

  if (!diagramData || diagramData.length === 0) {
    return null;
  }

  return (
    <div className={`flex justify-center items-center my-4 ${className}`}>
      <div className="bg-white border-2 border-border rounded-lg p-4 shadow-sm">
        <canvas
          ref={canvasRef}
          width={600} // Use the initial size or remove, as it's set in useEffect
          height={440} // Use the initial size or remove, as it's set in useEffect
          className="max-w-full h-auto"
        />
      </div>
    </div>
  );
}
