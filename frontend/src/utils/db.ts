import { ToastAndroid } from 'react-native';
import axios from 'axios';

console.log(process.env.EXPO_PUBLIC_URL);
// Create an instance
const instance = axios.create({
	baseURL: process.env.EXPO_PUBLIC_URL ?? '',
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json',
		// Authorization: 'Bearer your_token_here',
	},
});

instance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (!error.response) {
			// Network error
			ToastAndroid.show('Network Error', ToastAndroid.LONG);
			console.log('Network error:', error.message);
			// Handle the error as needed
		}
		return Promise.reject(error);
	},
);

export default instance;
