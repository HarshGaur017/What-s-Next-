import React from "react";
import { Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming
} from "react-native-reanimated";
import type { TextStyle } from "react-native";

type ProgressBubbleProps = {
  label: string;
  color: string;
  size: number;
  top: number;
  left: number;
  fontWeight?: TextStyle["fontWeight"];
  fontSize?: number;
};

const ProgressBubble: React.FC<ProgressBubbleProps> = ({ label, color, size, top, left, fontWeight, fontSize }) => {

  const float = useSharedValue(0);

  React.useEffect(() => {
    float.value = withRepeat(
      withTiming(-10, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value }]
  }));

  return (
    <Animated.View
      style={[
        styles.bubble,
        { backgroundColor: color, width: size, height: size, top, left },
        animatedStyle
      ]}
    >
      <Text style={[{ fontWeight, fontSize }]}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: "absolute",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center"
  },
});

export default ProgressBubble;