import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Tweet,
  User,
} from '../models';
import {TweetRepository} from '../repositories';

export class TweetUserController {
  constructor(
    @repository(TweetRepository)
    public tweetRepository: TweetRepository,
  ) { }

  @get('/tweets/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Tweet',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Tweet.prototype.id,
  ): Promise<User> {
    return this.tweetRepository.user(id);
  }
}
