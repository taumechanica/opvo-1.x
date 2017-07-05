import { Base_Reply, Request } from 'hapi';

import { SqlDatabase } from '../../data/SqlDatabase';
import { Contract } from '../../domain/Contract';
import { Developer } from '../../domain/Developer';
import { Record } from '../../domain/Record';

export class ContractsService {
    public constructor(private db: SqlDatabase) { }

    public async getAllByYear(request: Request, reply: Base_Reply) {
        const { db } = this;
        const developerId = request.params['DeveloperId'];
        const year = parseInt(request.params['Year'], 10);
        const [developer, contracts] = await Promise.all([
            db.get<Developer>('SELECT * FROM Developer WHERE Id = ?', developerId),
            db.all<Contract>(
                'SELECT * FROM Contract WHERE DeveloperId = ? AND StartDate BETWEEN ? AND ? ORDER BY StartDate',
                developerId,
                new Date(year, 0, 1, 12, 0, 0, 0),
                new Date(year, 11, 31, 12, 0, 0, 0)
            )
        ]);

        return developer ? reply(contracts).code(200) : reply('').code(404);
    }

    public async getById(request: Request, reply: Base_Reply) {
        const contract = await this.db.get<Contract>(
            'SELECT * FROM Contract WHERE Id = ? AND DeveloperId = ?',
            request.params['ContractId'], request.params['DeveloperId']
        );

        return reply(contract).code(contract ? 200 : 404);
    }

    public async create(request: Request, reply: Base_Reply) {
        const { db } = this;
        const developerId = request.params['DeveloperId'];
        const { Amount, StartDate, Deadline, AcceptanceDate } = request.payload;
        try {
            await db.run(
                'INSERT INTO Contract (DeveloperId, Amount, StartDate, Deadline, AcceptanceDate) VALUES (?, ?, ?, ?, ?)',
                developerId, Amount, StartDate, Deadline, AcceptanceDate
            );

            const record = await db.get<Record>('SELECT last_insert_rowid() AS Id');

            return reply(`/rest/developers/${developerId}/contracts/${record.Id}`).code(201);
        } catch (reason) {
            return reply('').code(reason.code === 'SQLITE_CONSTRAINT' ? 404 : 500);
        }
    }

    public async update(request: Request, reply: Base_Reply) {
        const { db } = this;
        const { Id, DeveloperId } = request.payload;
        if (request.params['ContractId'] != Id ||
            request.params['DeveloperId'] != DeveloperId
        ) return reply('').code(400);

        const { Amount, StartDate, Deadline, AcceptanceDate } = request.payload;
        await db.run(
            'UPDATE Contract SET Amount = ?, StartDate = ?, Deadline = ?, AcceptanceDate = ? WHERE Id = ? AND DeveloperId = ?',
            Amount, StartDate, Deadline, AcceptanceDate, Id, DeveloperId
        );

        const changes = await db.get<{ Count: number; }>('SELECT changes() AS Count FROM Contract');

        return reply('').code(!changes || changes.Count ? 204 : 404);
    }

    public async delete(request: Request, reply: Base_Reply) {
        const { db } = this;
        await db.run(
            'DELETE FROM Contract WHERE Id = ? AND DeveloperId = ?',
            request.params['ContractId'], request.params['DeveloperId']
        );

        const changes = await db.get<{ Count: number; }>('SELECT changes() AS Count FROM Contract');

        return reply('').code(!changes || changes.Count ? 204 : 404);
    }
}
