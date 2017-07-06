import { Provider, ReflectiveInjector } from 'injection-js';
import { Server } from 'hapi';

import { GetAllDevelopersRoute } from './developers/GetAllDevelopersRoute';
import { GetDeveloperByIdRoute } from './developers/GetDeveloperByIdRoute';
import { CreateDeveloperRoute } from './developers/CreateDeveloperRoute';
import { UpdateDeveloperRoute } from './developers/UpdateDeveloperRoute';
import { DeleteDeveloperRoute } from './developers/DeleteDeveloperRoute';

import { GetAllContractsByYearRoute } from './contracts/GetAllContractsByYearRoute';
import { GetContractByIdRoute } from './contracts/GetContractByIdRoute';
import { CreateContractRoute } from './contracts/CreateContractRoute';
import { UpdateContractRoute } from './contracts/UpdateContractRoute';
import { DeleteContractRoute } from './contracts/DeleteContractRoute';

import { GetSettingsRoute } from './settings/GetSettingsRoute';
import { SetSettingsRoute } from './settings/SetSettingsRoute';

export class Router {
    public static init(server: Server, injector: ReflectiveInjector) {
        server.route(this.resolveRoute(injector, GetAllDevelopersRoute));
        server.route(this.resolveRoute(injector, GetDeveloperByIdRoute));
        server.route(this.resolveRoute(injector, CreateDeveloperRoute));
        server.route(this.resolveRoute(injector, UpdateDeveloperRoute));
        server.route(this.resolveRoute(injector, DeleteDeveloperRoute));

        server.route(this.resolveRoute(injector, GetAllContractsByYearRoute));
        server.route(this.resolveRoute(injector, GetContractByIdRoute));
        server.route(this.resolveRoute(injector, CreateContractRoute));
        server.route(this.resolveRoute(injector, UpdateContractRoute));
        server.route(this.resolveRoute(injector, DeleteContractRoute));

        server.route(this.resolveRoute(injector, GetSettingsRoute));
        server.route(this.resolveRoute(injector, SetSettingsRoute));
    }

    private static resolveRoute(injector: ReflectiveInjector, token: Provider) {
        const route = injector.resolveAndInstantiate(token);
        const { method, path, config, handler } = route;
        return { method, path, config, handler: handler.bind(route) };
    }
}
