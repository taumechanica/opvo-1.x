import * as inert from 'inert';
import { Server } from 'hapi';

import { Database } from './core/Database';
import { open } from './core/Database';

import { Dispatcher } from './api/Dispatcher';

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
		path: '/css/{file*}',
		handler: {
			directory: {
				path: `${__dirname}/../client`
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/i18n/{file*}',
		handler: {
			directory: {
				path: `${__dirname}/../client/i18n`
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/img/{file*}',
		handler: {
			directory: {
				path: `${__dirname}/../client/images`
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/scr/{file*}',
		handler: {
			directory: {
				path: `${__dirname}/../client`
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/tpl/{file*}',
		handler: {
			directory: {
				path: `${__dirname}/../client/modules`
			}
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
