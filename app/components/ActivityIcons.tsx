import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type ActivityIconType = {
  id: string;
  name: string;
  component: React.ReactNode;
  color: string;
  category : string;
};

interface ActivityIconsProps {
  onSelectIcon?: (icon: ActivityIconType) => void;
  selectedIconId?: string;
}

export const activityIconsData: ActivityIconType[] = [
  {
    id: 'meditation',
    name: 'Meditation',
    component: <MaterialCommunityIcons name="meditation" size={24} color="#4CAF50" />,
    color: '#4CAF50',
    category: 'Health'
  },
  {
    id: 'call',
    name: 'Call',
    component: <Feather name="phone-call" size={20} color="#2196F3" />,
    color: '#2196F3',
    category: 'Communication'
  },
  {
    id: 'work',
    name: 'Work',
    component: <MaterialIcons name="computer" size={24} color="#212121" />,
    color: '#212121',
    category: 'Work'
  },
  {
    id: 'Screen Time',
    name: 'Screen Time',
    component: <MaterialCommunityIcons name="netflix" size={24} color="#F44336" />,
    color: '#F44336',
    category: 'Entertainment'
  },
  {
    id: 'reading',
    name: 'Reading',
    component: <FontAwesome5 name="book-reader" size={24} color="#FF9800" />,
    color: '#FF9800',
    category: 'Education'
  },

];

const ActivityIcons: React.FC<ActivityIconsProps> = ({ onSelectIcon, selectedIconId }) => {
  return (
    <View style={styles.activityTypeIcons}>
      {activityIconsData.map((icon) => (
        <TouchableOpacity 
          key={icon.id}
          style={[styles.iconContainer, selectedIconId === icon.id && styles.selectedIcon]}
          onPress={() => onSelectIcon && onSelectIcon(icon)}
        >
          {icon.component}
          {selectedIconId === icon.id && (
            <Text style={styles.iconLabel}>{icon.name}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  activityTypeIcons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  iconContainer: { alignItems: 'center', padding: 8 },
  selectedIcon: { backgroundColor: '#F0F0F0', borderRadius: 8 },
  iconLabel: { fontSize: 10, marginTop: 4, textAlign: 'center' }
});

export default ActivityIcons;