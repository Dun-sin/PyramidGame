import { Text, View } from 'react-native';

import { Link } from 'expo-router';
import React from 'react';
import Wrapper from '@/components/Wrapper';
import { useHeaderHeight } from '@react-navigation/elements';

const index = () => {
	const headerHeight = useHeaderHeight();
	return (
		<Wrapper>
			<View className='px-4'>
				<Text
					className='text-lightest font-bold text-xl'
					style={{ marginTop: headerHeight }}>
					How to Play Pyramid Game
				</Text>
				<Text className='text-lightest mt-3'>
					The Pyramid Game is imitating the korean drama based on a webtoon with
					the same name called Pyramid Game.
				</Text>
				<Text className='text-lightest mt-3'>
					In this Game you and your friends get to pick who is the most popular,
					you can not vote for your self and can't vote for more than one person
				</Text>

				<Text className='text-lightest mt-3'>
					There are 4 grades, Grade A - F (no E) with A being the most popular
					and F being the least.
				</Text>

				<Text className='text-lightest mt-3'>
					You can either create a game or join a game with a code, when creating
					a game both the game name and game penalities are optional
				</Text>
			</View>
			<View className='w-full items-center justify-center mt-7'>
				<Link href='/play' className='bg-light w-72 p-3 rounded text-center'>
					Start playing
				</Link>
			</View>
		</Wrapper>
	);
};

export default index;
