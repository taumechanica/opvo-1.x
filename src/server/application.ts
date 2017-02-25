import * as inert from 'inert';
import { Server } from 'hapi';
import { number, string } from 'joi';
import { open } from 'sqlite';

const start = (db: any) => {
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

	server.route({
		method: 'GET',
		path: '/rest/developers',
		handler: async (request, reply) => {
			const developers = await db.all('SELECT * FROM Developer');
			return reply(developers);
		}
	});

	server.route({
		method: 'POST',
		path: '/rest/developers',
		handler: async (request, reply) => {
			await db.run(
				'INSERT INTO Developer (Name, CeilingAmount) VALUES (?, ?)',
				request.payload.Name, request.payload.CeilingAmount
			);
			const developer = await db.get('SELECT last_insert_rowid() AS Id');
			return reply(`/rest/developers/${developer.Id}`).code(201);
		},
		config: {
			validate: {
				payload: {
					Name: string().required().min(4).max(128),
					CeilingAmount: number().required().min(0)
				}
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/rest/developers/{DeveloperId}',
		handler: async (request, reply) => {
			const developer = await db.get(
				'SELECT * FROM Developer WHERE Id = ?',
				request.params['DeveloperId']
			);
			return reply(developer).code(developer ? 200 : 404);
		},
		config: {
			validate: {
				params: {
					DeveloperId: number().integer().min(1)
				}
			}
		}
	});

	server.route({
		method: 'DELETE',
		path: '/rest/developers/{DeveloperId}',
		handler: async (request, reply) => {
			await db.run(
				'DELETE FROM Developer WHERE Id = ?',
				request.params['DeveloperId']
			);
			const changes = await db.get('SELECT changes() AS Count FROM Developer');
			return reply('').code(!changes || changes.Count ? 204 : 404);
		},
		config: {
			validate: {
				params: {
					DeveloperId: number().integer().min(1)
				}
			}
		}
	});

	server.route({
		method: 'PUT',
		path: '/rest/developers/{DeveloperId}',
		handler: async (request, reply) => {
			await db.run(
				'UPDATE Developer SET Name = ?, CeilingAmount = ? WHERE Id = ?',
				request.payload.Name, request.payload.CeilingAmount, request.params['DeveloperId']
			);
			const changes = await db.get('SELECT changes() AS Count FROM Developer');
			return reply('').code(!changes || changes.Count ? 204 : 404);
		},
		config: {
			validate: {
				params: {
					DeveloperId: number().integer().min(1)
				},
				payload: {
					Id: number().required().integer().min(1),
					Name: string().required().min(4).max(128),
					CeilingAmount: number().required().min(0)
				}
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/rest/developers/{DeveloperId}/contracts-{Year}',
		handler: async (request, reply) => {
			const [developer, contracts] = await Promise.all([
				db.get('SELECT * FROM Developer WHERE Id = ?', request.params['DeveloperId']),
				db.all(
					'SELECT * FROM Contract WHERE DeveloperId = ? AND StartDate BETWEEN ? AND ? ORDER BY StartDate',
					request.params['DeveloperId'],
					new Date(parseInt(request.params['Year']), 0, 1, 12, 0, 0, 0),
					new Date(parseInt(request.params['Year']), 11, 31, 12, 0, 0, 0)
				)
			]);
			return developer ? reply(contracts) : reply('').code(404);
		},
		config: {
			validate: {
				params: {
					DeveloperId: number().integer().min(1),
					Year: number().integer().min(2010).max(2030)
				}
			}
		}
	});

	server.route({
		method: 'POST',
		path: '/rest/developers/{DeveloperId}/contracts',
		handler: async (request, reply) => {
			try {
				await db.run(
					'INSERT INTO Contract (DeveloperId, Amount, StartDate, Deadline, AcceptanceDate) VALUES (?, ?, ?, ?, ?)',
					request.params['DeveloperId'], request.payload.Amount, request.payload.StartDate,
					request.payload.Deadline, request.payload.AcceptanceDate
				);
				const contract = await db.get('SELECT last_insert_rowid() AS Id');
				return reply(`/rest/developers/${request.params['DeveloperId']}/contracts/${contract.Id}`).code(201);
			} catch (reason) {
				return reply('').code(reason.code === 'SQLITE_CONSTRAINT' ? 404 : 500);
			}
		},
		config: {
			validate: {
				params: {
					DeveloperId: number().integer().min(1)
				},
				payload: {
					Amount: number().required().min(0),
					StartDate: number().required().integer().min(0),
					Deadline: number().required().integer().min(0),
					AcceptanceDate: number().optional().integer().min(0)
				}
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/rest/developers/{DeveloperId}/contracts/{ContractId}',
		handler: async (request, reply) => {
			const contract = await db.get(
				'SELECT * FROM Contract WHERE Id = ? AND DeveloperId = ?',
				request.params['ContractId'], request.params['DeveloperId']
			);
			return reply(contract).code(contract ? 200 : 404);
		},
		config: {
			validate: {
				params: {
					DeveloperId: number().integer().min(1),
					ContractId: number().integer().min(1)
				}
			}
		}
	});

	server.route({
		method: 'DELETE',
		path: '/rest/developers/{DeveloperId}/contracts/{ContractId}',
		handler: async (request, reply) => {
			await db.run(
				'DELETE FROM Contract WHERE Id = ? AND DeveloperId = ?',
				request.params['ContractId'], request.params['DeveloperId']
			);
			const changes = await db.get('SELECT changes() AS Count FROM Contract');
			return reply('').code(!changes || changes.Count ? 204 : 404);
		},
		config: {
			validate: {
				params: {
					DeveloperId: number().integer().min(1),
					ContractId: number().integer().min(1)
				}
			}
		}
	});

	server.route({
		method: 'PUT',
		path: '/rest/developers/{DeveloperId}/contracts/{ContractId}',
		handler: async (request, reply) => {
			await db.run(
				'UPDATE Contract SET Amount = ?, StartDate = ?, Deadline = ?, AcceptanceDate = ? WHERE Id = ? AND DeveloperId = ?',
				request.payload.Amount, request.payload.StartDate, request.payload.Deadline,
				request.payload.AcceptanceDate, request.params['ContractId'], request.params['DeveloperId']
			);
			const changes = await db.get('SELECT changes() AS Count FROM Contract');
			return reply('').code(!changes || changes.Count ? 204 : 404);
		},
		config: {
			validate: {
				params: {
					DeveloperId: number().integer().min(1),
					ContractId: number().integer().min(1)
				},
				payload: {
					Id: number().required().integer().min(1),
					DeveloperId: number().required().integer().min(1),
					Amount: number().required().min(0),
					StartDate: number().required().integer().min(0),
					Deadline: number().required().integer().min(0),
					AcceptanceDate: number().optional().integer().min(0)
				}
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/rest/settings',
		handler: async (request, reply) => {
			let settings = await db.get('SELECT * FROM Settings');
			if (!settings) {
				const year = new Date().getFullYear();
				settings = {
					Language: 'ru',
					YearFrom: year,
					YearTo: year
				};
				await db.run(`
					INSERT INTO Settings (Language, YearFrom, YearTo)
					VALUES ('${settings.Language}', ${settings.YearFrom}, ${settings.YearTo})
				`);
			}
			return reply(settings);
		}
	});

	server.route({
		method: 'PUT',
		path: '/rest/settings',
		handler: async (request, reply) => {
			await db.run(
				'UPDATE Settings SET Language = ?, YearFrom = ?, YearTo = ?',
				request.payload.Language, request.payload.YearFrom, request.payload.YearTo
			);
			const changes = await db.get('SELECT changes() AS Count FROM Settings');
			return reply('').code(!changes || changes.Count ? 204 : 404);
		},
		config: {
			validate: {
				payload: {
					Language: string().required().min(2).max(5),
					YearFrom: number().required().min(2010).max(2030),
					YearTo: number().required().min(2010).max(2030)
				}
			}
		}
	});

	server.start(error => {
		if (error) throw error;

		console.log(`Server running at ${server.info.uri}`);
	});
};

open(`${__dirname}/opvo.sqlite`)
	.then(db => (<(options: any) => Promise<any>>db.migrate)({
		force: 'last',
		migrationsPath: `${__dirname}/migrations`
	}))
	.then(db => db.exec('PRAGMA foreign_keys = ON'))
	.then(db => start(db))
	.catch(reason => console.error(reason));
