import {Entity, model, property} from '@loopback/repository';

@model()
export class Followships extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  followerId: string;

  @property({
    type: 'string',
    required: true,
  })
  followingId: string;


  constructor(data?: Partial<Followships>) {
    super(data);
  }
}

export interface FollowshipsRelations {
  // describe navigational properties here
}

export type FollowshipsWithRelations = Followships & FollowshipsRelations;
