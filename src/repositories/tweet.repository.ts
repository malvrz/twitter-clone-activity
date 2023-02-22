import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Tweet, TweetRelations} from '../models';

export class TweetRepository extends DefaultCrudRepository<
  Tweet,
  typeof Tweet.prototype.id,
  TweetRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Tweet, dataSource);
  }
}
