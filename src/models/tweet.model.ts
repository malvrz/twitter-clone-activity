import {Entity, model, property} from '@loopback/repository';

@model()
export class Tweet extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectId'}
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  content: string;

  @property({
    type: 'string',
  })
  user_id: string;


  constructor(data?: Partial<Tweet>) {
    super(data);
  }
}

export interface TweetRelations {
  // describe navigational properties here
}

export type TweetWithRelations = Tweet & TweetRelations;
