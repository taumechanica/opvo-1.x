import { number, string } from 'joi';

export class UpdateDeveloperSchema {
    public params = {
        DeveloperId: number().required().integer().min(1)
    };

    public payload = {
        Id: number().required().integer().min(1),
        Name: string().required().min(4).max(128),
        CeilingAmount: number().required().min(0)
    };
}
