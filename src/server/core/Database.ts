import { Statement } from './Statement';

export interface Database {
	all<T>(sql: string): Promise<T[]>;
	all<T>(sql: string, ...params: any[]): Promise<T[]>;

	get<T>(sql: string): Promise<T>;
	get<T>(sql: string, ...params: any[]): Promise<T>;

	run(sql: string): Promise<Statement>;
	run(sql: string, ...params: any[]): Promise<Statement>;

	exec(sql: string): Promise<Database>;

	migrate(options: {
		force?: string;
		table?: string;
		migrationsPath?: string;
	}): Promise<Database>;
}

export const open: (
	filename: string,
	options?: {
		mode?: number;
		verbose?: boolean;
		promise?: typeof Promise;
	}
) => Promise<Database> = require('sqlite').open;
