import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {FollowerRepository} from '../repositories';


@authenticate('jwt')
export class FollowerController {
  constructor(@repository(FollowerRepository) public followerRepository: FollowerRepository) { }

  /* TODO: additional validation if user is already followed
  by the authenticating user */
  // @post('/follow')
  // @response(200, {
  //   description: 'Follower model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(Follower)}},
  // })
  // async follow(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Follower, {
  //           title: 'NewFollower',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   follower: Omit<Follower, 'id'>,
  //   @inject(SecurityBindings.USER) user: UserProfile
  // ) {
  //   const newFollower = {
  //     ...follower,
  //     followerId: user.id
  //   }

  //   return this.followerRepository.create(newFollower);
  // }

  // @post('/unfollow')
  // @response(204, {
  //   description: 'Follower model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(Follower)}},
  // })
  // async unfollow(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Follower, {
  //           title: 'NewFollower',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   follower: Omit<Follower, 'id'>,
  //   @inject(SecurityBindings.USER) user: UserProfile
  // ) {

  //   const filter = {
  //     and: [{followedUserId: follower.followedUserId}, {followerId: user.id}]
  //   }

  //   await this.followerRepository.deleteAll(filter)
  // }

  // @get('/followers/list')
  // @response(200, {
  //   description: 'Array of Follower model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(Follower, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async getFollowers(
  //   @inject(SecurityBindings.USER) user: UserProfile,
  // ) {
  //   const filter = {where: {followedUserId: user.id}}
  //   return this.followerRepository.find(filter);
  // }
}
