import { number } from 'joi';

export const ContractsSchema = {
	getAllByYear: {
		params: {
			DeveloperId: number().required().integer().min(1),
			Year: number().required().integer().min(2010).max(2030)
		}
	},

	getById: {
		params: {
			DeveloperId: number().required().integer().min(1),
			ContractId: number().required().integer().min(1)
		}
	},

	create: {
		params: {
			DeveloperId: number().required().integer().min(1)
		},
		payload: {
			Amount: number().required().min(0),
			StartDate: number().required().integer().min(0),
			Deadline: number().required().integer().min(0),
			AcceptanceDate: number().optional().integer().min(0)
		}
	},

	update: {
		params: {
			DeveloperId: number().required().integer().min(1),
			ContractId: number().required().integer().min(1)
		},
		payload: {
			Id: number().required().integer().min(1),
			DeveloperId: number().required().integer().min(1),
			Amount: number().required().min(0),
			StartDate: number().required().integer().min(0),
			Deadline: number().required().integer().min(0),
			AcceptanceDate: number().optional().integer().min(0)
		}
	},

	delete: {
		params: {
			DeveloperId: number().required().integer().min(1),
			ContractId: number().required().integer().min(1)
		}
	}
}
