import { Entypo, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';

import { AuthProvider } from '@/context/AuthContext';
import React from 'react';
import { Tabs } from 'expo-router';

export default function TabLayout() {
	return (
		<AuthProvider>
			<Tabs
				initialRouteName='index'
				backBehavior='history'
				screenOptions={{
					tabBarActiveTintColor: '#8b9bb7',
					tabBarInactiveTintColor: '#CCD6E0',
					tabBarStyle: {
						backgroundColor: '#02060A',
						borderColor: '#02060A',
					},
					tabBarHideOnKeyboard: true,
					headerShown: false,
				}}>
				<Tabs.Screen
					name='index'
					options={{
						title: 'Home',
						tabBarIcon: ({ color }) => (
							<Foundation name='home' size={20} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name='play'
					options={{
						title: 'Play',
						tabBarIcon: ({ color }) => (
							<MaterialCommunityIcons
								name='gamepad-round'
								size={20}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name='instructions'
					options={{
						title: 'instructions',
						tabBarIcon: ({ color }) => (
							<Entypo name='help-with-circle' size={20} color={color} />
						),
					}}
				/>
			</Tabs>
		</AuthProvider>
	);
}
