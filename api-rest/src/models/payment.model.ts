import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';
import {BeneficiaryWithRelations} from './beneficiary.model';

@model()
export class Payment extends Entity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid(),
  })
  ID?: string;

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
  batch_id?: string;

  @property({
    type: 'string',
  })
  bank_code?: string;

  @property({
    type: 'string',
  })
  account_number?: string;

  @property({
    type: 'number',
  })
  amount?: number;

  @property({
    type: 'string',
  })
  period?: string;

  @property({
    type: 'string',
  })
  operation_result?: string;

  @property({
    type: 'string',
  })
  rejection_reason?: string;

  @property({
    type: 'string',
  })
  movements_days_after_payment?: string;

  @property({
    type: 'string',
  })
  movements_days_before_payment?: string;

  @property({
    type: 'number',
  })
  money_returned?: number;

  @property({
    type: 'number',
  })
  amount_returned?: number;



  @property({
    type: 'string',
  })
  beneficiary?: string;


  constructor(data?: Partial<Payment>) {
    super(data);
  }
}

export interface PaymentRelations {
  beneficiary?: BeneficiaryWithRelations;
}

export type PaymentWithRelations = Payment & PaymentRelations;
