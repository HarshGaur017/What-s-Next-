import React from "react";
import Svg, { Path } from "react-native-svg";

const BackgroundCurves = () => {
  return (
    <Svg
      height="600"
      width="100%"
      style={{ position: "absolute", top: 0 }}
    >
      <Path
        d="M20 200 C 120 100, 200 300, 350 200"
        stroke="white"
        strokeWidth="1"
        fill="none"
        opacity="0.2"
      />

      <Path
        d="M50 300 C 150 200, 250 400, 380 280"
        stroke="white"
        strokeWidth="1"
        fill="none"
        opacity="0.2"
      />

      <Path
        d="M0 400 C 150 300, 250 500, 400 350"
        stroke="white"
        strokeWidth="1"
        fill="none"
        opacity="0.2"
      />
    </Svg>
  );
}

export default BackgroundCurves;