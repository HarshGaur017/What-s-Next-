import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { aiService } from '../../services/aiService';
import { storageService } from '../../services/storageService';
import { GeneratedTask } from '../../types/app';

const TIME_OPTIONS = [
  { label: '15 min', value: 15, color: '#EED9A8' },
  { label: '30 min', value: 30, color: '#D6C6EB' },
  { label: '1 hour', value: 60, color: '#C7D9D8' },
  { label: '2 hours', value: 120, color: '#F1CFC6' },
] as const;

type TimeCardProps = {
  label: string;
  color: string;
  isSelected: boolean;
  onPress: () => void;
};

const TimeCard = ({ label, color, isSelected, onPress }: TimeCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.timeCard,
        { backgroundColor: color },
        isSelected ? styles.timeCardSelected : undefined,
      ]}
    >
      <Text style={styles.timeText}>{label}</Text>
    </TouchableOpacity>
  );
};

type TaskScreenProps = NativeStackScreenProps<RootStackParamList, 'Task'>;

const TaskScreen = ({ route }: TaskScreenProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { goalId, goalTitle } = route.params;
  const [selectedDuration, setSelectedDuration] = React.useState<number | null>(null);
  const [generatedTask, setGeneratedTask] = React.useState<GeneratedTask | null>(null);
  const [errorText, setErrorText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [successText, setSuccessText] = React.useState('');
  const [hasCompletedCurrentTask, setHasCompletedCurrentTask] = React.useState(false);

  const handleGenerate = async () => {
    if (!selectedDuration) {
      setErrorText('Choose how much time you have first.');
      return;
    }

    setIsLoading(true);
    setErrorText('');
    setSuccessText('');

    try {
      const taskText = await aiService.generateNextAction(goalTitle, selectedDuration);
      setGeneratedTask({
        text: taskText,
        durationMinutes: selectedDuration,
        goalId,
        goalTitle,
      });
      setHasCompletedCurrentTask(false);
    } catch (error) {
      setGeneratedTask(null);
      setErrorText(
        error instanceof Error ? error.message : 'We could not generate a task right now.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkDone = async () => {
    if (!generatedTask) {
      return;
    }

    setIsSaving(true);
    setSuccessText('');

    try {
      await storageService.addHistoryItem({
        goalId: generatedTask.goalId,
        goalTitle: generatedTask.goalTitle,
        taskText: generatedTask.text,
        durationMinutes: generatedTask.durationMinutes,
      });
      setSuccessText('Saved to your progress history.');
      setHasCompletedCurrentTask(true);
    } catch {
      setErrorText('Could not save this task right now.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backArrow}>{'←'}</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            How much time do{"\n"}you have?
          </Text>
        </View>

        <View style={styles.goalChip}>
          <Text style={styles.goalChipLabel}>Selected Goal</Text>
          <Text style={styles.goalChipValue}>{goalTitle}</Text>
        </View>

        <View style={styles.grid}>
          {TIME_OPTIONS.map((option) => (
            <TimeCard
              key={option.value}
              label={option.label}
              color={option.color}
              isSelected={selectedDuration === option.value}
              onPress={() => {
                setSelectedDuration(option.value);
                setErrorText('');
                setSuccessText('');
                if (generatedTask && generatedTask.durationMinutes !== option.value) {
                  setGeneratedTask(null);
                  setHasCompletedCurrentTask(false);
                }
              }}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleGenerate}
          style={[styles.primaryButton, isLoading ? styles.primaryButtonDisabled : undefined]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {generatedTask ? 'Regenerate Next Action' : 'Generate Next Action'}
            </Text>
          )}
        </TouchableOpacity>

        {errorText ? <Text style={styles.feedbackError}>{errorText}</Text> : null}
        {successText ? <Text style={styles.feedbackSuccess}>{successText}</Text> : null}

        <View style={styles.divider} />

        <View style={styles.actionCard}>
          <Text style={styles.smallText}>Your Next Action</Text>

          {generatedTask ? (
            <>
              <Text style={styles.goalLabel}>{generatedTask.goalTitle}</Text>
              <Text style={styles.bigText}>{generatedTask.text}</Text>
              <Text style={styles.subText}>
                Estimated time: {generatedTask.durationMinutes >= 60
                  ? `${generatedTask.durationMinutes / 60} hour${generatedTask.durationMinutes === 60 ? '' : 's'}`
                  : `${generatedTask.durationMinutes} minutes`}
              </Text>

              <TouchableOpacity
                onPress={handleMarkDone}
                style={[
                  styles.startBtn,
                  isSaving || hasCompletedCurrentTask ? styles.primaryButtonDisabled : undefined,
                ]}
                disabled={isSaving || hasCompletedCurrentTask}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.startText}>
                    {hasCompletedCurrentTask ? 'Saved' : 'Mark Done'}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('History')}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>View History</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.bigText}>Pick a time and let Gemini choose one clear next move.</Text>
              <Text style={styles.subText}>
                You'll get a task that matches your selected goal and available time.
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE9F1',
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  header: {
    marginTop: 10,
    alignItems: 'center',
  },

  backBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backArrow: {
    fontSize: 18,
  },

  goalChip: {
    marginTop: 28,
    backgroundColor: '#F3EFFA',
    borderRadius: 20,
    padding: 18,
  },

  goalChipLabel: {
    fontSize: 13,
    color: '#6E6E73',
    marginBottom: 6,
  },

  goalChipValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1C1C1E',
  },

  grid: {
    marginTop: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  timeCard: {
    width: '48%',
    height: 70,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  timeText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1C1C1E',
  },

  timeCardSelected: {
    borderWidth: 2,
    borderColor: '#6F4CC7',
  },

  primaryButton: {
    marginTop: 10,
    height: 58,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9C7CF4',
  },

  primaryButtonDisabled: {
    opacity: 0.7,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  feedbackError: {
    marginTop: 12,
    color: '#C24040',
    fontSize: 14,
    lineHeight: 20,
  },

  feedbackSuccess: {
    marginTop: 12,
    color: '#2F7E56',
    fontSize: 14,
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: '#D1D1D6',
    marginVertical: 20,
  },

  actionCard: {
    backgroundColor: '#D8C9F0',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    minHeight: 320,
  },

  smallText: {
    fontSize: 14,
    color: '#3A3A3C',
    marginBottom: 10,
  },

  goalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5A4C83',
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  bigText: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1C1C1E',
  },

  subText: {
    fontSize: 16,
    color: '#3A3A3C',
    marginTop: 5,
    marginBottom: 20,
  },

  startBtn: {
    height: 55,
    borderRadius: 30,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9C7CF4',
  },

  startText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  secondaryButton: {
    marginTop: 12,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFFA8',
  },

  secondaryButtonText: {
    color: '#35295C',
    fontSize: 15,
    fontWeight: '600',
  },
});
