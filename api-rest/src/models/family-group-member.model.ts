import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';
import {BeneficiaryWithRelations} from './beneficiary.model';

@model({settings: {strict: true}})
export class FamilyGroupMember extends Entity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid(),
  })
  ID?: string;

  @property({
    type: 'string',
  })
  last_name_1?: string;

  @property({
    type: 'string',
  })
  last_name_2?: string;

  @property({
    type: 'string',
  })
  first_name?: string;

  @property({
    type: 'string',
  })
  middle_name?: string;

  @property({
    type: 'number',
  })
  gender?: number;

  @property({
    type: 'string',
  })
  national_id_type?: string;

  @property({
    type: 'string',
  })
  national_id_number?: string;

  @property({
    type: 'number',
  })
  marital_status?: number;

  @property({
    type: 'number',
  })
  relationship?: number;

  @property({
    type: 'boolean',
  })
  add_income?: boolean;

  @property({
    type: 'number',
  })
  education_level?: number;

  @property({
    type: 'boolean',
  })
  health_insurance?: boolean;

  @property({
    type: 'number',
  })
  special_needs?: number;

  @property({
    type: 'boolean',
  })
  handicap?: boolean;

  @property({
    type: 'string',
  })
  beneficiary?: string;

  constructor(data?: Partial<FamilyGroupMember>) {
    super(data);
  }
}

export interface FamilyGroupMemberRelations {
  beneficiary?: BeneficiaryWithRelations;
}

export type FamilyGroupMemberWithRelations = FamilyGroupMember & FamilyGroupMemberRelations;
