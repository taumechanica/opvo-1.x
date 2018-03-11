import 'reflect-metadata';

import * as inert from 'inert';
import { Server } from 'hapi';
import { open } from 'sqlite';
import { ReflectiveInjector } from 'injection-js';

import { Router } from './api/Router';
import { SqlDatabase } from './data/abstract/SqlDatabase';

import { DevelopersGateway } from './data/DevelopersGateway';
import { ContractsGateway } from './data/ContractsGateway';
import { SettingsGateway } from './data/SettingsGateway';

const assets: {
    [index: string]: string;
} = {
    'css': '',
    'i18n': 'i18n/',
    'img': 'images/',
    'scr': '',
    'tpl': 'modules/'
};

(async function () {
    try {
        const db = await open(`${__dirname}/opvo.sqlite`);

        db.migrate({
            force: 'last',
            migrationsPath: `${__dirname}/migrations`
        });
        db.exec('PRAGMA foreign_keys = ON');

        const server = new Server({
            host: 'localhost',
            port: 8000
        });

        await server.register(inert);

        server.route({
            method: 'GET',
            path: '/',
            handler: (request, reply) => {
                return reply.file(`${__dirname}/../client/application.html`);
            }
        });

        server.route({
            method: 'GET',
            path: '/{AssetType}/{File*}',
            handler: (request, reply) => {
                const directory = assets[request.params['AssetType']];
                return reply.file(`${__dirname}/../client/${directory}${request.params['File']}`);
            }
        });

        const injector = ReflectiveInjector.resolveAndCreate([
            { provide: SqlDatabase, useValue: db },
            DevelopersGateway,
            ContractsGateway,
            SettingsGateway
        ]);
        Router.init(server, injector);

        server.start();

        console.info(`Server running at ${server.info.uri}`);
    } catch (ex) {
        console.error(ex);
    }
})();
