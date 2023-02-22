import {Entity, model, property} from '@loopback/repository';

@model()
export class Follower extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectId'}
  })
  id?: string;

  @property({
    type: 'string',
  })
  followerId?: string;

  @property({
    type: 'string',
    required: true,
  })
  followedUserId: string;


  constructor(data?: Partial<Follower>) {
    super(data);
  }
}

export interface FollowerRelations {
  // describe navigational properties here
}

export type FollowerWithRelations = Follower & FollowerRelations;
