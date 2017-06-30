import { Database } from 'sqlite';

import { Developer } from '../domain/Developer';

export class DevelopersGateway {
    public constructor(private db: Database) { }

    public async getAll() {
        return await this.db.all<Developer>('SELECT * FROM Developer');
    }
}
