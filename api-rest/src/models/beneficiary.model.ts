import {Entity, hasMany, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';
import {FamilyGroupMember} from './family-group-member.model';
import {Payment} from './payment.model';
import {Survey} from './survey.model';

@model()
export class Beneficiary extends Entity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid(),
  })
  ID?: string;

  @property({
    type: 'string',
  })
  type?: string;

  @property({
    type: 'number',
  })
  gender?: number;

  @property({
    type: 'date',
  })
  birthday?: Date;

  @property({
    type: 'number',
  })
  instrument?: number;

  @property({
    type: 'string',
  })
  account_status?: string;


  @property({
    type: 'string',
  })
  update_note?: string;

  @property({
    type: 'boolean',
  })
  account_owner?: boolean;

  @property({
    type: 'string',
  })
  bank_code?: string;

  @property({
    type: 'string',
  })
  account_number?: string;

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
  marital_status?: number;

  @property({
    type: 'number',
  })
  status?: number;

  @property({
    type: 'string',
  })
  alert?: string;

  @property({
    type: 'date',
  })
  created?: Date;

  @property({
    type: 'date',
  })
  updated?: Date;


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
  arc_status?: number;

  @property({
    type: 'number',
  })
  am_status?: number;


  @hasMany(() => Survey, {keyTo: 'beneficiary'})
  surveys?: Survey[];

  @hasMany(() => Payment, {keyTo: 'beneficiary'})
  payments: Payment[];

  @hasMany(() => FamilyGroupMember, {keyTo: 'beneficiary'})
  familyGroupMembers: FamilyGroupMember[];

  constructor(data?: Partial<Beneficiary>) {
    super(data);
  }
}

export interface BeneficiaryRelations {
  // describe navigational properties here
}

export type BeneficiaryWithRelations = Beneficiary & BeneficiaryRelations;
