export interface Player {
	_id: string;
	player: {
		id: string;
		name: string;
	};
	voted: boolean;
	votes: string[];
}

export interface ResultType {
	A: { id: string; name: string; vote: number }[];
	B: { id: string; name: string; vote: number }[];
	C: { id: string; name: string; vote: number }[];
	D: { id: string; name: string; vote: number }[];
	F: { id: string; name: string; vote: number }[];
}

export type ResultGrade = 'A' | 'B' | 'C' | 'F';

export interface GamePlaying {
	id: string;
	admin: {
		id: string;
		name: string;
	};
	code: string;
	expires: string;
	name: string;
	players: Player[];
	rules: string[];
	started: boolean;
}
