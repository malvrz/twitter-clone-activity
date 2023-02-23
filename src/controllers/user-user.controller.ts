import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema, repository,
  Where
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  HttpErrors,
  param, post
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import _ from 'lodash';
import {
  User
} from '../models';
import {FollowshipsRepository, UserRepository} from '../repositories';

@authenticate('jwt')
export class UserUserController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(FollowshipsRepository) protected followshipsRepository: FollowshipsRepository,
    @inject(SecurityBindings.USER) public userProfile: UserProfile,
  ) { }

  @get('/users/{id}/followers/list', {
    responses: {
      '200': {
        description: 'Array of User followers',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async findFollowers(
    @param.path.string('id') id: string,
  ): Promise<User[]> {

    const ids = await this.getFollowShipsId({'followingId': id}, 'followerId')
    return await this.userRepository.find({where: {id: {inq: [...ids]}}})
  }

  @get('/users/{id}/following/list', {
    responses: {
      '200': {
        description: 'Array of User followings',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async findFollowing(
    @param.path.string('id') id: string,
  ): Promise<User[]> {

    const ids = await this.getFollowShipsId({'followerId': id}, 'followingId')
    return await this.userRepository.find({where: {id: {inq: [...ids]}}})
  }

  @post('/users/{id}/follow', {
    responses: {
      '200': {
        description: 'follow a User model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User)
          }
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: string,
  ): Promise<User | void> {

    const followedUser = await this.userRepository.findById(id)
    const isAlreadyFollowed = await this.followshipsRepository.count(
      {
        and: [
          {'followerId': this.userProfile.id},
          {'followingId': followedUser.id}
        ]
      })

    if (isAlreadyFollowed.count) {
      throw new HttpErrors.BadRequest('User already followed.')
    }
    return await this.userRepository.followships(this.userProfile.id).link(followedUser.id)
  }

  @post('/users/{id}/unfollow', {
    responses: {
      '200': {
        description: 'Unfollow a user',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count | void> {
    const followedUser = await this.userRepository.findById(id)
    return this.userRepository.followships(this.userProfile.id).unlink(followedUser.id);
  }

  private async getFollowShipsId(filter: {}, key: string) {
    let ret: string[] = []
    const records = await this.followshipsRepository.find({where: filter})

    _.map(records, (rec: any) => {
      ret.push(rec[key])
    })

    return ret
  }
}
