import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Tweet, TweetRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class TweetRepository extends DefaultCrudRepository<
  Tweet,
  typeof Tweet.prototype.id,
  TweetRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Tweet.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Tweet, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
