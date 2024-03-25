import * as Application from 'expo-application';

import { ActivityIndicator, PaperProvider } from 'react-native-paper';
import { Text, ToastAndroid, View } from 'react-native';
import { useEffect, useState } from 'react';

import { AxiosError } from 'axios';
import Play from '@/play';
import Started from '@/play/Started';
import Wrapper from '@/components/Wrapper';
import { allGradesEmpty } from '@/utils/lib';
import instance from '@/utils/db';
import { socket } from '@/context/SocketContext';
import useApp from '@/context/AppContext';
import useAuth from '@/context/AuthContext';
import { useHeaderHeight } from '@react-navigation/elements';

const userId = Application.androidId;

export default function play() {
	const { state, updateCurrentGamePlaying, updateLastGameResult } = useApp();
	const { setIsLoggedIn } = useAuth();
	const [isLoading, setIsLoading] = useState(true);

	const headerHeight = useHeaderHeight();

	useEffect(() => {
		(async () => {
			try {
				const response = await instance.get(`/users/${userId}`);
				const data = response.data;

				if (response.status === 200) {
					const game = data.gamePlaying;
					const result = data.lastGameResult;

					result && !allGradesEmpty(result) && updateLastGameResult(result);
					game &&
						updateCurrentGamePlaying({
							started: game.started,
							rules: game.rules,
							name: game.name,
							admin: game.admin,
							expires: game.expires,
							players: game.players,
							code: game.code,
							id: game._id,
						});
					game && socket.emit('rejoinGame', game.code);
				} else {
					updateCurrentGamePlaying(null);
					updateLastGameResult(null);
				}
			} catch (error) {
				const axiosError = error as AxiosError;
				if (axiosError.response?.status === 404) {
					const response = await instance.post('/users', { uid: userId });

					if (response.status === 200) {
						setIsLoggedIn(true);
					}
				} else {
					ToastAndroid.show('Something went wrong!!', ToastAndroid.BOTTOM);
				}
			} finally {
				setIsLoading(false);
			}
		})();
	}, []);

	if (isLoading) {
		return (
			<Wrapper>
				<ActivityIndicator size='large' color='#ffff' className='flex-1' />
			</Wrapper>
		);
	}

	return (
		<Wrapper>
			<View
				className='flex-1 items-center'
				style={{ marginTop: headerHeight - 60 }}>
				<Text>Start Playing Pyramid Game</Text>
				{!state.isPlaying && <Play />}
				{state.isPlaying && <Started />}
			</View>
		</Wrapper>
	);
}
