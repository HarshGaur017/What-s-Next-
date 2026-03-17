import React from "react";
import Svg, { Line, Defs, LinearGradient, Stop } from "react-native-svg";

const BottomWavePattern = () => {
  // Approximate heights to mimic the bell-curve audio wave in your design
  const waveHeights = [
    6, 8, 12, 16, 22, 30, 40, 50, 65, 85, 
    110, 130, 145, 150, 145, 130, 110, 85, 65, 50, 
    40, 30, 22, 16, 12, 8, 6
  ];

  return (
    <Svg
      height="160"
      width="100%"
      style={{ position: "absolute", bottom: 200, zIndex: 1 }}
    >
      <Defs>
        {/* This creates the smooth fade-out effect at the bottom of the bars */}
        <LinearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <Stop offset="90%" stopColor="#FFFFFF" stopOpacity="0.0" />
        </LinearGradient>
      </Defs>

      {waveHeights.map((height, index) => {
        // Distribute bars evenly across the full width so the wave connects to both screen edges
        const xPosition = `${(index / (waveHeights.length - 1)) * 100}%`;

        return (
          <Line
            key={index}
            x1={xPosition}
            y1={160 - height} // Top of the bar
            x2={xPosition}
            y2={160}          // Bottom baseline
            stroke="url(#barGradient)"
            strokeWidth="2.5"
            strokeLinecap="round" // Gives the bars those soft, rounded tops
          />
        );
      })}
    </Svg>
  );
};

export default BottomWavePattern;