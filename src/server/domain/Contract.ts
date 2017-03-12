import { Record } from './Record';

export interface Contract extends Record {
	DeveloperId: number;
	Amount: number;
	StartDate: number;
	Deadline: number;
	AcceptanceDate: number;
}
