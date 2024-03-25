import * as Application from 'expo-application';

import { Pressable, Text, ToastAndroid, View } from 'react-native';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import DropdownComponent from '@/components/DropDownCompontent';
import { GamePlaying } from '@/types';
import { socket } from './../../context/SocketContext';
import useApp from '@/context/AppContext';

const voteArray = [1, 2, 3, 4, 5];
export interface votesType {
	index: number;
	vote: string;
}

const userId = Application.androidId;
export default function Voting({
	setVoting,
}: {
	setVoting: Dispatch<SetStateAction<boolean>>;
}) {
	const { state, updateCurrentGamePlaying } = useApp();
	const players = state.currentGamePlaying?.players;
	const filter = players?.filter((value) => value.player.id !== userId);
	const availablePlayers =
		filter?.map((item) => ({
			value: item.player.id,
			label: item.player.name,
		})) || [];

	const [isLoading, setIsLoading] = useState(false);
	const [votes, setVotes] = useState<votesType[]>([]);

	const handleSubmit = async () => {
		if (isLoading) return;

		setIsLoading(true);
		if (votes.length < 5) {
			setIsLoading(false);
			return ToastAndroid.show('Not enough votes', ToastAndroid.LONG);
		}

		const vote = votes.map((value) => value.vote);
		const gameId = state.currentGamePlaying?.id;
		socket.emit('vote', { userId, vote, gameId });
	};

	useEffect(() => {
		const errorVoting = (message: string) => {
			ToastAndroid.show(message, ToastAndroid.CENTER);
			setIsLoading(false);
			if (message === `You've already voted`) {
				setVoting(false);
			}
		};

		const successfullyVoted = (data: GamePlaying) => {
			ToastAndroid.show(`You've Successfully Voted`, ToastAndroid.LONG);
			setIsLoading(false);
			updateCurrentGamePlaying(data);
			setVoting(false);
		};

		socket.on('errorVoting', errorVoting);
		socket.on('successfullyVoted', successfullyVoted);
		return () => {
			socket.off('errorVoting', errorVoting);
			socket.off('successfullyVoted', successfullyVoted);
		};
	}, []);

	return (
		<View className='flex flex-col gap-y-6'>
			<View>
				{voteArray.map((value) => {
					return (
						<View
							className='flex flex-row justify-between items-center'
							key={value}>
							<Text className='text-lightest'>{value}. </Text>
							<View style={{ width: '90%' }}>
								<DropdownComponent
									index={value}
									data={availablePlayers}
									setVotes={setVotes}
									votes={votes}
								/>
							</View>
						</View>
					);
				})}
			</View>

			<Pressable onPress={handleSubmit} className='bg-brand py-2 rounded-md'>
				<Text className='text-lightest text-center text-lg'>
					{isLoading ? 'Loading....' : 'Submit'}
				</Text>
			</Pressable>
		</View>
	);
}
