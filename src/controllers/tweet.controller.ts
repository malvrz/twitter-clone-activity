import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, put, requestBody,
  response
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Tweet} from '../models';
import {TweetRepository} from '../repositories';

@authenticate('jwt')
export class TweetController {
  constructor(
    @repository(TweetRepository) public tweetRepository: TweetRepository,
    @inject(SecurityBindings.USER) public user: UserProfile,
  ) { }

  @get('/tweets/count')
  @response(200, {
    description: 'Tweet model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Tweet) where?: Where<Tweet>,
  ): Promise<Count> {
    return this.tweetRepository.count(where);
  }

  @get('/tweets')
  @response(200, {
    description: 'Array of Tweet model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Tweet, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Tweet) filter?: Filter<Tweet>,
  ): Promise<Tweet[]> {
    return this.tweetRepository.find(filter);
  }

  @get('/tweets/{id}')
  @response(200, {
    description: 'Tweet model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Tweet, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Tweet, {exclude: 'where'}) filter?: FilterExcludingWhere<Tweet>
  ): Promise<Tweet> {
    return this.tweetRepository.findById(id, filter);
  }

  @patch('/tweets/{id}')
  @response(204, {
    description: 'Tweet PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tweet, {partial: true}),
        },
      },
    })
    tweet: Tweet,
  ): Promise<void> {
    const record = await this.tweetRepository.find({
      where: {
        id,
        userId: this.user.id,
      }
    })

    if (record.length) {
      return await this.tweetRepository.updateById(id, tweet);
    }

    throw new HttpErrors.NotFound('Tweet not found.')
  }

  @put('/tweets/{id}')
  @response(204, {
    description: 'Tweet PUT success',
  })
  async replaceById(
    @param.path.number('id') id: string,
    @requestBody() tweet: Tweet,
  ): Promise<void> {
    const record = await this.tweetRepository.find({
      where: {
        id,
        userId: this.user.id,
      }
    })
    if (record.length) {
      return await this.tweetRepository.updateById(id, tweet);
    }

    throw new HttpErrors.NotFound('Tweet not found.')
  }

  @del('/tweets/{id}')
  @response(204, {
    description: 'Tweet DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    const filter = {
      and: [{_id: id}, {userId: this.user.id}]
    }

    await this.tweetRepository.deleteAll(filter);
  }
}
