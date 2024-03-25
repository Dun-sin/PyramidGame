import * as Clipboard from 'expo-clipboard';

import { ResultType } from '@/types';
import { ToastAndroid } from 'react-native';

export function generateRandomString(length: number) {
	let result = '';
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

export const copyToClipboard = async (context: string) => {
	await Clipboard.setStringAsync(context);

	ToastAndroid.show('Copied to clipboard', ToastAndroid.BOTTOM);
};

export const calculateTimeLeft = (time: string | undefined) => {
	if (!time) return;

	const difference = +new Date(time) - +new Date();
	let totalSeconds = Math.floor(difference / 1000);
	let minutes = Math.floor(totalSeconds / 60);
	let seconds = totalSeconds % 60;

	return { minutes, seconds };
};

export const allGradesEmpty = (result: ResultType): boolean => {
	let values = Object.values(result);
	if (values.length > 5) values.shift();

	return values.every((value) => value.length === 0);
};

export function calculateTotalPeople(result: ResultType | null): number {
	if (!result) return 0;
	let total = 0;
	for (const grade in result) {
		if (Object.prototype.hasOwnProperty.call(result, grade)) {
			total += result[grade as keyof ResultType].length;
		}
	}
	return total;
}

export const sortResults = (results: ResultType | null): ResultType | null => {
	if (!results) return null;
	const sortedResults: ResultType = {
		A: results.A.sort((a, b) => {
			if (b.vote !== a.vote) {
				return b.vote - a.vote; // Sort by vote in descending order
			} else {
				return a.name.localeCompare(b.name); // If vote is the same, sort by name alphabetically
			}
		}),
		B: results.B.sort((a, b) => {
			if (b.vote !== a.vote) {
				return b.vote - a.vote;
			} else {
				return a.name.localeCompare(b.name);
			}
		}),
		C: results.C.sort((a, b) => {
			if (b.vote !== a.vote) {
				return b.vote - a.vote;
			} else {
				return a.name.localeCompare(b.name);
			}
		}),
		D: results.D.sort((a, b) => {
			if (b.vote !== a.vote) {
				return b.vote - a.vote;
			} else {
				return a.name.localeCompare(b.name);
			}
		}),
		F: results.F.sort((a, b) => {
			if (b.vote !== a.vote) {
				return b.vote - a.vote;
			} else {
				return a.name.localeCompare(b.name);
			}
		}),
	};
	return sortedResults;
};
