import { Entypo, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';

import React from 'react';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#8b9bb7',
      tabBarInactiveTintColor: '#CCD6E0',
      tabBarStyle: {
        backgroundColor: '#02060A',
        borderColor: '#02060A'
      },
      tabBarHideOnKeyboard: true,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color }) => <Foundation name="home" size={20} color={color} />
        }}
      />
        <Tabs.Screen
          name='play'
          options={{
            title: 'Play',
            headerShown: false,
            tabBarIcon: ({color}) => <MaterialCommunityIcons name="gamepad-round" size={20} color={color} />
          }}
        />
      <Tabs.Screen
        name="instructions"
        options={{
          title: 'instructions',
          headerShown: false,
          tabBarIcon: ({ color }) => <Entypo name="help-with-circle" size={20} color={color} />
        }}
      />
    </Tabs>
  );
}
