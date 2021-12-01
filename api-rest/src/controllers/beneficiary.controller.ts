import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, Request, requestBody,
  response, RestBindings
} from '@loopback/rest';
import {v4 as uuidv4} from 'uuid';
import {Beneficiary, Log} from '../models';
import {BeneficiaryRepository, FileRepository, LogRepository} from '../repositories';
import {Actions} from '../utils/actions';

@authenticate("jwt")
export class BeneficiaryController {
  constructor(
    @repository(BeneficiaryRepository)
    public beneficiaryRepository: BeneficiaryRepository,
    @repository(FileRepository)
    public fileRepository: FileRepository,
    @repository(LogRepository)
    public logRepository: LogRepository,
    @inject(RestBindings.Http.REQUEST) private request: Request) { }

  @post('/beneficiaries')
  @response(200, {
    description: 'Beneficiary model instance',
    content: {'application/json': {schema: getModelSchemaRef(Beneficiary)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Beneficiary, {
            title: 'NewBeneficiary',
            exclude: ['ID'],
          }),
        },
      },
    })
    beneficiary: Omit<Beneficiary, 'ID'>,
  ): Promise<Beneficiary> {
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.UPDATEALL, tag: beneficiary.national_id_number, event: Actions.CREATE, description: `The beneficiary with the ID ${beneficiary.national_id_number} has been created`})
    this.logRepository.create(log);
    return this.beneficiaryRepository.create(beneficiary);
  }



  @post('/beneficiaries/count')
  @response(200, {
    description: 'Beneficiary model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @requestBody() body: any) {
    let conditions = [];
    let values = [];
    let paramsCount = 1;
    if (this.request.body.firstName) {
      conditions.push(`first_name LIKE $${paramsCount}`);
      values.push(this.request.body.firstName);
      paramsCount++;
    }
    if (this.request.body.middleName) {
      conditions.push(`middle_name LIKE $${paramsCount}`);
      values.push(this.request.body.middleName);
      paramsCount++;
    }
    if (this.request.body.lastName1) {
      conditions.push(`last_name_1 LIKE $${paramsCount}`);
      values.push(this.request.body.lastName1);
      paramsCount++;
    }
    if (this.request.body.lastName2) {
      conditions.push(`last_name_2 LIKE $${paramsCount}`);
      values.push(this.request.body.lastName2);
      paramsCount++;
    }
    if (this.request.body.nationalIdNumber) {
      conditions.push(`national_id_number LIKE $${paramsCount}`);
      values.push(this.request.body.nationalIdNumber);
      paramsCount++;
    }
    if (this.request.body.accountNumber) {
      conditions.push(`account_number LIKE $${paramsCount}`);
      values.push(this.request.body.accountNumber);
      paramsCount++;
    }

    let where = conditions.length ? 'where ' + conditions.join(' AND ') : '';

    if (!this.request.body.limit) {
      this.request.body.limit = 100;
    }
    if (!this.request.body.offset) {
      this.request.body.offset = 0;
    }
    where = `${where} LIMIT $${paramsCount}`;
    values.push(this.request.body.limit);
    paramsCount++;
    where = `${where} OFFSET $${paramsCount}`;
    values.push(this.request.body.offset);
    paramsCount++;
    let count: any = await this.beneficiaryRepository.dataSource.execute(`select count(id) FROM public.beneficiary ${where}`, values).then((databaseCount: Array<number>) => {
      return databaseCount;
    });

    return count[0];
  }

  @get('/beneficiaries')
  @response(200, {
    description: 'Array of Beneficiary model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Beneficiary, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Beneficiary) filter?: Filter<Beneficiary>,
  ): Promise<Beneficiary[]> {
    return this.beneficiaryRepository.find(filter);
  }


  @post('/beneficiaries2')
  @response(200, {
    description: 'Array of Beneficiary',
    content: {'application/json': {schema: CountSchema}},
  })
  async find2(
    @requestBody() body: any) {
    let conditions = [];
    let values = [];
    let paramsCount = 1;
    if (this.request.body.firstName) {
      conditions.push(`first_name LIKE $${paramsCount}`);
      values.push(this.request.body.firstName);
      paramsCount++;
    }
    if (this.request.body.middleName) {
      conditions.push(`middle_name LIKE $${paramsCount}`);
      values.push(this.request.body.middleName);
      paramsCount++;
    }
    if (this.request.body.lastName1) {
      conditions.push(`last_name_1 LIKE $${paramsCount}`);
      values.push(this.request.body.lastName1);
      paramsCount++;
    }
    if (this.request.body.lastName2) {
      conditions.push(`last_name_2 LIKE $${paramsCount}`);
      values.push(this.request.body.lastName2);
      paramsCount++;
    }
    if (this.request.body.nationalIdNumber) {
      conditions.push(`national_id_number LIKE $${paramsCount}`);
      values.push(this.request.body.nationalIdNumber);
      paramsCount++;
    }
    if (this.request.body.accountNumber) {
      conditions.push(`account_number LIKE $${paramsCount}`);
      values.push(this.request.body.accountNumber);
      paramsCount++;
    }
    let where = conditions.length ? 'where ' + conditions.join(' AND ') : '';

    if (!this.request.body.limit) {
      this.request.body.limit = 100;
    }
    if (!this.request.body.offset) {
      this.request.body.offset = 0;
    }
    where = `${where} LIMIT $${paramsCount}`;
    values.push(this.request.body.limit);
    paramsCount++;
    where = `${where} OFFSET $${paramsCount}`;
    values.push(this.request.body.offset);
    paramsCount++;

    let beneficiaries: any = await this.beneficiaryRepository.dataSource.execute(`SELECT id, type, gender, birthday, instrument, account_status, account_owner, account_number, bank_code, last_name_1, last_name_2, first_name, middle_name, marital_status, created, updated, national_id_type, national_id_number, arc_status, am_status, update_note, status, alert FROM public.beneficiary ${where}`, values).then((databaseBeneficiaries: Array<number>) => {
      return databaseBeneficiaries;
    });

    return beneficiaries;
  }


  @patch('/beneficiaries')
  @response(200, {
    description: 'Beneficiary PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Beneficiary, {partial: true}),
        },
      },
    })
    beneficiary: Beneficiary,
    @param.where(Beneficiary) where?: Where<Beneficiary>,
  ): Promise<Count> {
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.UPDATEALL, event: Actions.UPDATEALL, description: "All beneficiaries have been updated"})
    this.logRepository.create(log);
    return this.beneficiaryRepository.updateAll(beneficiary, where);
  }

  @get('/beneficiaries/{id}')
  @response(200, {
    description: 'Beneficiary model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Beneficiary, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Beneficiary, {exclude: 'where'}) filter?: FilterExcludingWhere<Beneficiary>
  ): Promise<Beneficiary> {
    return this.beneficiaryRepository.findById(id, filter);
  }

  @patch('/beneficiaries/{id}')
  @response(204, {
    description: 'Beneficiary PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Beneficiary, {partial: true}),
        },
      },
    })
    beneficiary: Beneficiary,
  ): Promise<void> {
    let dataBaseBeneficiary = await this.beneficiaryRepository.findOne({where: {ID: id}});
    if (beneficiary.status == 0) {
      let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.UPDATE, tag: id, event: Actions.UPDATE, description: `The beneficiary with the ID ${id} has been deactivated by the administrator`})
      this.logRepository.create(log);
      let JSONAlert = JSON.parse(dataBaseBeneficiary?.alert || '[]');
      JSONAlert.push({"type": "warning", "title": "Alert", "description": "El beneficiario ha sido desactivado por el administrador"});
      beneficiary.alert = JSON.stringify(JSONAlert);
    } else if (beneficiary.status == 1) {
      let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.UPDATE, tag: id, event: Actions.UPDATE, description: `The beneficiary with the ID ${id} has been activated by the administrator`})
      this.logRepository.create(log);
      let JSONAlert = JSON.parse(dataBaseBeneficiary?.alert || '[]');
      JSONAlert.push({"type": "warning", "title": "Alert", "description": "El beneficiario ha sido activado por el administrador"});
      beneficiary.alert = JSON.stringify(JSONAlert);
    }
    await this.beneficiaryRepository.updateById(id, beneficiary);

  }

  @put('/beneficiaries/{id}')
  @response(204, {
    description: 'Beneficiary PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() beneficiary: Beneficiary,
  ): Promise<void> {
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.UPDATE, tag: id, event: Actions.UPDATEALL, description: `The beneficiary with the ID ${id} has been replaced`})
    this.logRepository.create(log);
    await this.beneficiaryRepository.replaceById(id, beneficiary);
  }

  @del('/beneficiaries/{id}')
  @response(204, {
    description: 'Beneficiary DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.DELETE, tag: id, event: Actions.UPDATEALL, description: `The beneficiary with the ID ${id} has been deleted`})
    this.logRepository.create(log);
    await this.beneficiaryRepository.deleteById(id);
  }
}
