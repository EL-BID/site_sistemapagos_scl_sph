export interface Beneficiary {
  ID: string;
  type: string;
  gender: number;
  birthday: string;
  instrument: number;
  account_status: string;
  account_owner: boolean;
  bank_code: string;
  account_number: string;
  last_name_1: string;
  last_name_2: string;
  first_name: string;
  middle_name: string;
  marital_status: number;
  created: string;
  updated: string;
  national_id_type: string;
  national_id_number: string;
  status: number;
  payments?: PaymentsEntity[] | null;
  familyGroupMembers?: FamilyGroupMembersEntity[] | null;
  surveys?: SurveysEntity[] | null;
  alert: string
}
export interface PaymentsEntity {
  ID: string;
  created: string;
  batch_id: string;
  bank_code: string;
  account_number: string;
  amount: number;
  beneficiary: number;
}
export interface FamilyGroupMembersEntity {
  ID: string;
  last_name_1: string;
  last_name_2: string;
  first_name: string;
  middle_name: string;
  national_id_type: number;
  national_id_number: string;
  marital_status: number;
  relationship: number;
  add_income: boolean;
  education_level: number;
  health_insurance: boolean;
  special_needs: number;
  handicap: boolean;
  beneficiary: number;
}
export interface SurveysEntity {
  ID: string;
  created: string;
  updated: string;
  data: string;
  schema: string;
  beneficiary_id: number;
}
