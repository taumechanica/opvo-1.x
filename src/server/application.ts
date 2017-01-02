import * as hapi from 'hapi';
import * as joi from 'joi';
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
		path: '/rest/developers',
		handler: (request, reply) => db
			.all('SELECT * FROM developer')
			.then((developers: any) => reply(developers))
	});

	server.route({
		method: 'POST',
		path: '/rest/developers',
		handler: (request, reply) => {
			db.run(
				'INSERT INTO developer(name, ceiling_amount) VALUES(?, ?)',
				request.payload.name, request.payload.ceiling_amount
			).then(() => db
				.get('SELECT last_insert_rowid() AS id')
				.then((developer: any) => reply(`/rest/developers/${developer.id}`).code(201))
			);
		},
		config: {
			validate: {
				payload: {
					name: joi.string().required().min(4).max(128),
					ceiling_amount: joi.number().required().min(0)
				}
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/rest/developers/{id}',
		handler: (request, reply) => db
			.get('SELECT * FROM developer WHERE id = ?', request.params['id'])
			.then((developer: any) => reply(developer).code(developer ? 200 : 404)),
		config: {
			validate: {
				params: {
					id: joi.number().min(1)
				}
			}
		}
	});

	server.route({
		method: 'DELETE',
		path: '/rest/developers/{id}',
		handler: (request, reply) => db
			.run('DELETE FROM developer WHERE id = ?', request.params['id'])
			.then(() => db
				.get('SELECT changes() AS count FROM developer')
				.then((changes: any) => {
					return reply('').code(changes.count ? 204 : 404);
				})
			),
		config: {
			validate: {
				params: {
					id: joi.number().min(1)
				}
			}
		}
	});

	server.route({
		method: 'PUT',
		path: '/rest/developers/{id}',
		handler: (request, reply) => db
			.run(
				'UPDATE developer SET name = ?, ceiling_amount = ? WHERE id = ?',
				request.payload.name, request.payload.ceiling_amount, request.params['id']
			)
			.then(() => db
				.get('SELECT changes() AS count FROM developer')
				.then((changes: any) => {
					return reply('').code(changes.count ? 204 : 404);
				})
			),
		config: {
			validate: {
				params: {
					id: joi.number().min(1)
				},
				payload: {
					name: joi.string().required().min(4).max(128),
					ceiling_amount: joi.number().required().min(0)
				}
			}
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
	.then(db => {
		db.exec('PRAGMA foreign_keys = ON');
		start(db);
	})
	.catch(reason => console.error(reason));
