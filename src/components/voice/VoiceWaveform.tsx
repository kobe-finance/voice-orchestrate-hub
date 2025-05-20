
import React, { useEffect, useRef } from "react";
import { Waveform } from "lucide-react";

interface VoiceWaveformProps {
  voiceId: string;
  isActive: boolean;
}

const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ voiceId, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // Draw waveform animation when active
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Reset animation frame
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (!isActive) {
      // Draw static waveform when not playing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#2563EB'; // Primary blue 
      ctx.lineWidth = 2;
      
      // Draw a static waveform
      const centerY = canvas.height / 2;
      const amplitude = canvas.height / 4;
      
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 2) {
        // Generate a static wave pattern using sine
        const y = centerY + Math.sin(x * 0.05) * amplitude * 0.3;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      return;
    }
    
    // Variables for the animation
    let phase = 0;
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#2563EB'; // Primary blue
      ctx.lineWidth = 2;
      
      const centerY = canvas.height / 2;
      const amplitude = canvas.height / 4;
      
      // Draw animated waveform
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 2) {
        // Generate multiple sine waves with different frequencies and phases
        const y = centerY + 
          Math.sin(x * 0.02 + phase) * amplitude * 0.5 + 
          Math.sin(x * 0.04 + phase * 1.5) * amplitude * 0.3;
          
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Update phase for next frame
      phase += 0.1;
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);
  
  return (
    <div className="w-full h-full relative">
      {!isActive && !canvasRef.current ? (
        <div className="flex items-center justify-center h-full">
          <Waveform className="h-6 w-6 text-muted-foreground" />
        </div>
      ) : (
        <canvas 
          ref={canvasRef} 
          className="w-full h-full" 
        />
      )}
    </div>
  );
};

export default VoiceWaveform;
