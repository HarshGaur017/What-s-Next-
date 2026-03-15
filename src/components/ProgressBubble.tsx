import React from "react";
import { Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming
} from "react-native-reanimated";

const ProgressBubble = ({ label, color, size, top, left }) => {

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
      <Text style={styles.text}>{label}</Text>
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
  text: {
    fontWeight: "600",
    fontSize: 16
  }
});

export default ProgressBubble;