import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Filter,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param,
  post,
  requestBody
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {
  Tweet
} from '../models';
import {UserRepository} from '../repositories';

@authenticate('jwt')
export class UserTweetController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @inject(SecurityBindings.USER) public user: UserProfile,
  ) { }

  @post('/user/tweets', {
    responses: {
      '200': {
        description: 'Array of User has many Tweet',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tweet)},
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tweet, {
            title: 'NewTweetInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) tweet: Omit<Tweet, 'id'>,
  ) {
    return this.userRepository.tweets(this.user.id).create(tweet)
  }


  @get('/user/{id}/tweets', {
    responses: {
      '200': {
        description: 'Array of User has many Tweet',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tweet)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Tweet>,
  ): Promise<Omit<Tweet[], 'userId'>> {
    return this.userRepository.tweets(id).find(filter);
  }
}
