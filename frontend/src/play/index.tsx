import * as Application from 'expo-application';

import { Pressable, Text, ToastAndroid, View } from 'react-native';
import { useEffect, useState } from 'react';

import CustomModal from '@/components/CustomModal';
import GameOptions from './GameOptions';
import { GamePlaying } from '@/types';
import Result from '@/components/Result';
import { TextInput } from 'react-native-paper';
import instance from '@/utils/db';
import { socket } from '@/context/SocketContext';
import useApp from '@/context/AppContext';

const userId = Application.androidId;
const index = () => {
	const [gameModalVisible, setGameModalVisible] = useState(false);
	const [userModalVisible, setUserModalVisible] = useState(false);
	const [name, setName] = useState<null | string>(null);
	const [code, setCode] = useState<null | string>(null);

	const hideGameModal = () => setGameModalVisible(false);
	const showGameModal = () => {
		if (!state.name) {
			return ToastAndroid.show(
				`Can't create a game, pls enter your name`,
				ToastAndroid.LONG,
			);
		}
		setGameModalVisible(true);
	};
	const hideUserModal = () => setUserModalVisible(false);
	const showUserModal = () => setUserModalVisible(true);

	const { state, updateCurrentGamePlaying, updateName } = useApp();

	const handleNameSubmit = async () => {
		if (!name) {
			ToastAndroid.show('Please enter your name', ToastAndroid.LONG);
			return;
		} else if (name.length < 5) {
			ToastAndroid.show(
				'Name has to be more than 5 characters',
				ToastAndroid.LONG,
			);
			return;
		}

		try {
			const response = await instance.patch(`/users/${userId}`, { name });

			if (response.status === 200) {
				ToastAndroid.show('Name added Successfully', ToastAndroid.SHORT);
				updateName(name);
				hideUserModal();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleCodeSubmit = async () => {
		if (!code) {
			return ToastAndroid.show('Pls enter a valid code', ToastAndroid.CENTER);
		}

		socket.emit('joinRoom', {
			gamecode: code,
			userinfo: {
				id: userId,
				name: state.name,
			},
		});
	};

	useEffect(() => {
		const joinRoomError = (message: string) => {
			ToastAndroid.show(message, ToastAndroid.LONG);
		};

		if (!socket.connected) {
			socket.connect();
		}

		const joinedRoom = (gameInfo: GamePlaying) => {
			updateCurrentGamePlaying(gameInfo);
		};

		socket.on('joinRoomError', joinRoomError);
		socket.on('joinedRoom', joinedRoom);

		return () => {
			socket.off('joinRoomError', joinRoomError);
			socket.off('joinedRoom', joinedRoom);
		};
	}, []);

	return (
		<>
			<View className='mb-10 w-full px-5'>
				{!state.name && (
					<View>
						<Pressable
							onPress={showUserModal}
							className='flex flex-row items-center gap-1'>
							<Text className='text-red-500 underline underline-offset-1'>
								tap here
							</Text>
							<Text className='text-red-500'>to input your name</Text>
						</Pressable>
						<Text className='text-lightest font-bold'>
							Note: You can't create or join a game without a name
						</Text>
					</View>
				)}
				{state.name && (
					<View className='flex flex-row justify-between'>
						<Text className='text-lightest text-lg'>{state.name}</Text>
						<Pressable
							onPress={showUserModal}
							className='border-2 border-lightest rounded px-4 py-1'>
							<Text className='text-center text-lightest'>Edit</Text>
						</Pressable>
					</View>
				)}
			</View>

			<View className='w-full px-5'>
				<Pressable
					onPress={showGameModal}
					className='bg-brand px-6 py-2 rounded w-full'>
					<Text className='text-lightest text-center'>Start a Game</Text>
				</Pressable>
				<Text className='my-1.5 text-lightest text-base text-center'>OR</Text>
				<View className='flex flex-row w-full items-center justify-between'>
					<TextInput
						className='border px-3 rounded w-9/12 h-11 text-lightest bg-darkest'
						clearButtonMode='while-editing'
						inputMode='text'
						cursorColor='#fff'
						outlineStyle={{ borderColor: '#fff' }}
						placeholder='Enter game code'
						placeholderTextColor={'#fff'}
						onChangeText={(text) => setCode(text)}
						mode='outlined'
						textColor='#fff'
					/>
					<Pressable
						className='h-11 bg-brand flex items-center justify-center px-5 rounded'
						onPress={handleCodeSubmit}>
						<Text className='text-lightest'>Submit</Text>
					</Pressable>
				</View>
			</View>

			<Result />
			<CustomModal visible={gameModalVisible} hideModal={hideGameModal}>
				<View className='w-fit'>
					<GameOptions />
				</View>
			</CustomModal>
			<CustomModal visible={userModalVisible} hideModal={hideUserModal}>
				<View className='bg-darkest px-10 py-10 w-9/12 rounded-md'>
					<TextInput
						className='border px-2 rounded w-full h-11 text-lightest bg-darkest'
						clearButtonMode='while-editing'
						inputMode='text'
						cursorColor='#fff'
						outlineStyle={{ borderColor: '#fff' }}
						placeholder='Enter your name'
						placeholderTextColor={'#fff'}
						mode='outlined'
						textColor='#fff'
						onChangeText={(text) => setName(text)}
					/>
					<Pressable onPress={handleNameSubmit} className='bg-brand mt-2'>
						<Text className='text-lightest text-center py-2 rounded'>
							Submit
						</Text>
					</Pressable>
				</View>
			</CustomModal>
		</>
	);
};

export default index;
