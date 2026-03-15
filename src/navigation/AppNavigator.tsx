import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OnboardingScreen from "../screens/Onboarding/OnboardingScreen";
import GoalScreen from "../screens/Goals/GoalScreen";
import TaskScreen from "../screens/Task/TaskScreen";
import HistoryScreen from "../screens/History/HistoryScreen";

import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />

        <Stack.Screen name="Goals" component={GoalScreen} />

        <Stack.Screen name="Task" component={TaskScreen} />

        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
