import * as hapi from 'hapi';
import * as sqlite from 'sqlite';

const start = (db: any) => {
	const server = new hapi.Server();

	server.connection({
		host: 'localhost',
		port: 9000
	});

	server.register(require('inert'));

	server.route({
		method: 'GET',
		path: '/',
		handler: (request, reply) => {
			return reply.file(`${__dirname}/../client/application.html`);
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
		path: '/hi/there',
		handler: (request, reply) => {
			return reply(`Hi there! Now is ${new Date()}`);
		}
	});

	server.route({
		method: 'GET',
		path: '/sqlite',
		handler: (request, reply) => {
			db.all('SELECT ROWID as id, * FROM Something')
				.then((smth: any) => reply(smth));
		}
	});

	server.start(error => {
		if (error) throw error;

		console.log(`Server running at ${server.info.uri}`);
	});
};

sqlite.open(`${__dirname}/opvo.sqlite`)
	.then(db => (<(options: any) => Promise<any>>db.migrate)({
		force: 'last',
		migrationsPath: `${__dirname}/migrations`
	}))
	.then(db => start(db))
	.catch(reason => console.error(reason));
