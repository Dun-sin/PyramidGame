import * as Application from 'expo-application';

import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, ToastAndroid } from 'react-native';

import { ActivityIndicator } from 'react-native-paper';
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

export default function PlayScreen() {
	const { state, updateCurrentGamePlaying, updateLastGameResult } = useApp();
	const { setIsLoggedIn } = useAuth();
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const headerHeight = useHeaderHeight();

	const onRefresh = React.useCallback(() => {
		setIsRefreshing(true);
		fetchData().then(() => setIsRefreshing(false));
	}, []);

	const fetchData = async () => {
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
				} else {
					console.log(response);
				}
			} else {
				ToastAndroid.show('Something went wrong!!', ToastAndroid.BOTTOM);
				console.log(error);
			}
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
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
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
				}>
				{!state.isPlaying && <Play />}
				{state.isPlaying && <Started />}
			</ScrollView>
		</Wrapper>
	);
}
