import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';

@model()
export class Log extends Entity {
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
    type: 'string',
  })
  type?: string;

  @property({
    type: 'string',
  })
  tag?: string;


  @property({
    type: 'string',
  })
  event?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
  })
  user?: string;

  constructor(data?: Partial<Log>) {
    super(data);
  }
}

export interface LogRelations {
  // describe navigational properties here
}

export type LogWithRelations = Log & LogRelations;
