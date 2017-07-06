import { Inject, Injectable } from 'injection-js';
import { number } from 'joi';

import { HttpMethod, ReplyFn, Request, Route } from '../Interface';
import { DevelopersGateway } from '../../data/DevelopersGateway';
import { ContractsGateway } from '../../data/ContractsGateway';
import { Contract } from '../../domain/Contract';

@Injectable()
export class UpdateContractRoute implements Route {
    public method: HttpMethod;
    public path: string;

    public constructor(
        @Inject(DevelopersGateway) private developersGateway: DevelopersGateway,
        @Inject(ContractsGateway) private contractsGateway: ContractsGateway
    ) {
        this.method = 'PUT';
        this.path = '/rest/developers/{DeveloperId}/contracts/{ContractId}';
    }

    public config = {
        validate: {
            params: {
                DeveloperId: number().required().integer().min(1),
                ContractId: number().required().integer().min(1)
            },
            payload: {
                Id: number().required().integer().min(1),
                DeveloperId: number().required().integer().min(1),
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

        const contractId = parseInt(request.params.ContractId);
        let contract = await this.contractsGateway.getById(developer, contractId);

        if (!contract) return reply('').code(404);

        contract = request.payload as Contract;
        if (contractId != contract.Id ||
            developerId != contract.DeveloperId
        ) return reply('').code(400);

        const changes = await this.contractsGateway.update(developer, contract);

        return reply('').code(!changes || changes.Count ? 204 : 404);
    }
}