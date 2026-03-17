import React from "react";
import Svg, { Ellipse } from "react-native-svg";

const BackgroundCurves = () => {
  return (
    <Svg
      height="100%"
      width="100%"
      style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }}
    >
      {/* Top Left Sweeping Curve */}
      <Ellipse
        cx="80"
        cy="220"
        rx="180"
        ry="280"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        fill="none"
        opacity="0.25"
        transform="rotate(-15, 80, 220)"
      />

      {/* Middle Right Sweeping Curve */}
      <Ellipse
        cx="320"
        cy="300"
        rx="160"
        ry="240"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        fill="none"
        opacity="0.25"
        transform="rotate(25, 320, 300)"
      />

      {/* Bottom Sweeping Curve */}
      <Ellipse
        cx="160"
        cy="520"
        rx="240"
        ry="200"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        fill="none"
        opacity="0.25"
        transform="rotate(-10, -160, 520)"
      />
    </Svg>
  );
};

export default BackgroundCurves;