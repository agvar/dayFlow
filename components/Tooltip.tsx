import React, { useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface TooltipProps {
  visible: boolean;
  label: string;
  position?: 'top' | 'bottom';
}

const Tooltip: React.FC<TooltipProps> = ({ visible, label, position = 'top' }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible, fadeAnim]);

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        position === 'top' ? styles.topPosition : styles.bottomPosition,
        { opacity: fadeAnim }
      ]}
    >
      <View style={styles.tooltipContent}>
        <Text style={styles.tooltipText}>{label}</Text>
      </View>
      <View style={[styles.arrow, position === 'top' ? styles.arrowBottom : styles.arrowTop]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    maxWidth: 150,
  },
  topPosition: {
    bottom: '100%',
    marginBottom: 5,
  },
  bottomPosition: {
    top: '100%',
    marginTop: 5,
  },
  tooltipContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 4,
    padding: 8,
  },
  tooltipText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  arrowBottom: {
    bottom: -6,
    borderTopColor: 'rgba(0, 0, 0, 0.8)',
  },
  arrowTop: {
    top: -6,
    borderBottomWidth: 6,
    borderTopWidth: 0,
    borderBottomColor: 'rgba(0, 0, 0, 0.8)',
  },
});

export default Tooltip;