import {Getter, inject} from '@loopback/core';
import {DefaultTransactionalRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {SitedbDataSource} from '../datasources';
import {Beneficiary, BeneficiaryRelations, FamilyGroupMember, Payment} from '../models';
import {FamilyGroupMemberRepository} from './family-group-member.repository';
import {PaymentRepository} from './payment.repository';

export class BeneficiaryRepository extends DefaultTransactionalRepository<
  Beneficiary,
  typeof Beneficiary.prototype.ID,
  BeneficiaryRelations
> {

  public readonly payments: HasManyRepositoryFactory<Payment, typeof Beneficiary.prototype.ID>;

  public readonly familyGroupMembers: HasManyRepositoryFactory<FamilyGroupMember, typeof Beneficiary.prototype.ID>;

  constructor(
    @inject('datasources.sitedb') dataSource: SitedbDataSource, @repository.getter('PaymentRepository') protected paymentRepositoryGetter: Getter<PaymentRepository>, @repository.getter('FamilyGroupMemberRepository') protected familyGroupMemberRepositoryGetter: Getter<FamilyGroupMemberRepository>,
  ) {
    super(Beneficiary, dataSource);
    this.familyGroupMembers = this.createHasManyRepositoryFactoryFor('familyGroupMembers', familyGroupMemberRepositoryGetter,);
    this.registerInclusionResolver('familyGroupMembers', this.familyGroupMembers.inclusionResolver);
    this.payments = this.createHasManyRepositoryFactoryFor('payments', paymentRepositoryGetter,);
    this.registerInclusionResolver('payments', this.payments.inclusionResolver);
  }
}
