import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param, post, requestBody,
  response
} from '@loopback/rest';
import {Log} from '../models';
import {LogRepository} from '../repositories';

@authenticate("jwt")
export class LogController {
  constructor(
    @repository(LogRepository)
    public logRepository: LogRepository,
  ) { }

  @post('/logs')
  @response(200, {
    description: 'Log model instance',
    content: {'application/json': {schema: getModelSchemaRef(Log)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Log, {
            title: 'NewLog',
            exclude: ['ID'],
          }),
        },
      },
    })
    log: Omit<Log, 'ID'>,
  ): Promise<Log> {
    return this.logRepository.create(log);
  }

  @get('/logs/count')
  @response(200, {
    description: 'Log model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Log) where?: Where<Log>,
  ): Promise<Count> {
    return this.logRepository.count(where);
  }

  @get('/logs')
  @response(200, {
    description: 'Array of Log model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Log, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Log) filter?: Filter<Log>,
  ): Promise<Log[]> {
    return this.logRepository.find(filter);
  }


  @get('/logs/{id}')
  @response(200, {
    description: 'Log model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Log, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Log, {exclude: 'where'}) filter?: FilterExcludingWhere<Log>
  ): Promise<Log> {
    return this.logRepository.findById(id, filter);
  }

}
