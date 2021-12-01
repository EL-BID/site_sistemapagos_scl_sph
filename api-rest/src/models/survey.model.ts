import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Beneficiary, BeneficiaryWithRelations} from './beneficiary.model';

@model()
export class Survey extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  ID?: string;

  @property({
    type: 'date',
  })
  created?: string;

  @property({
    type: 'date',
  })
  updated?: string;

  @property({
    type: 'string',
  })
  data?: string;

  @property({
    type: 'string',
  })
  schema?: string;

  @belongsTo(() => Beneficiary)
  beneficiary_id: string;

  constructor(data?: Partial<Survey>) {
    super(data);
  }
}

export interface SurveyRelations {
  beneficiary?: BeneficiaryWithRelations;
}

export type SurveyWithRelations = Survey & SurveyRelations;
