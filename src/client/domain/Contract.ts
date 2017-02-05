export interface Contract {
	Id: number;
	DeveloperId: number;
	Amount: number;
	StartDate: Date;
	Deadline: Date;
	AcceptanceDate?: Date;
}
