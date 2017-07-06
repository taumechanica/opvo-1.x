import { Inject, Injectable } from 'injection-js';

import { SqlDatabase } from './abstract/SqlDatabase';
import { SqlException } from './abstract/SqlException';
import { Contract } from '../domain/Contract';
import { Developer } from '../domain/Developer';
import { Record } from '../domain/Record';

@Injectable()
export class ContractsGateway {
    public constructor(@Inject(SqlDatabase) private db: SqlDatabase) { }

    public async getAllByYear(developer: Developer, year: number) {
        return await this.db.all<Contract>(
            'SELECT * FROM Contract WHERE DeveloperId = ? AND StartDate BETWEEN ? AND ? ORDER BY StartDate',
            developer.Id,
            new Date(year, 0, 1, 12, 0, 0, 0),
            new Date(year, 11, 31, 12, 0, 0, 0)
        );
    }

    public async getById(developer: Developer, id: number) {
        return await this.db.get<Contract>(
            'SELECT * FROM Contract WHERE Id = ? AND DeveloperId = ?', id, developer.Id
        );
    }

    public async create(developer: Developer, contract: Contract): Promise<[Record, SqlException]> {
        const { db } = this;
        const { Amount, StartDate, Deadline, AcceptanceDate } = contract;
        try {
            await db.run(
                'INSERT INTO Contract (DeveloperId, Amount, StartDate, Deadline, AcceptanceDate) VALUES (?, ?, ?, ?, ?)',
                developer.Id, Amount, StartDate, Deadline, AcceptanceDate
            );

            const record = await db.get<Record>('SELECT last_insert_rowid() AS Id');

            return [record, null];
        } catch (ex) {
            let exception: SqlException = SqlException.Unknown;
            if (ex.code === 'SQLITE_CONSTRAINT') exception = SqlException.Constraint;
            return [null, exception];
        }
    }

    public async update(developer: Developer, contract: Contract) {
        const { Id, Amount, StartDate, Deadline, AcceptanceDate } = contract;
        return await this.db.run(
            'UPDATE Contract SET Amount = ?, StartDate = ?, Deadline = ?, AcceptanceDate = ? WHERE Id = ? AND DeveloperId = ?',
            Amount, StartDate, Deadline, AcceptanceDate, Id, developer.Id
        );
    }

    public async delete(developer: Developer, contract: Contract) {
        return await this.db.run('DELETE FROM Contract WHERE Id = ? AND DeveloperId = ?', contract.Id, developer.Id);
    }
}
