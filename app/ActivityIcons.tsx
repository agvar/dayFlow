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
};

interface ActivityIconsProps {
  onSelectIcon?: (icon: ActivityIconType) => void;
  selectedIconId?: string;
}

export const activityIconsData: ActivityIconType[] = [
  {
    id: 'meditation',
    name: 'Meditation',
    component: <MaterialCommunityIcons name="meditation" size={24} color="green" />,
    color: 'green'
  },
  {
    id: 'call',
    name: 'Call',
    component: <Feather name="phone-call" size={20} color="blue" />,
    color: 'blue'
  },
  {
    id: 'work',
    name: 'Work',
    component: <MaterialIcons name="computer" size={24} color="black" />,
    color: 'black'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    component: <MaterialCommunityIcons name="netflix" size={24} color="red" />,
    color: 'red'
  },
  {
    id: 'reading',
    name: 'Reading',
    component: <FontAwesome5 name="book-reader" size={24} color="orange" />,
    color: 'orange'
  },
  {
    id: 'more',
    name: 'More',
    component: <MaterialIcons name="more-horiz" size={24} color="black" />,
    color: 'black'
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