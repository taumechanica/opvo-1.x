import { number, string } from 'joi';

export class CreateDeveloperSchema {
    public payload = {
        Name: string().required().min(4).max(128),
        CeilingAmount: number().required().min(0)
    };
}
