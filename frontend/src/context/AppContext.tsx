import {
	Action,
	AppState,
	appReducer,
	initialState,
} from './reducer/AppReducer';
import { GamePlaying, ResultType } from '@/types';
import React, {
	Dispatch,
	ReactNode,
	createContext,
	useContext,
	useReducer,
} from 'react';

interface AppContextType {
	state: AppState;
	dispatch: Dispatch<Action>;
	updateIsPlaying: (isPlaying: boolean) => void;
	updateCurrentGamePlaying: (currentGamePlaying: null | GamePlaying) => void;
	updateName: (name: string) => void;
	updateLastGameResult: (result: ResultType | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(appReducer, initialState);

	const updateIsPlaying = (isPlaying: boolean) => {
		dispatch({ type: 'SET_IS_PLAYING', payload: isPlaying });
	};

	const updateCurrentGamePlaying = (currentGamePlaying: null | GamePlaying) => {
		dispatch({ type: 'SET_CURRENT_GAME_PLAYING', payload: currentGamePlaying });
		dispatch({ type: 'SET_IS_PLAYING', payload: !!currentGamePlaying });
	};

	const updateName = (name: string) => {
		dispatch({ type: 'SET_NAME', payload: name });
	};

	const updateLastGameResult = (result: ResultType | null) => {
		dispatch({ type: 'SET_LAST_GAME_RESULT', payload: result });
	};

	return (
		<AppContext.Provider
			value={{
				state,
				dispatch,
				updateIsPlaying,
				updateCurrentGamePlaying,
				updateName,
				updateLastGameResult,
			}}>
			{children}
		</AppContext.Provider>
	);
};

const useApp = (): AppContextType => {
	const context = useContext(AppContext);

	if (!context) {
		throw new Error('useApp must be used within an AppProvider');
	}

	return context;
};

export default useApp;
