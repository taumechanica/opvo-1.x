import { number } from 'joi';

export class DeleteDeveloperSchema {
    public params = {
        DeveloperId: number().required().integer().min(1)
    };
}
