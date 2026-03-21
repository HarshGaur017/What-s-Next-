import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Goal } from "../../types/app";
import { storageService } from "../../services/storageService";

type GoalCardProps = {
  goal: Goal;
  isSelected: boolean;
  onPress: () => void;
  onRemove: () => void;
};

const GoalCard = ({ goal, isSelected, onPress, onRemove }: GoalCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        isSelected ? styles.cardSelected : undefined,
      ]}
    >
      <View style={styles.cardContent}>
        <View style={[styles.selectionDot, isSelected ? styles.selectionDotActive : undefined]} />
        <Text style={styles.cardText}>{goal.title}</Text>
      </View>

      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </Pressable>
  );
};

const AnimatedAvatar = () => {
  const floatY = useSharedValue(0);
  const glowScale = useSharedValue(1);

  React.useEffect(() => {
    floatY.value = withRepeat(
      withSequence(withTiming(-4, { duration: 1800 }), withTiming(0, { duration: 1800 })),
      -1,
      false,
    );

    glowScale.value = withRepeat(
      withSequence(withTiming(1.08, { duration: 1800 }), withTiming(1, { duration: 1800 })),
      -1,
      false,
    );
  }, [floatY, glowScale]);

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: 0.28,
  }));

  return (
    <Animated.View style={[styles.avatarWrap, avatarAnimatedStyle]}>
      <Animated.View style={[styles.avatarGlow, glowAnimatedStyle]} />
      <Image
        source={{ uri: 'https://i.pravatar.cc/120?img=12' }}
        style={styles.avatar}
      />
    </Animated.View>
  );
};

const GoalScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [goalInput, setGoalInput] = React.useState("");
  const [selectedGoalId, setSelectedGoalId] = React.useState<string | null>(null);
  const [screenError, setScreenError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId) ?? null;

  const loadGoals = React.useCallback(async () => {
    setIsLoading(true);
    const storedGoals = await storageService.getGoals();
    setGoals(storedGoals);
    setSelectedGoalId((currentSelectedId) => {
      if (currentSelectedId && storedGoals.some((goal) => goal.id === currentSelectedId)) {
        return currentSelectedId;
      }

      return storedGoals[0]?.id ?? null;
    });
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (isFocused) {
      loadGoals();
    }
  }, [isFocused, loadGoals]);

  const handleAddGoal = async () => {
    setScreenError("");
    setIsSaving(true);

    try {
      const newGoal = await storageService.addGoal(goalInput);
      const nextGoals = await storageService.getGoals();
      setGoals(nextGoals);
      setSelectedGoalId(newGoal.id);
      setGoalInput("");
    } catch (error) {
      setScreenError(error instanceof Error ? error.message : "Could not add goal right now.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveGoal = async (goalId: string) => {
    await storageService.removeGoal(goalId);
    const nextGoals = await storageService.getGoals();
    setGoals(nextGoals);
    setSelectedGoalId((currentSelectedId) =>
      currentSelectedId === goalId ? nextGoals[0]?.id ?? null : currentSelectedId,
    );
  };

  const handleContinue = () => {
    if (!selectedGoal) {
      setScreenError("Select one goal to continue.");
      return;
    }

    navigation.navigate("Task", {
      goalId: selectedGoal.id,
      goalTitle: selectedGoal.title,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AnimatedAvatar />
        <View>
          <Text style={styles.hello}>Choose your focus</Text>
          <Text style={styles.date}>One goal, one next action.</Text>
        </View>
      </View>

      <Text style={styles.title}>
        What do you want{"\n"}to achieve?
      </Text>

      <View style={styles.inputCard}>
        <TextInput
          value={goalInput}
          onChangeText={setGoalInput}
          placeholder="Add a goal like Learn React Native"
          placeholderTextColor="#8E8E93"
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={handleAddGoal}
        />

        <TouchableOpacity
          onPress={handleAddGoal}
          style={[styles.addCard, isSaving ? styles.addCardDisabled : undefined]}
          disabled={isSaving}
        >
          {isSaving ? <ActivityIndicator color="#3A3A3C" /> : <Text style={styles.addText}>+ Add goal</Text>}
        </TouchableOpacity>
      </View>

      {screenError ? <Text style={styles.errorText}>{screenError}</Text> : null}

      <ScrollView
        style={styles.cardsContainer}
        contentContainerStyle={styles.cardsContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#9C7CF4" style={styles.loader} />
        ) : null}

        {!isLoading && goals.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No goals yet</Text>
            <Text style={styles.emptyText}>
              Add your first goal and we'll turn it into one clear next action.
            </Text>
          </View>
        ) : null}

        {!isLoading
          ? goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                isSelected={goal.id === selectedGoalId}
                onPress={() => {
                  setSelectedGoalId(goal.id);
                  setScreenError("");
                }}
                onRemove={() => handleRemoveGoal(goal.id)}
              />
            ))
          : null}
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, !selectedGoal ? styles.buttonDisabled : undefined]}
        onPress={handleContinue}
        disabled={!selectedGoal}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default GoalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE9F1',
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  avatarWrap: {
    width: 45,
    height: 45,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarGlow: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#CDBAF8',
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#F5F2FA',
  },

  hello: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },

  date: {
    fontSize: 13,
    color: '#8E8E93',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 25,
    color: '#1C1C1E',
  },

  cardsContainer: {
    marginTop: 16,
    flex: 1,
  },

  cardsContent: {
    paddingBottom: 24,
  },

  inputCard: {
    marginTop: 24,
    backgroundColor: '#F5F2FA',
    borderRadius: 22,
    padding: 16,
  },

  input: {
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 48,
    marginBottom: 12,
  },

  card: {
    minHeight: 74,
    borderRadius: 18,
    marginBottom: 15,
    paddingHorizontal: 18,
    paddingVertical: 16,
    justifyContent: 'space-between',
    backgroundColor: '#F1F1F5',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  cardSelected: {
    backgroundColor: '#DCCCF7',
    borderWidth: 1,
    borderColor: '#9C7CF4',
  },

  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },

  selectionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#B0B0B8',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },

  selectionDotActive: {
    backgroundColor: '#9C7CF4',
    borderColor: '#9C7CF4',
  },

  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    flexShrink: 1,
  },

  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFFB3',
  },

  addCard: {
    height: 55,
    borderRadius: 18,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addCardDisabled: {
    opacity: 0.7,
  },

  addText: {
    fontSize: 15,
    color: '#3A3A3C',
    fontWeight: '500',
  },

  removeButtonText: {
    fontSize: 13,
    color: '#5A4C83',
    fontWeight: '600',
  },

  emptyCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 24,
    padding: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6E6E73',
  },

  errorText: {
    color: '#C24040',
    marginTop: 12,
    fontSize: 14,
  },

  loader: {
    marginTop: 24,
  },

  button: {
    marginTop: 12,
    marginBottom: 20,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#9C7CF4',
  },

  buttonDisabled: {
    opacity: 0.45,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
