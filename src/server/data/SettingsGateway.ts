import { Inject, Injectable } from 'injection-js';

import { SqlDatabase } from './SqlDatabase';
import { Settings } from '../domain/Settings';

@Injectable()
export class SettingsGateway {
    public constructor(@Inject(SqlDatabase) private db: SqlDatabase) { }

    public async get() {
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

        return settings;
    }

    public async set(settings: Settings) {
        const { db } = this;
        const { Language, YearFrom, YearTo } = settings;
        await db.run(
            'UPDATE Settings SET Language = ?, YearFrom = ?, YearTo = ?',
            Language, YearFrom, YearTo
        );

        return await db.get<{ Count: number; }>('SELECT changes() AS Count FROM Settings');
    }
}
