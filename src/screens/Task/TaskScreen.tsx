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
import { useNavigation } from '@react-navigation/native';

const TimeCard = ({ label, color }) => {
  return (
    <TouchableOpacity style={[styles.timeCard, { backgroundColor: color }]}>
      <Text style={styles.timeText}>{label}</Text>
    </TouchableOpacity>
  );
};

const TaskScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>{'←'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          How much time do{"\n"}you have?
        </Text>
      </View>

      {/* Time Options */}
      <View style={styles.grid}>
        <TimeCard label="15 min" color="#EED9A8" />
        <TimeCard label="30 min" color="#D6C6EB" />
        <TimeCard label="1 hour" color="#C7D9D8" />
        <TimeCard label="2 hours" color="#F1CFC6" />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Action Card */}
      <View style={styles.actionCard}>
        <Text style={styles.smallText}>Your Next Action</Text>

        <Text style={styles.bigText}>
          Build a reusable{"\n"}Button component
        </Text>

        <Text style={styles.subText}>in React Native</Text>

        <TouchableOpacity onPress={() => navigation.navigate('History')} style={styles.startBtn}>
          <Text style={styles.startText}>Start Task</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE9F1',
    paddingHorizontal: 20,
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
  },

  smallText: {
    fontSize: 14,
    color: '#3A3A3C',
    marginBottom: 10,
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
});