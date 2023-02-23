import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Followships, Tweet, User, UserCredentials, UserRelations} from '../models';
import {FollowshipsRepository} from './followships.repository';
import {TweetRepository} from './tweet.repository';
import {UserCredentialsRepository} from './user-credentials.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly userCredentials: HasOneRepositoryFactory<UserCredentials, typeof User.prototype.id>;

  public readonly tweets: HasManyRepositoryFactory<Tweet, typeof User.prototype.id>;

  public readonly followships: HasManyThroughRepositoryFactory<User, typeof User.prototype.id,
    Followships,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserCredentialsRepository') protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
    @repository.getter('TweetRepository') protected tweetRepositoryGetter: Getter<TweetRepository>,
    @repository.getter('FollowshipsRepository') protected followshipsRepositoryGetter: Getter<FollowshipsRepository>,
    @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(User, dataSource);
    this.followships = this.createHasManyThroughRepositoryFactoryFor('followships', Getter.fromValue(this), followshipsRepositoryGetter,);
    this.registerInclusionResolver('followships', this.followships.inclusionResolver);
    this.tweets = this.createHasManyRepositoryFactoryFor('tweets', tweetRepositoryGetter,);
    this.registerInclusionResolver('tweets', this.tweets.inclusionResolver);
    this.userCredentials = this.createHasOneRepositoryFactoryFor('userCredentials', userCredentialsRepositoryGetter);
    this.registerInclusionResolver('userCredentials', this.userCredentials.inclusionResolver);
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
