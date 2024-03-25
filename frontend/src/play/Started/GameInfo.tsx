import * as Application from 'expo-application';

import { FlatList, Text, View } from 'react-native';
import React, { Dispatch, SetStateAction, useEffect } from 'react';

import { GamePlaying } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { socket } from '@/context/SocketContext';
import useApp from '@/context/AppContext';

const userId = Application.androidId;
export default function GameInfo({
	setIsLoading,
}: {
	setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
	const { state, updateCurrentGamePlaying } = useApp();
	const { currentGamePlaying } = state;

	useEffect(() => {
		if (!socket.connected) {
			socket.connect();
		}

		const gameExpired = () => {
			setIsLoading(false);
			updateCurrentGamePlaying(null);
		};

		const newPlayer = (data: { gameEmitInfo: GamePlaying; userId: string }) => {
			if (userId === data.userId) return;
			updateCurrentGamePlaying(data.gameEmitInfo);
		};

		socket.on('gameExpired', gameExpired);

		socket.on('newPlayer', newPlayer);

		return () => {
			socket.off('newPlayer', newPlayer);

			socket.off('gameExpired', gameExpired);
		};
	}, []);

	return (
		<View className='w-full'>
			{/* Players */}
			<View>
				<Text className='text-lightest text-lg font-semibold mt-2'>
					Players
				</Text>
				<FlatList
					data={currentGamePlaying?.players}
					renderItem={({ item }) => {
						return (
							<View className='flex flex-row justify-between items-center px-2'>
								<Text className='text-lightest text-base'>
									{item.player.name}
								</Text>
								<View className='flex flex-row items-center'>
									{item.voted && (
										<Text className='font-medium text-green-300 ml-2 text-xs'>
											Voted
										</Text>
									)}
									{currentGamePlaying?.admin.id === item.player.id && (
										<Text className='font-medium text-light text-xs ml-2'>
											Admin
										</Text>
									)}
									{item.player.id === userId && (
										<Ionicons
											name='person'
											size={14}
											color='#b7c5d0'
											style={{
												marginLeft: 3,
											}}
										/>
									)}
								</View>
							</View>
						);
					}}
				/>
			</View>
		</View>
	);
}
