import { GamePlaying, ResultType } from '@/types';

export interface AppState {
	isPlaying: boolean;
	currentGamePlaying: GamePlaying | null;
	name: string | null;
	lastGameResult: ResultType | null;
}
export type Action =
	| { type: 'SET_IS_PLAYING'; payload: boolean }
	| { type: 'SET_CURRENT_GAME_PLAYING'; payload: null | GamePlaying }
	| { type: 'SET_NAME'; payload: string }
	| { type: 'SET_LAST_GAME_RESULT'; payload: null | ResultType };

export const initialState: AppState = {
	isPlaying: false,
	currentGamePlaying: null,
	name: null,
	lastGameResult: null,
};

export const appReducer = (state: AppState, action: Action): AppState => {
	switch (action.type) {
		case 'SET_IS_PLAYING':
			return { ...state, isPlaying: action.payload };
		case 'SET_CURRENT_GAME_PLAYING':
			return { ...state, currentGamePlaying: action.payload };
		case 'SET_NAME':
			return { ...state, name: action.payload };
		case 'SET_LAST_GAME_RESULT':
			return { ...state, lastGameResult: action.payload };
		default:
			return state;
	}
};
