import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
// import { Dimensions } from 'react-native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeWindStyleSheet } from 'nativewind';
import { Stack } from 'expo-router/stack';

NativeWindStyleSheet.setOutput({
	default: 'native',
});

// const windowWidth = Dimensions.get('window').width;
export default function Layout() {
	return (
		<AuthProvider>
			<AppProvider>
				<Stack>
					<Stack.Screen
						name='(tabs)'
						redirect={false}
						options={{
							headerBackVisible: false,
							headerShown: false,
						}}
					/>
				</Stack>
			</AppProvider>
		</AuthProvider>
	);
}

{
	/* <View
	className='flex-col justify-center items-center bg-darkest -z-50'
	style={{ width: windowWidth }}>
	<View className='flex-col items-center justify-center'>
		<View className='flex-row items-center'>
			<MaterialCommunityIcons name='pyramid' size={16} color='#CCD6E0' />
			<Text className='tracking-[23] text-lightest'>PYRAMIDGAME</Text>
			<MaterialCommunityIcons name='pyramid' size={16} color='#CCD6E0' />
		</View>
	</View>
	<View className='h-1 bg-brand w-full mt-2' />
</View>; */
}
