import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SitedbDataSource} from '../datasources';
import {Log, LogRelations} from '../models';

export class LogRepository extends DefaultCrudRepository<
  Log,
  typeof Log.prototype.ID,
  LogRelations
> {
  constructor(
    @inject('datasources.sitedb') dataSource: SitedbDataSource,
  ) {
    super(Log, dataSource);
  }
}
