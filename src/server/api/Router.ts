import { Base_Reply, Request, Server } from 'hapi';

import { ContractsSchema } from './schema/ContractsSchema';
import { SettingsSchema } from './schema/SettingsSchema';

import { ContractsService } from './services/ContractsService';
import { SettingsService } from './services/SettingsService';

import { Route } from './abstract/Interface';
import { RouteFactory } from './abstract/RouteFactory';

import { GetAllDevelopersRouteFactory } from './developers/getall/Factory';
import { GetDeveloperByIdRouteFactory } from './developers/getbyid/Factory';
import { CreateDeveloperRouteFactory } from './developers/create/Factory';
import { UpdateDeveloperRouteFactory } from './developers/update/Factory';
import { DeleteDeveloperRouteFactory } from './developers/delete/Factory';

import { Injector } from 'injection-js';
import { SqlDatabase } from '../data/abstract/SqlDatabase';

export class Router {
    private static buildRoute<T extends Route>(factory: RouteFactory<T>) {
        const route = factory.createRoute();
        const { method, path, handler } = route;
        const result: Route = {
            method, path, handler: handler.bind(route)
        };

        const validate = factory.createSchema();
        if (validate) result.config = { validate };

        return result;
    }

    public static init(server: Server, injector: Injector) {
        const db: SqlDatabase = injector.get(SqlDatabase);

        const contractsService = new ContractsService(db);
        const settingsService = new SettingsService(db);

        server.route(this.buildRoute(new GetAllDevelopersRouteFactory(injector)));
        server.route(this.buildRoute(new GetDeveloperByIdRouteFactory(injector)));
        server.route(this.buildRoute(new CreateDeveloperRouteFactory(injector)));
        server.route(this.buildRoute(new UpdateDeveloperRouteFactory(injector)));
        server.route(this.buildRoute(new DeleteDeveloperRouteFactory(injector)));

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

        server.route({
            method: 'GET',
            path: '/rest/settings',
            handler: (request: Request, reply: Base_Reply) => {
                return settingsService.get(request, reply);
            }
        });

        server.route({
            method: 'PUT',
            path: '/rest/settings',
            handler: (request: Request, reply: Base_Reply) => {
                return settingsService.set(request, reply);
            },
            config: {
                validate: SettingsSchema.set
            }
        });
    }
}
