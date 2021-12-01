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
  getModelSchemaRef, param, patch, post, put, Request, requestBody, response, RestBindings
} from '@loopback/rest';
import {v4 as uuidv4} from 'uuid';
import {FamilyGroupMember, Log} from '../models';
import {FamilyGroupMemberRepository, LogRepository} from '../repositories';
import {Actions} from '../utils/actions';
@authenticate("jwt")
export class FamilyGroupMemberController {
  constructor(
    @repository(FamilyGroupMemberRepository)
    public familyGroupMemberRepository: FamilyGroupMemberRepository,
    @repository(LogRepository)
    public logRepository: LogRepository,
    @inject(RestBindings.Http.REQUEST) private request: Request

  ) { }

  @post('/family-group-members')
  @response(200, {
    description: 'FamilyGroupMember model instance',
    content: {'application/json': {schema: getModelSchemaRef(FamilyGroupMember)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FamilyGroupMember, {
            title: 'NewFamilyGroupMember',
            exclude: ['ID'],
          }),
        },
      },
    })
    familyGroupMember: Omit<FamilyGroupMember, 'ID'>,
  ): Promise<FamilyGroupMember> {
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.CREATE, tag: familyGroupMember.national_id_number, event: Actions.CREATE, description: `The family member with the ID ${familyGroupMember.national_id_number} has been created`})
    this.logRepository.create(log);
    return this.familyGroupMemberRepository.create(familyGroupMember);
  }

  @get('/family-group-members/count')
  @response(200, {
    description: 'FamilyGroupMember model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(FamilyGroupMember) where?: Where<FamilyGroupMember>,
  ): Promise<Count> {
    return this.familyGroupMemberRepository.count(where);
  }

  @get('/family-group-members')
  @response(200, {
    description: 'Array of FamilyGroupMember model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FamilyGroupMember, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(FamilyGroupMember) filter?: Filter<FamilyGroupMember>,
  ): Promise<FamilyGroupMember[]> {
    return this.familyGroupMemberRepository.find(filter);
  }

  @patch('/family-group-members')
  @response(200, {
    description: 'FamilyGroupMember PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FamilyGroupMember, {partial: true}),
        },
      },
    })
    familyGroupMember: FamilyGroupMember,
    @param.where(FamilyGroupMember) where?: Where<FamilyGroupMember>,
  ): Promise<Count> {
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.UPDATEALL, event: Actions.UPDATEALL, description: "All family members have been updated"})
    this.logRepository.create(log);
    return this.familyGroupMemberRepository.updateAll(familyGroupMember, where);
  }

  @get('/family-group-members/{id}')
  @response(200, {
    description: 'FamilyGroupMember model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FamilyGroupMember, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(FamilyGroupMember, {exclude: 'where'}) filter?: FilterExcludingWhere<FamilyGroupMember>
  ): Promise<FamilyGroupMember> {
    return this.familyGroupMemberRepository.findById(id, filter);
  }

  @patch('/family-group-members/{id}')
  @response(204, {
    description: 'FamilyGroupMember PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FamilyGroupMember, {partial: true}),
        },
      },
    })
    familyGroupMember: FamilyGroupMember,
  ): Promise<void> {
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.UPDATE, tag: id, event: Actions.UPDATEALL, description: `The family member with the ID ${id} has been updated`})
    this.logRepository.create(log);
    await this.familyGroupMemberRepository.updateById(id, familyGroupMember);
  }

  @put('/family-group-members/{id}')
  @response(204, {
    description: 'FamilyGroupMember PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() familyGroupMember: FamilyGroupMember,
  ): Promise<void> {
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.UPDATE, tag: id, event: Actions.UPDATEALL, description: `The family member with the ID ${id} has been replaced`})
    this.logRepository.create(log);
    await this.familyGroupMemberRepository.replaceById(id, familyGroupMember);
  }

  @del('/family-group-members/{id}')
  @response(204, {
    description: 'FamilyGroupMember DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.DELETE, tag: id, event: Actions.UPDATEALL, description: `The family member with the ID ${id} has been deleted`})
    this.logRepository.create(log);
    await this.familyGroupMemberRepository.deleteById(id);
  }
}
