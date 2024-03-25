import axios from 'axios';

// Create an instance
const instance = axios.create({
	baseURL: process.env.EXPO_PUBLIC_URL ?? '',
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json',
		// Authorization: 'Bearer your_token_here',
	},
});

export default instance;
