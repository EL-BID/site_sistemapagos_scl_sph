import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';

@model()
export class File extends Entity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid(),
  })
  ID?: string;

  @property({
    type: 'string',
  })
  file_name?: string;

  @property({
    type: 'date',
  })
  created?: Date;

  @property({
    type: 'boolean',
  })
  updated?: boolean;

  @property({
    type: 'string',
  })
  batch_id?: string;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'string',
  })
  metadata?: string;

  @property({
    type: 'string',
  })
  data?: string;

  @property({
    type: 'string',
  })
  author?: string;

  @property({
    type: 'string',
  })
  type?: string;

  @property({
    type: 'number',
  })
  current_row?: number;

  @property({
    type: 'number',
  })
  total_rows?: number;

  @property({
    type: 'string',
    default: '{}'
  })
  error?: string;

  constructor(data?: Partial<File>) {
    super(data);
  }
}

export interface FileRelations {
  // describe navigational properties here
}

export type FileWithRelations = File & FileRelations;
