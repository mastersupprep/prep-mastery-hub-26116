import { LaTeXRenderer } from "./LaTeXRenderer";
import { DiagramRenderer } from "./DiagramRenderer";

interface UnifiedContentRendererProps {
  content: string;
  className?: string;
}

export function UnifiedContentRenderer({ content, className = "" }: UnifiedContentRendererProps) {
  if (!content) return null;

  // Parse content to extract inline diagrams and text
  const parseContent = (text: string) => {
    const parts: Array<{ type: 'text' | 'diagram'; content: any }> = [];
    let currentIndex = 0;
    
    // Regex to match JSON arrays (both single and nested arrays for options)
    // Matches: [{...}] or [[{...}], [{...}]]
    const diagramPattern = /(\[\s*\{[\s\S]*?\}\s*\]|\[\s*\[\s*\{[\s\S]*?\}\s*\](?:\s*,\s*\[\s*\{[\s\S]*?\}\s*\])*\s*\])/g;
    
    let match;
    while ((match = diagramPattern.exec(text)) !== null) {
      // Add text before the diagram
      if (match.index > currentIndex) {
        const textContent = text.substring(currentIndex, match.index).trim();
        if (textContent) {
          parts.push({ type: 'text', content: textContent });
        }
      }
      
      // Try to parse the JSON array
      try {
        const jsonStr = match[1];
        const diagramData = JSON.parse(jsonStr);
        
        // Validate it's an array and has diagram-like structure
        if (Array.isArray(diagramData) && diagramData.length > 0) {
          // Check if it's a valid Excalidraw structure
          const isValidDiagram = (data: any) => {
            if (!Array.isArray(data)) return false;
            if (data.length === 0) return false;
            // Check if first element has typical Excalidraw properties
            const firstItem = Array.isArray(data[0]) ? data[0][0] : data[0];
            return firstItem && typeof firstItem === 'object' && 
                   ('type' in firstItem || 'x' in firstItem || 'y' in firstItem);
          };
          
          if (isValidDiagram(diagramData)) {
            parts.push({ type: 'diagram', content: diagramData });
          } else {
            // Not a valid diagram, treat as text
            parts.push({ type: 'text', content: jsonStr });
          }
        } else {
          // Not a valid array, treat as text
          parts.push({ type: 'text', content: jsonStr });
        }
      } catch (error) {
        // JSON parsing failed, treat as text
        parts.push({ type: 'text', content: match[1] });
      }
      
      currentIndex = match.index + match[1].length;
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
      const textContent = text.substring(currentIndex).trim();
      if (textContent) {
        parts.push({ type: 'text', content: textContent });
      }
    }
    
    // If no diagrams were found, return the original text as a single part
    if (parts.length === 0) {
      parts.push({ type: 'text', content: text });
    }
    
    return parts;
  };

  const parts = parseContent(content);

  return (
    <div className={className}>
      {parts.map((part, index) => {
        if (part.type === 'diagram') {
          // Handle nested arrays (options diagrams) vs single arrays
          if (Array.isArray(part.content[0]) && Array.isArray(part.content[0][0])) {
            // Nested array structure for multiple diagrams (options)
            return (
              <div key={index} className="space-y-2 my-4">
                {part.content.map((diagram: any, diagIndex: number) => (
                  <DiagramRenderer 
                    key={diagIndex}
                    diagramData={diagram} 
                    className="my-2"
                  />
                ))}
              </div>
            );
          } else {
            // Single diagram
            return (
              <DiagramRenderer 
                key={index}
                diagramData={part.content} 
                className="my-4"
              />
            );
          }
        } else {
          // Text content with LaTeX rendering
          return (
            <LaTeXRenderer 
              key={index}
              content={part.content} 
              className="my-2"
            />
          );
        }
      })}
    </div>
  );
}
