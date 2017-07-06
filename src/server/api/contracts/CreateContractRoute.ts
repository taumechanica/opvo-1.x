import { Inject, Injectable } from 'injection-js';
import { number } from 'joi';

import { HttpMethod, ReplyFn, Request, Route } from '../Interface';
import { SqlException } from '../../data/abstract/SqlException';
import { DevelopersGateway } from '../../data/DevelopersGateway';
import { ContractsGateway } from '../../data/ContractsGateway';
import { Contract } from '../../domain/Contract';

@Injectable()
export class CreateContractRoute implements Route {
    public method: HttpMethod;
    public path: string;

    public constructor(
        @Inject(DevelopersGateway) private developersGateway: DevelopersGateway,
        @Inject(ContractsGateway) private contractsGateway: ContractsGateway
    ) {
        this.method = 'POST';
        this.path = '/rest/developers/{DeveloperId}/contracts';
    }

    public config = {
        validate: {
            params: {
                DeveloperId: number().required().integer().min(1)
            },
            payload: {
                Amount: number().required().min(0),
                StartDate: number().required().integer().min(0),
                Deadline: number().required().integer().min(0),
                AcceptanceDate: number().optional().integer().min(0)
            }
        }
    };

    public async handler(request: Request, reply: ReplyFn) {
        const developerId = parseInt(request.params.DeveloperId);
        const developer = await this.developersGateway.getById(developerId);

        if (!developer) return reply('').code(404);

        const contract = request.payload as Contract;
        const [record, ex] = await this.contractsGateway.create(developer, contract);

        if (ex) return reply('').code(ex === SqlException.Constraint ? 404 : 500);

        return reply(`/rest/developers/${developerId}/contracts/${record.Id}`).code(201);
    }
}
