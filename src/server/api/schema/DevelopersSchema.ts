import { number, string } from 'joi';

export const DevelopersSchema = {
	getById: {
		params: {
			DeveloperId: number().required().integer().min(1)
		}
	},

	create: {
		payload: {
			Name: string().required().min(4).max(128),
			CeilingAmount: number().required().min(0)
		}
	},

	update: {
		params: {
			DeveloperId: number().required().integer().min(1)
		},
		payload: {
			Id: number().required().integer().min(1),
			Name: string().required().min(4).max(128),
			CeilingAmount: number().required().min(0)
		}
	},

	delete: {
		params: {
			DeveloperId: number().required().integer().min(1)
		}
	}
}
