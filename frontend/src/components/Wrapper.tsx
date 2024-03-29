import { ActivityIndicator, PaperProvider } from 'react-native-paper';
import { Poppins_400Regular, useFonts } from '@expo-google-fonts/poppins';
import { ReactNode, useEffect } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { socket } from '@/context/SocketContext';
import useApp from '@/context/AppContext';

const Wrapper = ({ children }: { children: ReactNode }) => {
	const [fontsLoaded] = useFonts({ Poppins_400Regular });

	const { state } = useApp();
	useEffect(() => {
		if (!socket.connected) {
			socket.connect();
		}

		socket.on('connect', () => {
			const code = state.currentGamePlaying?.code;

			code && socket.emit('rejoinGame', code);
		});
	}, []);

	if (!fontsLoaded) {
		return (
			<View className='flex-1 flex items-center justify-center'>
				<ActivityIndicator size='large' color='#ffff' className='flex-1' />
			</View>
		);
	}

	return (
		<PaperProvider>
			<SafeAreaView className='flex-1 bg-darkest'>{children}</SafeAreaView>
		</PaperProvider>
	);
};

export default Wrapper;
