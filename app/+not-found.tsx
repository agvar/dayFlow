import { Link, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops! This screen doesn't exist" }} />
      <View style={styles.container}>
        <Link href="/(tabs)">
          <View style={styles.link}>
            <Text style={styles.linkText}>Go to home screen!</Text>
          </View>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#6200ee',
  },
  linkText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  }
});
