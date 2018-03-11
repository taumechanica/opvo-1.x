import { Inject, Injectable } from 'injection-js';
import { number } from 'joi';

import { HttpMethod, ResponseTk, Request, Route } from '../Interface';
import { DevelopersGateway } from '../../data/DevelopersGateway';
import { ContractsGateway } from '../../data/ContractsGateway';

@Injectable()
export class GetAllContractsByYearRoute implements Route {
    public method: HttpMethod;
    public path: string;

    public constructor(
        @Inject(DevelopersGateway) private developersGateway: DevelopersGateway,
        @Inject(ContractsGateway) private contractsGateway: ContractsGateway
    ) {
        this.method = 'GET';
        this.path = '/rest/developers/{DeveloperId}/contracts-{Year}';
    }

    public config = {
        validate: {
            params: {
                DeveloperId: number().required().integer().min(1),
                Year: number().required().integer().min(2010).max(2030)
            }
        }
    };

    public async handler(request: Request, tk: ResponseTk) {
        const developerId = parseInt(request.params.DeveloperId);
        const developer = await this.developersGateway.getById(developerId);

        if (!developer) return tk.response('').code(404);

        const year = parseInt(request.params.Year);
        const contracts = await this.contractsGateway.getAllByYear(developer, year);

        return tk.response(contracts);
    }
}
