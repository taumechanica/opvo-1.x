export abstract class SqlDatabase {
    abstract all<T>(sql: string, ...params: any[]): Promise<T[]>;
    abstract get<T>(sql: string, ...params: any[]): Promise<T>;
    abstract run(sql: string, ...params: any[]): Promise<any>;
}
