import { Inject, Injectable } from 'injection-js';

import { SqlDatabase } from './abstract/SqlDatabase';
import { Developer } from '../domain/Developer';
import { Record } from '../domain/Record';

@Injectable()
export class DevelopersGateway {
    public constructor(@Inject(SqlDatabase) private db: SqlDatabase) { }

    public async getAll() {
        return await this.db.all<Developer>('SELECT * FROM Developer');
    }

    public async getById(id: number) {
        return await this.db.get<Developer>('SELECT * FROM Developer WHERE Id = ?', id);
    }

    public async create(developer: Developer) {
        const { db } = this;
        const { Name, CeilingAmount } = developer;
        await db.run('INSERT INTO Developer (Name, CeilingAmount) VALUES (?, ?)', Name, CeilingAmount);

        return await db.get<Record>('SELECT last_insert_rowid() AS Id');
    }

    public async update(developer: Developer) {
        const { db } = this;
        const { Id, Name, CeilingAmount } = developer;
        await db.run('UPDATE Developer SET Name = ?, CeilingAmount = ? WHERE Id = ?', Name, CeilingAmount, Id);

        return await db.get<{ Count: number; }>('SELECT changes() AS Count FROM Developer');
    }

    public async delete(id: number) {
        const { db } = this;
        await db.run('DELETE FROM Developer WHERE Id = ?', id);

        return await db.get<{ Count: number; }>('SELECT changes() AS Count FROM Developer');
    }
}
