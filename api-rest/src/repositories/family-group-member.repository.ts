import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SitedbDataSource} from '../datasources';
import {FamilyGroupMember, FamilyGroupMemberRelations} from '../models';

export class FamilyGroupMemberRepository extends DefaultCrudRepository<
  FamilyGroupMember,
  typeof FamilyGroupMember.prototype.ID,
  FamilyGroupMemberRelations
> {
  constructor(
    @inject('datasources.sitedb') dataSource: SitedbDataSource,
  ) {
    super(FamilyGroupMember, dataSource);
  }
}
