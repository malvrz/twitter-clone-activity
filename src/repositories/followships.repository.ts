import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Followships, FollowshipsRelations} from '../models';

export class FollowshipsRepository extends DefaultCrudRepository<
  Followships,
  typeof Followships.prototype.id,
  FollowshipsRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Followships, dataSource);
  }
}
