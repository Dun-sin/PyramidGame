import * as Application from 'expo-application';

import { Dimensions, Pressable, Text, ToastAndroid, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
	allGradesEmpty,
	calculateTimeLeft,
	copyToClipboard,
} from '@/utils/lib';

import CustomModal from '@/components/CustomModal';
import { Feather } from '@expo/vector-icons';
import GameInfo from './GameInfo';
import { GamePlaying } from '@/types';
import Voting from './Voting';
import instance from '@/utils/db';
import { socket } from './../../context/SocketContext';
import useApp from '@/context/AppContext';

const width = Dimensions.get('window').width - 40;
const userId = Application.androidId;

export default function Started() {
	const { state, updateCurrentGamePlaying, updateLastGameResult } = useApp();
	const { currentGamePlaying } = state;

	const [voting, setVoting] = useState(false);
	const userVotingDetail = currentGamePlaying?.players.find(
		(obj) => obj.player.id === userId,
	);
	const numberOfPlayers = currentGamePlaying?.players.length || 0;

	const [modalVisible, setModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const hideModal = () => setModalVisible(false);
	const showModal = () => setModalVisible(true);

	const handleCopyToClipboard = () => {
		const code = currentGamePlaying?.code;
		if (!code) {
			updateCurrentGamePlaying(null);
			return;
		}
		copyToClipboard(code);
	};

	const time = currentGamePlaying?.expires;

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(time));

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(calculateTimeLeft(time));
		}, 1000); // Update every second

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		if (!timeLeft?.seconds) return;
		if (timeLeft?.seconds > 0) return;

		if (!socket.connected) {
			socket.connect();
		}

		socket.emit('deleteGame', {
			gameId: currentGamePlaying?.id,
			gameCode: currentGamePlaying?.code,
		});
	}, [timeLeft]);

	const handleDelete = () => {
		if (isLoading) return;

		setIsLoading(true);
		socket.emit('deleteGame', {
			gameId: currentGamePlaying?.id,
			gameCode: currentGamePlaying?.code,
		});
	};

	useEffect(() => {
		const someoneVoted = ({
			gameInfo,
			message,
		}: {
			gameInfo: GamePlaying;
			message: string;
		}) => {
			console.log(message);
			updateCurrentGamePlaying(gameInfo);
			ToastAndroid.show(message, ToastAndroid.LONG);
		};

		const everyoneHasVoted = async () => {
			ToastAndroid.show(
				'Everyone has voted and results has been calculated, game will self destruct soon',
				ToastAndroid.LONG,
			);

			try {
				const response = await instance.get(`/users/${userId}`);
				const data = response.data;

				if (response.status === 200) {
					const result = data.lastGameResult;

					result && !allGradesEmpty(result) && updateLastGameResult(result);
				}
			} catch (error) {
				ToastAndroid.show('Something went wrong!!', ToastAndroid.BOTTOM);
			}
		};

		socket.on('someoneVoted', someoneVoted);
		socket.on('everyoneHasVoted', everyoneHasVoted);

		return () => {
			socket.off('someoneVoted', someoneVoted);
			socket.off('everyoneHasVoted', everyoneHasVoted);
		};
	}, []);

	return (
		<>
			<View className='h-full' style={{ width: width }}>
				<View>
					<View className='flex gap-x-2 flex-row items-center w-full'>
						<Text className='text-lightest'>You're Currently Playing:</Text>
						<Text className='text-lightest font-semibold italic'>
							{currentGamePlaying?.name || 'Pyramid Game'}
						</Text>
					</View>
					<Pressable
						onPress={handleCopyToClipboard}
						className='flex flex-row justify-between items-center'>
						<Text className='text-lightest'>
							Invite your friends by copying the code:
						</Text>
						<View className='bg-lightest flex flex-row  items-center rounded-md min-w-[50] max-w-[100] justify-center px-3'>
							<Text className='mr-2 text-sm'>{currentGamePlaying?.code}</Text>
							<Feather name='copy' size={16} color='black' />
						</View>
					</Pressable>
				</View>

				<View className='mt-3 flex flex-row items-center justify-between'>
					<Text className='text-lightest'>
						Game Expires in: {timeLeft?.minutes} min {timeLeft?.seconds} sec
					</Text>
					<Pressable
						onPress={showModal}
						className='border-2 border-lightest px-3 py-1 rounded'>
						<Text className='text-lightest'>Rules</Text>
					</Pressable>
				</View>

				{!voting && <GameInfo setIsLoading={setIsLoading} />}
				{voting && <Voting setVoting={setVoting} />}

				<View
					className={`absolute bottom-10 flex flex-row ${
						currentGamePlaying?.admin.id === userId
							? 'justify-between'
							: 'justify-center'
					} items-center`}
					style={{ width: width }}>
					{!voting && currentGamePlaying?.admin.id === userId && (
						<Pressable
							className={`bg-red-500 px-3 py-2 rounded-md max-w-full`}
							style={{ minWidth: '40%' }}
							onPress={handleDelete}>
							<Text className='text-center text-lightest text-lg'>
								{isLoading ? 'Loading...' : 'End Game'}
							</Text>
						</Pressable>
					)}

					{!userVotingDetail?.voted && numberOfPlayers >= 7 && !voting ? (
						<Pressable
							className='bg-brand px-3 py-2 rounded-md max-w-full'
							style={{ minWidth: '40%' }}
							onPress={() => setVoting(true)}>
							<Text className='text-center text-lightest text-lg'>Vote</Text>
						</Pressable>
					) : (
						<Text
							className='text-lightest mr-6 ml-2 text-center'
							style={{ maxWidth: '55%', minWidth: '10%' }}>
							You need 7 more people to be able to play, invite more people to
							play!
						</Text>
					)}
				</View>
			</View>
			<CustomModal hideModal={hideModal} visible={modalVisible}>
				<View className='px-4 py-8 bg-black rounded-md w-4/6'>
					<Text className='text-lightest font-extrabold text-lg'>
						Game Penalites
					</Text>
					{currentGamePlaying?.rules.map((value, index) => (
						<Text className='text-lightest' key={value}>
							{index + 1}. {value}
						</Text>
					))}
				</View>
			</CustomModal>
		</>
	);
}
