import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Flower, ArrowRight } from "lucide-react-native";

import ProgressBubble from "../../components/ProgressBubble";
import BackgroundCurves from "../../components/BackgroundCurves";

const OnboardingScreen = () => {

  return (
    <LinearGradient
      colors={["#C7B6F5", "#A88FE8"]}
      style={styles.container}
    >
      <BackgroundCurves />

      {/* Floating Bubbles */}

      <ProgressBubble
        label="45%"
        color="#F5D87A"
        size={80}
        top={120}
        left={140}
      />

      <ProgressBubble
        label="30%"
        color="#F6C6A8"
        size={70}
        top={220}
        left={280}
      />

      <ProgressBubble
        label="15%"
        color="#AEE3D4"
        size={70}
        top={360}
        left={120}
      />

      {/* Flower Icon */}

      <View style={styles.iconContainer}>
        <Flower size={42} color="white" opacity={0.6} />
      </View>

      {/* Text */}

      <View style={styles.bottomContent}>
        <Text style={styles.text}>
          Start your journey{"\n"}with intention.
        </Text>

        <Pressable style={styles.button}>
          <ArrowRight color="white" size={20} />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "flex-end"
  },

  iconContainer: {
    position: "absolute",
    top: 300,
    alignSelf: "center"
  },

  bottomContent: {
    marginBottom: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  text: {
    fontSize: 28,
    color: "white",
    fontWeight: "300",
    lineHeight: 36
  },

  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default OnboardingScreen;