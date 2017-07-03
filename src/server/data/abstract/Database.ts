export interface Statement { }

export interface Database {
    all<T>(sql: string): Promise<T[]>;
    get<T>(sql: string, ...params: any[]): Promise<T>;
    run(sql: string, ...params: any[]): Promise<Statement>;
}
