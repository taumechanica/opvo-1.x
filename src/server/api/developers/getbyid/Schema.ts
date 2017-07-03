import { number } from 'joi';

export class GetDeveloperByIdSchema {
    public params = {
        DeveloperId: number().required().integer().min(1)
    };
}
