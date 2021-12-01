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
  getModelSchemaRef, param, patch, post, put, Request, requestBody, response, Response, RestBindings
} from '@loopback/rest';
import {v4 as uuidv4} from 'uuid';
import {Log, Payment} from '../models';
import {LogRepository, PaymentRepository} from '../repositories';
import {Actions} from '../utils/actions';

@authenticate("jwt")
export class PaymentController {
  constructor(
    @repository(PaymentRepository)
    public paymentRepository: PaymentRepository, @repository(LogRepository)
    public logRepository: LogRepository,
    @inject(RestBindings.Http.REQUEST) private request: Request
  ) { }

  @get('/bank-list')
  @response(200, {
    description: 'Array of Payment model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Payment, {includeRelations: true}),
        },
      },
    },
  })
  async getBankList(
  ): Promise<Array<number>> {

    return this.paymentRepository.dataSource.execute('SELECT bank_code FROM payment GROUP BY bank_code').then((bankList: Array<number>) => {
      return bankList;
    });
  }


  @get('/amount-per-back')
  @response(200, {
    description: 'Array of Payment model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Payment, {includeRelations: true}),
        },
      },
    },
  })
  async getAmountPerBank(
  ): Promise<Array<number>> {

    return this.paymentRepository.dataSource.execute('SELECT sum (amount) FROM payment GROUP BY bank_code').then((bankList: Array<number>) => {
      return bankList;
    });
  }

  @post('/payments')
  @response(200, {
    description: 'Payment model instance',
    content: {'application/json': {schema: getModelSchemaRef(Payment)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payment, {
            title: 'NewPayment',
            exclude: ['ID'],
          }),
        },
      },
    })
    payment: Omit<Payment, 'ID'>,
  ): Promise<Payment> {
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.CREATE, tag: payment.batch_id, event: Actions.CREATE, description: `The payment with the ID ${payment.batch_id} has been created`})
    this.logRepository.create(log);
    return this.paymentRepository.create(payment);
  }

  @post('/payments/generate')
  @response(200, {
    description: 'Generate payment for active beneficiaries',
    content: {'application/json': {schema: CountSchema}},
  })
  async generate(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody() body: any) {
    let count = await this.paymentRepository.count({period: this.request.body.period});
    let batchId = uuidv4();
    if (count.count == 0) {
      batchId = uuidv4();
      this.paymentRepository.dataSource.execute(`CALL public.generate_payments($1,$2,$3)`, [this.request.body.amount, this.request.body.period, batchId]).then((result: Array<number>) => {
        return result;
      });
    }
    else {
      batchId = 'period_exist';
    }


    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.CREATE_REPORT, event: Actions.CREATE_REPORT, description: `The Beneficiary with the email ${this.request.userInfo?.email} has downladed the file`})
    this.logRepository.create(log);
    return {"batch_id": batchId};
  }

  @get('/payments/count')
  @response(200, {
    description: 'Payment model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Payment) where?: Where<Payment>,
  ): Promise<Count> {
    return this.paymentRepository.count(where);
  }

  @get('/payments')
  @response(200, {
    description: 'Array of Payment model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Payment, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Payment) filter?: Filter<Payment>,
  ): Promise<Payment[]> {
    return this.paymentRepository.find(filter);
  }

  @patch('/payments')
  @response(200, {
    description: 'Payment PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payment, {partial: true}),
        },
      },
    })
    payment: Payment,
    @param.where(Payment) where?: Where<Payment>,
  ): Promise<Count> {
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.UPDATEALL, event: Actions.UPDATEALL, description: "All payments have been updated"})
    this.logRepository.create(log);
    return this.paymentRepository.updateAll(payment, where);
  }

  @get('/payments/{id}')
  @response(200, {
    description: 'Payment model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Payment, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Payment, {exclude: 'where'}) filter?: FilterExcludingWhere<Payment>
  ): Promise<Payment> {
    return this.paymentRepository.findById(id, filter);
  }

  @patch('/payments/{id}')
  @response(204, {
    description: 'Payment PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payment, {partial: true}),
        },
      },
    })
    payment: Payment,
  ): Promise<void> {
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.UPDATE, tag: id, event: Actions.UPDATEALL, description: `The payment with the ID ${id} has been updated`})
    this.logRepository.create(log);
    await this.paymentRepository.updateById(id, payment);
  }

  @put('/payments/{id}')
  @response(204, {
    description: 'Payment PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() payment: Payment,
  ): Promise<void> {
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.UPDATE, tag: id, event: Actions.UPDATEALL, description: `The payment with the ID ${id} has been replaced`})
    this.logRepository.create(log);
    await this.paymentRepository.replaceById(id, payment);
  }

  @del('/payments/{id}')
  @response(204, {
    description: 'Payment DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.DELETE, tag: id, event: Actions.UPDATEALL, description: `The payment with the ID ${id} has been deleted`})
    this.logRepository.create(log);
    await this.paymentRepository.deleteById(id);
  }
}
