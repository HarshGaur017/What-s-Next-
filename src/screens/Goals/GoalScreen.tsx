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

const GoalCard = ({ title, color }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Task")} style={[styles.card, { backgroundColor: color }]}>
      <Text style={styles.cardText}>{title}</Text>
      <Text style={styles.arrow}>{'›'}</Text>
    </TouchableOpacity>
  );
};

const GoalScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.hello}>Hello, Alex</Text>
          <Text style={styles.date}>24 June</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>
        What do you want{"\n"}to achieve?
      </Text>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        <GoalCard title="Learn React Native" color="#F1F1F5" />
        <GoalCard title="Fitness" color="#CFE3E3" />
        <GoalCard title="Reading" color="#F2D1C9" />

        <TouchableOpacity style={styles.addCard}>
          <Text style={styles.addText}>+ Add new goal</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Button */}
      <TouchableOpacity style={styles.button}>
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

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#D1D1D6',
    marginRight: 10,
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
    marginTop: 25,
  },

  card: {
    height: 65,
    borderRadius: 18,
    marginBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },

  arrow: {
    fontSize: 22,
    color: '#8E8E93',
  },

  addCard: {
    height: 55,
    borderRadius: 18,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addText: {
    fontSize: 15,
    color: '#3A3A3C',
  },

  button: {
    marginTop: 'auto',
    marginBottom: 20,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',

    // gradient-like fallback (solid purple)
    backgroundColor: '#9C7CF4',
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});