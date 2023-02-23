import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Followships} from './followships.model';
import {Tweet} from './tweet.model';
import {UserCredentials} from './user-credentials.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true
    }
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    hidden: true,
  })
  password: string;

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  @hasMany(() => Tweet)
  tweets: Tweet[];

  @hasMany(() => User, {
    through: {
      model: () => Followships,
      keyFrom: 'followerId',
      keyTo: 'followingId',
    }
  })
  followships: User[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
