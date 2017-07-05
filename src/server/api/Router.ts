import { Provider, ReflectiveInjector } from 'injection-js';
import { Base_Reply, Request, Server } from 'hapi';

import { ContractsSchema } from './schema/ContractsSchema';

import { ContractsService } from './services/ContractsService';

import { SqlDatabase } from '../data/SqlDatabase';

import { GetAllDevelopersRoute } from './developers/GetAllDevelopersRoute';
import { GetDeveloperByIdRoute } from './developers/GetDeveloperByIdRoute';
import { CreateDeveloperRoute } from './developers/CreateDeveloperRoute';
import { UpdateDeveloperRoute } from './developers/UpdateDeveloperRoute';
import { DeleteDeveloperRoute } from './developers/DeleteDeveloperRoute';

import { GetSettingsRoute } from './settings/GetSettingsRoute';
import { SetSettingsRoute } from './settings/SetSettingsRoute';

export class Router {
    public static init(server: Server, injector: ReflectiveInjector) {
        const db: SqlDatabase = injector.get(SqlDatabase);
        const contractsService = new ContractsService(db);

        server.route(this.resolveRoute(injector, GetAllDevelopersRoute));
        server.route(this.resolveRoute(injector, GetDeveloperByIdRoute));
        server.route(this.resolveRoute(injector, CreateDeveloperRoute));
        server.route(this.resolveRoute(injector, UpdateDeveloperRoute));
        server.route(this.resolveRoute(injector, DeleteDeveloperRoute));

        server.route(this.resolveRoute(injector, GetSettingsRoute));
        server.route(this.resolveRoute(injector, SetSettingsRoute));

        server.route({
            method: 'GET',
            path: '/rest/developers/{DeveloperId}/contracts-{Year}',
            handler: (request: Request, reply: Base_Reply) => {
                return contractsService.getAllByYear(request, reply);
            },
            config: {
                validate: ContractsSchema.getAllByYear
            }
        });

        server.route({
            method: 'GET',
            path: '/rest/developers/{DeveloperId}/contracts/{ContractId}',
            handler: (request: Request, reply: Base_Reply) => {
                return contractsService.getById(request, reply);
            },
            config: {
                validate: ContractsSchema.getById
            }
        });

        server.route({
            method: 'POST',
            path: '/rest/developers/{DeveloperId}/contracts',
            handler: (request: Request, reply: Base_Reply) => {
                return contractsService.create(request, reply);
            },
            config: {
                validate: ContractsSchema.create
            }
        });

        server.route({
            method: 'PUT',
            path: '/rest/developers/{DeveloperId}/contracts/{ContractId}',
            handler: (request: Request, reply: Base_Reply) => {
                return contractsService.update(request, reply);
            },
            config: {
                validate: ContractsSchema.update
            }
        });

        server.route({
            method: 'DELETE',
            path: '/rest/developers/{DeveloperId}/contracts/{ContractId}',
            handler: (request: Request, reply: Base_Reply) => {
                return contractsService.delete(request, reply);
            },
            config: {
                validate: ContractsSchema.delete
            }
        });
    }

    private static resolveRoute(injector: ReflectiveInjector, token: Provider) {
        const route = injector.resolveAndInstantiate(token);
        const { method, path, config, handler } = route;
        return { method, path, config, handler: handler.bind(route) };
    }
}
