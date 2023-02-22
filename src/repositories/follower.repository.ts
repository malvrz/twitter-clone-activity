import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Follower, FollowerRelations} from '../models';

export class FollowerRepository extends DefaultCrudRepository<
  Follower,
  typeof Follower.prototype.id,
  FollowerRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Follower, dataSource);
  }
}
