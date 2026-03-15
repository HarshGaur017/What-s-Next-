import Svg, { Path } from "react-native-svg";

const BottomWavePattern = () => (
  <Svg
    height="120"
    width="100%"
    style={{ position: "absolute", bottom: 120 }}
  >
    <Path
      d="M0 60 Q 50 30 100 60 T 200 60 T 300 60 T 400 60"
      stroke="white"
      strokeWidth="2"
      fill="none"
      opacity="0.3"
    />
  </Svg>
);

export default BottomWavePattern;  