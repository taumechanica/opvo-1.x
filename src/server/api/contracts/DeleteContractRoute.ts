import { Inject, Injectable } from 'injection-js';
import { number } from 'joi';

import { HttpMethod, ReplyFn, Request, Route } from '../Interface';
import { DevelopersGateway } from '../../data/DevelopersGateway';
import { ContractsGateway } from '../../data/ContractsGateway';

@Injectable()
export class DeleteContractRoute implements Route {
    public method: HttpMethod;
    public path: string;

    public constructor(
        @Inject(DevelopersGateway) private developersGateway: DevelopersGateway,
        @Inject(ContractsGateway) private contractsGateway: ContractsGateway
    ) {
        this.method = 'DELETE';
        this.path = '/rest/developers/{DeveloperId}/contracts/{ContractId}';
    }

    public config = {
        validate: {
            params: {
                DeveloperId: number().required().integer().min(1),
                ContractId: number().required().integer().min(1)
            }
        }
    };

    public async handler(request: Request, reply: ReplyFn) {
        const developerId = parseInt(request.params.DeveloperId);
        const developer = await this.developersGateway.getById(developerId);

        if (!developer) return reply('').code(404);

        const contractId = parseInt(request.params.ContractId);
        const changes = await this.contractsGateway.delete(developer, contractId);

        return reply('').code(!changes || changes.Count ? 204 : 404);
    }
}
