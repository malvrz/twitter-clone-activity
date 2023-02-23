import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

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

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Tweet>) {
    super(data);
  }
}

export interface TweetRelations {
  // describe navigational properties here
}

export type TweetWithRelations = Tweet & TweetRelations;
