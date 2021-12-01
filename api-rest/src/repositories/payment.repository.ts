import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SitedbDataSource} from '../datasources';
import {Payment, PaymentRelations} from '../models';

export class PaymentRepository extends DefaultCrudRepository<
  Payment,
  typeof Payment.prototype.ID,
  PaymentRelations
> {
  constructor(
    @inject('datasources.sitedb') dataSource: SitedbDataSource,
  ) {
    super(Payment, dataSource);
  }
}
