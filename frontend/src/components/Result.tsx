import { Text, View } from 'react-native';
import { calculateTotalPeople, sortResults } from '@/utils/lib';

import React from 'react';
import { ResultType } from '@/types';
import { ScrollView } from 'react-native';
import useApp from '@/context/AppContext';

const Result = () => {
	const { state } = useApp();
	const result = sortResults(state.lastGameResult);

	const totalPeople = calculateTotalPeople(result);

	const resultDisplay = (
		value: { id: string; name: string; vote: number }[],
		grade: string,
	) => {
		return (
			<View className='flex flex-row gap-x-3 items-center'>
				<Text className='text-lightest h-full border-2 border-lightest p-2 rounded-md'>
					{grade}
				</Text>
				<View className='gap-y-4' style={{ width: '90%' }}>
					{value.map((item) => {
						return (
							<View
								key={item.id}
								className='w-full flex flex-row items-center gap-x-3'>
								<Text className='text-lightest w-14 truncate'>{item.name}</Text>
								<View className='flex-1'>
									<View
										className='bg-lightest h-4'
										style={{ width: `${(item.vote / totalPeople) * 100}%` }}
									/>
								</View>
								<Text className='text-lightest'>{item.vote}</Text>
							</View>
						);
					})}
				</View>
			</View>
		);
	};

	return (
		<ScrollView className='w-full px-5 mt-5'>
			<Text className='text-lightest font-semibold text-base'>
				Result from Previous Game
			</Text>
			<View className='flex flex-col gap-y-4 mt-2'>
				{result ? (
					Object.keys(result).map((value) => {
						const voteInfo = result[value as keyof ResultType];
						return resultDisplay(voteInfo, value);
					})
				) : (
					<Text>
						You haven't played any game recently, Create or Join a Game
					</Text>
				)}
			</View>
		</ScrollView>
	);
};

export default Result;
