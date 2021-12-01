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
import {Log, Survey} from '../models';
import {LogRepository, SurveyRepository} from '../repositories';
import {Actions} from '../utils/actions';

export class SurveyController {
  constructor(
    @repository(SurveyRepository)
    public surveyRepository: SurveyRepository,
    @repository(LogRepository)
    public logRepository: LogRepository,
    @inject(RestBindings.Http.REQUEST) private request: Request
  ) { }

  @post('/surveys')
  @response(200, {
    description: 'Survey model instance',
    content: {'application/json': {schema: getModelSchemaRef(Survey)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Survey, {
            title: 'NewSurvey',
            exclude: ['ID'],
          }),
        },
      },
    })
    survey: Omit<Survey, 'ID'>,
  ): Promise<Survey> {
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.CREATE, tag: survey.beneficiary_id, event: Actions.CREATE, description: `The survey with the ID ${survey.beneficiary_id} has been created`})
    this.logRepository.create(log);
    return this.surveyRepository.create(survey);
  }

  @get('/surveys/count')
  @response(200, {
    description: 'Survey model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Survey) where?: Where<Survey>,
  ): Promise<Count> {
    return this.surveyRepository.count(where);
  }

  @get('/surveys')
  @response(200, {
    description: 'Array of Survey model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Survey, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Survey) filter?: Filter<Survey>,
  ): Promise<Survey[]> {
    return this.surveyRepository.find(filter);
  }

  @patch('/surveys')
  @response(200, {
    description: 'Survey PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Survey, {partial: true}),
        },
      },
    })
    survey: Survey,
    @param.where(Survey) where?: Where<Survey>,
  ): Promise<Count> {
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.UPDATEALL, event: Actions.UPDATEALL, description: "All surveys have been updated"})
    this.logRepository.create(log);
    return this.surveyRepository.updateAll(survey, where);
  }

  @get('/surveys/{id}')
  @response(200, {
    description: 'Survey model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Survey, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Survey, {exclude: 'where'}) filter?: FilterExcludingWhere<Survey>
  ): Promise<Survey> {
    return this.surveyRepository.findById(id, filter);
  }

  @patch('/surveys/{id}')
  @response(204, {
    description: 'Survey PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Survey, {partial: true}),
        },
      },
    })
    survey: Survey,
  ): Promise<void> {
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.UPDATE, tag: id, event: Actions.UPDATEALL, description: `The survey with the ID ${id} has been updated`})
    this.logRepository.create(log);
    await this.surveyRepository.updateById(id, survey);
  }

  @put('/surveys/{id}')
  @response(204, {
    description: 'Survey PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() survey: Survey,
  ): Promise<void> {
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.UPDATE, tag: id, event: Actions.UPDATEALL, description: `The survey with the ID ${id} has been replaced`})
    this.logRepository.create(log);
    await this.surveyRepository.replaceById(id, survey);
  }

  @del('/surveys/{id}')
  @response(204, {
    description: 'Survey DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.DELETE, tag: id, event: Actions.UPDATEALL, description: `The survey with the ID ${id} has been deleted`})
    this.logRepository.create(log);
    await this.surveyRepository.deleteById(id);
  }
}
