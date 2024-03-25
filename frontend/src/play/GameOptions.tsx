import * as Application from 'expo-application';

import {
	Dimensions,
	FlatList,
	Pressable,
	Text,
	ToastAndroid,
	View,
} from 'react-native';
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';

import { SocketContext } from '@/context/SocketContext';
import { TextInput } from 'react-native-paper';
import { generateRandomString } from '@/utils/lib';
import useApp from '@/context/AppContext';

const { width } = Dimensions.get('window');
const userId = Application.androidId;

const GameOptions = () => {
	const [currentInputRule, setCurrentInputRule] = useState<undefined | string>(
		undefined,
	);

	const [isAddingRules, setIsAddingRules] = useState(false);
	const [rules, setRules] = useState<string[]>([]);
	const [gameName, setGameName] = useState<undefined | string>(undefined);
	const [isLoading, setIsLoading] = useState(false);

	const socket = useContext(SocketContext);
	const { updateCurrentGamePlaying, state } = useApp();

	const inputOfRule = () => setIsAddingRules(true);
	const stopInputOfRule = () => setIsAddingRules(false);

	const addRule = () => {
		if (!currentInputRule || currentInputRule === '') {
			ToastAndroid.show('No rule inputed', ToastAndroid.BOTTOM);
			stopInputOfRule();
			return;
		}

		const rule = [...rules, currentInputRule];

		if (rule.length >= 4) {
			return ToastAndroid.show(
				`You can't have more than 3 penalites`,
				ToastAndroid.LONG,
			);
		} else if (rules.includes(currentInputRule)) {
			return ToastAndroid.show(
				`You've already added that penalty`,
				ToastAndroid.LONG,
			);
		}
		setRules(rule);
		setCurrentInputRule(undefined);
	};

	const deleteRule = (item: string) => {
		const rule = [...rules];
		const index = rule.findIndex((value) => value === item);
		if (index !== -1) {
			rule.splice(index, 1);
			setRules(rule);
		}
	};

	const createGame = async () => {
		setIsLoading(true);
		const name = gameName?.slice(0, 30) ?? 'Pyramid Game';

		if (!state.name) {
			setIsLoading(false);
			return ToastAndroid.show(
				`Can't create a game if you haven't set your name`,
				ToastAndroid.LONG,
			);
		}

		const gameInfo = {
			name,
			rules,
			admin: { id: userId, name: state.name },
			code: generateRandomString(6),
			players: [{ player: { id: userId, name: state.name } }],
		};

		socket?.emit('createGame', gameInfo);
	};

	useEffect(() => {
		const createdGame = (data: any) => {
			setIsLoading(false);
			updateCurrentGamePlaying(data);
		};

		if (!socket.connected) {
			socket.connect();
		}

		socket?.on('createdGame', createdGame);

		return () => {
			socket?.off('createdGame', createdGame);
		};
	}, []);

	return (
		<View
			className='rounded-xl bg-darkest p-4 py-5 flex-col items-center justify-center gap-y-3'
			style={{ width: width - 50 }}>
			<Text className='text-lightest text-xl w-11/12 text-start'>
				Game Options
			</Text>
			<TextInput
				className='text-lightest px-3 rounded bg-darkest w-11/12'
				clearButtonMode='while-editing'
				inputMode='text'
				cursorColor='#fff'
				outlineStyle={{ borderColor: '#fff' }}
				placeholder='Game Name (optional)'
				placeholderTextColor={'#fff'}
				mode='outlined'
				textColor='#fff'
				onChangeText={(value) => setGameName(value)}
				value={gameName}
			/>
			<View className='w-11/12 bg-brand p-2 rounded'>
				<View className='w-full flex-row justify-between items-center'>
					<Text className='text-lightest text-lg underline'>
						Add penalty (optional)
					</Text>
					<Pressable onPress={inputOfRule}>
						<Entypo name='plus' size={20} color='#fff' />
					</Pressable>
				</View>
				{isAddingRules && (
					<View className='flex-row w-full items-center gap-x-1 mt-4'>
						<TextInput
							className='text-lightest px-3 h-10 rounded bg-darkest w-4/5'
							clearButtonMode='while-editing'
							inputMode='text'
							cursorColor='#fff'
							outlineStyle={{ borderColor: '#fff' }}
							placeholder='Enter Rule'
							placeholderTextColor={'#fff'}
							onChangeText={(value) => setCurrentInputRule(value)}
							value={currentInputRule}
							mode='outlined'
							textColor='#fff'
						/>
						<Pressable onPress={stopInputOfRule}>
							<MaterialIcons name='cancel' size={24} color='#EE4B2B' />
						</Pressable>
						<Pressable onPress={addRule}>
							<Ionicons
								name='checkmark-circle-sharp'
								size={24}
								color='#00FF00'
							/>
						</Pressable>
					</View>
				)}
				<View className='mt-3'>
					{rules.length !== 0 && (
						<FlatList
							data={rules}
							renderItem={({ item }) => (
								<View className='ml-2 mb-2 flex flex-row justify-between'>
									<Text className='text-lightest'>{`\u2022 ${item}`}</Text>
									<Pressable onPress={() => deleteRule(item)}>
										<MaterialIcons name='delete' size={16} color='#EE4B2B' />
									</Pressable>
								</View>
							)}
						/>
					)}
				</View>
			</View>
			<Pressable className='bg-brand py-2 w-11/12' onPress={createGame}>
				<Text className='text-lightest text-center font-semibold'>
					{isLoading ? 'Loading...' : 'Create Game'}
				</Text>
			</Pressable>
		</View>
	);
};

export default GameOptions;
