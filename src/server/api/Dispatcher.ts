import { Base_Reply, Request, Server } from 'hapi';
import { Database } from 'sqlite';

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

export class Dispatcher {
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

    public static registerRoutes(server: Server, db: Database) {
        const contractsService = new ContractsService(db);
        const settingsService = new SettingsService(db);

        server.route(this.buildRoute(new GetAllDevelopersRouteFactory(db)));
        server.route(this.buildRoute(new GetDeveloperByIdRouteFactory(db)));
        server.route(this.buildRoute(new CreateDeveloperRouteFactory(db)));
        server.route(this.buildRoute(new UpdateDeveloperRouteFactory(db)));
        server.route(this.buildRoute(new DeleteDeveloperRouteFactory(db)));

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
