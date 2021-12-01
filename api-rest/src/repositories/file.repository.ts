import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SitedbDataSource} from '../datasources';
import {File, FileRelations} from '../models';

export class FileRepository extends DefaultCrudRepository<
  File,
  typeof File.prototype.ID,
  FileRelations
> {
  constructor(
    @inject('datasources.sitedb') dataSource: SitedbDataSource,
  ) {
    super(File, dataSource);
  }
}
