import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { storageService } from '../../services/storageService';
import { TaskHistoryItem } from '../../types/app';

type TaskItemProps = {
  item: TaskHistoryItem;
};

type HistorySection = {
  title: string;
  data: TaskHistoryItem[];
};

const formatDuration = (minutes: number) => {
  if (minutes >= 60) {
    return `${minutes / 60} hr`;
  }

  return `${minutes} min`;
};

const getSectionTitle = (isoDate: string) => {
  const targetDate = new Date(isoDate);
  const today = new Date();

  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const targetStart = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
  ).getTime();

  const diffDays = Math.round((todayStart - targetStart) / 86400000);

  if (diffDays === 0) {
    return 'Today';
  }

  if (diffDays === 1) {
    return 'Yesterday';
  }

  return targetDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: targetDate.getFullYear() === today.getFullYear() ? undefined : 'numeric',
  });
};

const buildSections = (items: TaskHistoryItem[]) => {
  const grouped = items.reduce<Record<string, TaskHistoryItem[]>>((acc, item) => {
    const key = getSectionTitle(item.completedAt);
    acc[key] = [...(acc[key] ?? []), item];
    return acc;
  }, {});

  return Object.entries(grouped).map(([title, data]) => ({
    title,
    data,
  }));
};

const TaskItem = ({ item }: TaskItemProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.check}>
          <Text style={styles.checkText}>✓</Text>
        </View>
        <View style={styles.taskMeta}>
          <Text style={styles.taskText}>{item.taskText}</Text>
          <Text style={styles.goalText}>{item.goalTitle}</Text>
        </View>
      </View>

      <Text style={styles.timeText}>{formatDuration(item.durationMinutes)}</Text>
    </View>
  );
};

const HistoryScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [sections, setSections] = React.useState<HistorySection[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setIsLoading(true);
      const historyItems = await storageService.getHistory();
      setSections(buildSections(historyItems));
      setIsLoading(false);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>{'←'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Your Progress</Text>
      </View>

      {isLoading ? <Text style={styles.statusText}>Loading your completed tasks...</Text> : null}

      {!isLoading && sections.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nothing completed yet</Text>
          <Text style={styles.emptyText}>
            Finish one generated action and it will show up here with your progress history.
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Goals')} style={styles.emptyButton}>
            <Text style={styles.emptyButtonText}>Generate Your First Task</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {!isLoading && sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderSectionHeader={({ section }) => (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
          )}
          renderItem={({ item }) => <TaskItem item={item} />}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE9F1',
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 20,
  },

  backBtn: {
    position: 'absolute',
    left: 0,
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

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },

  section: {
    marginTop: 12,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 16,
    color: '#6E6E73',
  },

  card: {
    backgroundColor: '#F2F2F7',
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  taskMeta: {
    flex: 1,
  },

  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#8FD3C1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  checkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  taskText: {
    fontSize: 15,
    color: '#1C1C1E',
    lineHeight: 20,
  },

  goalText: {
    marginTop: 4,
    fontSize: 13,
    color: '#6E6E73',
  },

  timeText: {
    fontSize: 13,
    color: '#8E8E93',
    marginLeft: 12,
  },

  listContent: {
    paddingBottom: 24,
  },

  statusText: {
    marginTop: 24,
    fontSize: 15,
    color: '#6E6E73',
  },

  emptyCard: {
    marginTop: 28,
    backgroundColor: '#F2F2F7',
    borderRadius: 24,
    padding: 22,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6E6E73',
  },

  emptyButton: {
    marginTop: 18,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9C7CF4',
  },

  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
