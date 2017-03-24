import { IReply, Request, Server } from 'hapi';
import { Database } from 'sqlite';

import { ContractsSchema } from './schema/ContractsSchema';
import { DevelopersSchema } from './schema/DevelopersSchema';
import { SettingsSchema } from './schema/SettingsSchema';

import { ContractsService } from './services/ContractsService';
import { DevelopersService } from './services/DevelopersService';
import { SettingsService } from './services/SettingsService';

export class Dispatcher {
	public static registerRoutes(server: Server, db: Database) {
		const contractsService = new ContractsService(db);
		const developersService = new DevelopersService(db);
		const settingsService = new SettingsService(db);

		server.route({
			method: 'GET',
			path: '/rest/developers',
			handler: (request: Request, reply: IReply) => {
				return developersService.getAll(request, reply);
			}
		});

		server.route({
			method: 'GET',
			path: '/rest/developers/{DeveloperId}',
			handler: (request: Request, reply: IReply) => {
				return developersService.getById(request, reply);
			},
			config: {
				validate: DevelopersSchema.getById
			}
		});

		server.route({
			method: 'POST',
			path: '/rest/developers',
			handler: (request: Request, reply: IReply) => {
				return developersService.create(request, reply);
			},
			config: {
				validate: DevelopersSchema.create
			}
		});

		server.route({
			method: 'PUT',
			path: '/rest/developers/{DeveloperId}',
			handler: (request: Request, reply: IReply) => {
				return developersService.update(request, reply);
			},
			config: {
				validate: DevelopersSchema.update
			}
		});

		server.route({
			method: 'DELETE',
			path: '/rest/developers/{DeveloperId}',
			handler: (request: Request, reply: IReply) => {
				return developersService.delete(request, reply);
			},
			config: {
				validate: DevelopersSchema.delete
			}
		});

		server.route({
			method: 'GET',
			path: '/rest/developers/{DeveloperId}/contracts-{Year}',
			handler: (request: Request, reply: IReply) => {
				return contractsService.getAllByYear(request, reply);
			},
			config: {
				validate: ContractsSchema.getAllByYear
			}
		});

		server.route({
			method: 'GET',
			path: '/rest/developers/{DeveloperId}/contracts/{ContractId}',
			handler: (request: Request, reply: IReply) => {
				return contractsService.getById(request, reply);
			},
			config: {
				validate: ContractsSchema.getById
			}
		});

		server.route({
			method: 'POST',
			path: '/rest/developers/{DeveloperId}/contracts',
			handler: (request: Request, reply: IReply) => {
				return contractsService.create(request, reply);
			},
			config: {
				validate: ContractsSchema.create
			}
		});

		server.route({
			method: 'PUT',
			path: '/rest/developers/{DeveloperId}/contracts/{ContractId}',
			handler: (request: Request, reply: IReply) => {
				return contractsService.update(request, reply);
			},
			config: {
				validate: ContractsSchema.update
			}
		});

		server.route({
			method: 'DELETE',
			path: '/rest/developers/{DeveloperId}/contracts/{ContractId}',
			handler: (request: Request, reply: IReply) => {
				return contractsService.delete(request, reply);
			},
			config: {
				validate: ContractsSchema.delete
			}
		});

		server.route({
			method: 'GET',
			path: '/rest/settings',
			handler: (request: Request, reply: IReply) => {
				return settingsService.get(request, reply);
			}
		});

		server.route({
			method: 'PUT',
			path: '/rest/settings',
			handler: (request: Request, reply: IReply) => {
				return settingsService.set(request, reply);
			},
			config: {
				validate: SettingsSchema.set
			}
		});
	}
}
