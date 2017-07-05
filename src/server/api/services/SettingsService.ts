import { Base_Reply, Request } from 'hapi';

import { SqlDatabase } from '../../data/abstract/SqlDatabase';
import { Settings } from '../../domain/Settings';

export class SettingsService {
    public constructor(private db: SqlDatabase) { }

    public async get(request: Request, reply: Base_Reply) {
        const { db } = this;
        let settings = await db.get<Settings>('SELECT * FROM Settings');

        if (!settings) {
            const year = new Date().getFullYear();
            settings = {
                Language: 'ru',
                YearFrom: year,
                YearTo: year
            };
            await db.run(
                'INSERT INTO Settings (Language, YearFrom, YearTo) VALUES (?, ?, ?)',
                settings.Language, settings.YearFrom, settings.YearTo
            );
        }

        return reply(settings);
    }

    public async set(request: Request, reply: Base_Reply) {
        const { db } = this;
        const { Language, YearFrom, YearTo } = request.payload;
        await db.run(
            'UPDATE Settings SET Language = ?, YearFrom = ?, YearTo = ?',
            Language, YearFrom, YearTo
        );

        const changes = await db.get<{ Count: number; }>('SELECT changes() AS Count FROM Settings');

        return reply('').code(!changes || changes.Count ? 204 : 404);
    }
}
