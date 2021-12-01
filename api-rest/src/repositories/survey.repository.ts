import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SitedbDataSource} from '../datasources';
import {Survey, SurveyRelations} from '../models';

export class SurveyRepository extends DefaultCrudRepository<
  Survey,
  typeof Survey.prototype.ID,
  SurveyRelations
> {
  constructor(
    @inject('datasources.sitedb') dataSource: SitedbDataSource,
  ) {
    super(Survey, dataSource);
  }
}
