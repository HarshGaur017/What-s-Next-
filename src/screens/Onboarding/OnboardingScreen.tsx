import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Flower, ChevronsRight } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import ProgressBubble from "../../components/ProgressBubble";
import BackgroundCurves from "../../components/BackgroundCurves";
import BottomWavePattern from "../../components/BottomWavePattern";

const OnboardingScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <LinearGradient colors={["#C7B6F5", "#A88FE8"]} style={styles.container}>
      <BackgroundCurves />

      {/* Floating Bubbles */}

      <ProgressBubble
        label="45%"
        color="#F5D87A"
        size={90}
        top={120}
        left={110}
        fontSize={30}
        fontWeight={"600"}
      />

      <ProgressBubble
        label="30%"
        color="#F6C6A8"
        size={85}
        top={220}
        left={300}
        fontSize={24}
        fontWeight={"500"}
      />

      <ProgressBubble
        label="15%"
        color="#AEE3D4"
        size={80}
        top={360}
        left={150}
        fontSize={23}
        fontWeight={"500"}
      />

      {/* Flower Icon */}

      <View style={styles.iconContainer}>
        <Flower size={42} color="white" opacity={0.6} />
      </View>
      <View style={{ top: 140}}>
        <BottomWavePattern />
      </View>
      {/* Text */}

      <View style={styles.bottomContent}>
        <Text style={styles.text}>Start your journey{"\n"}with intention.</Text>

        <Pressable style={styles.button} onPress={()=> navigation.navigate("Goals")}>
          <ChevronsRight color="white" size={35} />
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
    fontSize: 42,
    color: "white",
    fontWeight: "400",
    lineHeight: 40
  },

  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default OnboardingScreen;