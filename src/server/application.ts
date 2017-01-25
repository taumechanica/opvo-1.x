import * as hapi from 'hapi';
import * as inert from 'inert';
import * as joi from 'joi';
import * as sqlite from 'sqlite';

const start = (db: any) => {
	const server = new hapi.Server();

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
		path: '/img/{file*}',
		handler: {
			directory: {
				path: `${__dirname}/../client/assets`
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

	server.route({
		method: 'GET',
		path: '/rest/developers',
		handler: (request, reply) => db
			.all('SELECT * FROM Developer')
			.then((developers: any) => reply(developers))
	});

	server.route({
		method: 'POST',
		path: '/rest/developers',
		handler: (request, reply) => {
			db.run(
				'INSERT INTO Developer (Name, CeilingAmount) VALUES (?, ?)',
				request.payload.Name, request.payload.CeilingAmount
			).then(() => db
				.get('SELECT last_insert_rowid() AS Id')
				.then((developer: any) => reply(`/rest/developers/${developer.Id}`).code(201))
			);
		},
		config: {
			validate: {
				payload: {
					Name: joi.string().required().min(4).max(128),
					CeilingAmount: joi.number().required().min(0)
				}
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/rest/developers/{DeveloperId}',
		handler: (request, reply) => db
			.get('SELECT * FROM Developer WHERE Id = ?', request.params['DeveloperId'])
			.then((developer: any) => reply(developer).code(developer ? 200 : 404)),
		config: {
			validate: {
				params: {
					DeveloperId: joi.number().integer().min(1)
				}
			}
		}
	});

	server.route({
		method: 'DELETE',
		path: '/rest/developers/{DeveloperId}',
		handler: (request, reply) => db
			.run('DELETE FROM Developer WHERE Id = ?', request.params['DeveloperId'])
			.then(() => db
				.get('SELECT changes() AS Count FROM Developer')
				.then((changes: any) => {
					return reply('').code(!changes || changes.Count ? 204 : 404);
				})
			),
		config: {
			validate: {
				params: {
					DeveloperId: joi.number().integer().min(1)
				}
			}
		}
	});

	server.route({
		method: 'PUT',
		path: '/rest/developers/{DeveloperId}',
		handler: (request, reply) => db
			.run(
				'UPDATE Developer SET Name = ?, CeilingAmount = ? WHERE Id = ?',
				request.payload.Name, request.payload.CeilingAmount, request.params['DeveloperId']
			)
			.then(() => db
				.get('SELECT changes() AS Count FROM Developer')
				.then((changes: any) => {
					return reply('').code(!changes || changes.Count ? 204 : 404);
				})
			),
		config: {
			validate: {
				params: {
					DeveloperId: joi.number().integer().min(1)
				},
				payload: {
					Id: joi.number().required().integer().min(1),
					Name: joi.string().required().min(4).max(128),
					CeilingAmount: joi.number().required().min(0)
				}
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/rest/developers/{DeveloperId}/contracts',
		handler: (request, reply) => Promise.all([
			db.get('SELECT * FROM Developer WHERE Id = ?', request.params['DeveloperId']),
			db.all('SELECT * FROM Contract WHERE DeveloperId = ?', request.params['DeveloperId'])
		]).then(results => results[0] ? reply(results[1]) : reply('').code(404)),
		config: {
			validate: {
				params: {
					DeveloperId: joi.number().integer().min(1)
				}
			}
		}
	});

	server.route({
		method: 'POST',
		path: '/rest/developers/{DeveloperId}/contracts',
		handler: (request, reply) => {
			db.run(
				'INSERT INTO Contract (DeveloperId, Amount, StartDate, Deadline, AcceptanceDate) VALUES (?, ?, ?, ?, ?)',
				request.params['DeveloperId'], request.payload.Amount, request.payload.StartDate,
				request.payload.Deadline, request.payload.AcceptanceDate
			).then(() => db
				.get('SELECT last_insert_rowid() AS Id')
				.then((contract: any) => reply(`/rest/developers/${request.params['DeveloperId']}/contracts/${contract.Id}`).code(201))
			).catch((reason: any) => reply('').code(reason.code === 'SQLITE_CONSTRAINT' ? 404 : 500));
		},
		config: {
			validate: {
				params: {
					DeveloperId: joi.number().integer().min(1)
				},
				payload: {
					Amount: joi.number().required().min(0),
					StartDate: joi.number().required().integer().min(0),
					Deadline: joi.number().required().integer().min(0),
					AcceptanceDate: joi.number().optional().integer().min(0)
				}
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/rest/developers/{DeveloperId}/contracts/{ContractId}',
		handler: (request, reply) => db
			.get(
				'SELECT * FROM Contract WHERE Id = ? AND DeveloperId = ?',
				request.params['ContractId'], request.params['DeveloperId']
			).then((contract: any) => reply(contract).code(contract ? 200 : 404)),
		config: {
			validate: {
				params: {
					DeveloperId: joi.number().integer().min(1),
					ContractId: joi.number().integer().min(1)
				}
			}
		}
	});

	server.route({
		method: 'DELETE',
		path: '/rest/developers/{DeveloperId}/contracts/{ContractId}',
		handler: (request, reply) => db
			.run(
				'DELETE FROM Contract WHERE Id = ? AND DeveloperId = ?',
				request.params['ContractId'], request.params['DeveloperId']
			)
			.then(() => db
				.get('SELECT changes() AS Count FROM Contract')
				.then((changes: any) => {
					return reply('').code(!changes || changes.Count ? 204 : 404);
				})
			),
		config: {
			validate: {
				params: {
					DeveloperId: joi.number().integer().min(1),
					ContractId: joi.number().integer().min(1)
				}
			}
		}
	});

	server.route({
		method: 'PUT',
		path: '/rest/developers/{DeveloperId}/contracts/{ContractId}',
		handler: (request, reply) => db
			.run(
				'UPDATE Contract SET Amount = ?, StartDate = ?, Deadline = ?, AcceptanceDate = ? WHERE Id = ? AND DeveloperId = ?',
				request.payload.Amount, request.payload.StartDate, request.payload.Deadline,
				request.payload.AcceptanceDate, request.params['ContractId'], request.params['DeveloperId']
			)
			.then(() => db
				.get('SELECT changes() AS Count FROM Contract')
				.then((changes: any) => {
					return reply('').code(!changes || changes.Count ? 204 : 404);
				})
			),
		config: {
			validate: {
				params: {
					DeveloperId: joi.number().integer().min(1),
					ContractId: joi.number().integer().min(1)
				},
				payload: {
					Amount: joi.number().required().min(0),
					StartDate: joi.number().required().integer().min(0),
					Deadline: joi.number().required().integer().min(0),
					AcceptanceDate: joi.number().optional().integer().min(0)
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
	.then(db => db.exec('PRAGMA foreign_keys = ON'))
	.then(db => start(db))
	.catch(reason => console.error(reason));
