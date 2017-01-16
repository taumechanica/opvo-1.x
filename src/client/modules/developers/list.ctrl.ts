import '../../assets/styles/developers.less';

import { Developer } from '../../domain/Developer';
import { DevelopersService } from '../../data/DevelopersService';

export class DevelopersController {
	public developers: Developer[];

	constructor(private developersService: DevelopersService) {
		'ngInject';

		this.developersService.getAll().then(response => {
			this.developers = response.data;
		});
	}
}
