import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const TaskItem = ({ title, time }) => {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.check}>
          <Text style={styles.checkText}>✓</Text>
        </View>
        <Text style={styles.taskText}>{title}</Text>
      </View>

      <Text style={styles.timeText}>{time}</Text>
    </View>
  );
};

const Section = ({ title, children }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
};

const HistoryScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>{'←'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Your Progress</Text>
      </View>

      {/* Today */}
      <Section title="Today">
        <TaskItem title="Built login UI" time="30 min" />
      </Section>

      {/* Yesterday */}
      <Section title="Yesterday">
        <TaskItem title="Read 10 pages React docs" time="15 min" />
      </Section>

      {/* Monday */}
      <Section title="Monday">
        <TaskItem
          title="Practiced 2 coding problems"
          time="1 hr"
        />
      </Section>
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
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    color: '#6E6E73',
    marginBottom: 10,
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
    flexShrink: 1,
  },

  timeText: {
    fontSize: 13,
    color: '#8E8E93',
  },
});