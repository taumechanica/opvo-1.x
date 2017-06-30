import * as inert from 'inert';
import { Server } from 'hapi';
import { Database } from 'sqlite';
import { open } from 'sqlite';

import { Dispatcher } from './api/Dispatcher';

const assets: {
    [index: string]: string;
} = {
    'css': '',
    'i18n': 'i18n/',
    'img': 'images/',
    'scr': '',
    'tpl': 'modules/'
};

const start = (db: Database) => {
    const server = new Server();

    server.connection({
        host: 'localhost',
        port: 8000
    });

    server.register(inert);

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

    Dispatcher.registerRoutes(server, db);

    server.start(error => {
        if (error) throw error;

        console.log(`Server running at ${server.info.uri}`);
    });
};

open(`${__dirname}/opvo.sqlite`)
    .then(db => db.migrate({
        force: 'last',
        migrationsPath: `${__dirname}/migrations`
    }))
    .then(db => db.exec('PRAGMA foreign_keys = ON'))
    .then(db => start(db))
    .catch(reason => console.error(reason));
