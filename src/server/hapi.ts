import * as hapi from 'hapi';

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
		return reply.file(`${__dirname}/index.html`);
	}
});

server.route({
	method: 'GET',
	path: '/hi/there',
	handler: (request, reply) => {
		return reply(`Hi there! Now is ${new Date()}`);
	}
});

server.start(error => {
	if (error) throw error;

	console.log(`Server running at ${server.info.uri}`);
});
