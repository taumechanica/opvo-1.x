import { IReply, Request } from 'hapi';
import { Database } from 'sqlite';

import { Developer } from '../../domain/Developer';
import { Record } from '../../domain/Record';

export class DevelopersService {
	public constructor(private db: Database) { }

	public async getAll(request: Request, reply: IReply) {
		const developers = await this.db.all<Developer>('SELECT * FROM Developer');

		return reply(developers);
	}

	public async getById(request: Request, reply: IReply) {
		const developer = await this.db.get<Developer>(
			'SELECT * FROM Developer WHERE Id = ?',
			request.params['DeveloperId']
		);

		return reply(developer).code(developer ? 200 : 404);
	}

	public async create(request: Request, reply: IReply) {
		const { db } = this;
		const { Name, CeilingAmount } = request.payload;
		await db.run('INSERT INTO Developer (Name, CeilingAmount) VALUES (?, ?)', Name, CeilingAmount);

		const record = await db.get<Record>('SELECT last_insert_rowid() AS Id');

		return reply(`/rest/developers/${record.Id}`).code(201);
	}

	public async update(request: Request, reply: IReply) {
		const { db } = this;
		const { Id } = request.payload;
		if (request.params['DeveloperId'] != Id) return reply('').code(400);

		const { Name, CeilingAmount } = request.payload;
		await db.run('UPDATE Developer SET Name = ?, CeilingAmount = ? WHERE Id = ?', Name, CeilingAmount, Id);

		const changes = await db.get<{ Count: number; }>('SELECT changes() AS Count FROM Developer');

		return reply('').code(!changes || changes.Count ? 204 : 404);
	}

	public async delete(request: Request, reply: IReply) {
		const { db } = this;
		await db.run('DELETE FROM Developer WHERE Id = ?', request.params['DeveloperId']);

		const changes = await db.get<{ Count: number; }>('SELECT changes() AS Count FROM Developer');

		return reply('').code(!changes || changes.Count ? 204 : 404);
	}
}
