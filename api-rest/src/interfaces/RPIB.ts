export interface RPIB {
  ID?: string;
  BankCode?: string;
  AccountNumber?: string;
  NationalIDType?: string;
  NationalID?: string;
  LastName1?: string;
  LastName2?: string;
  FirstName?: string;
  MiddleName?: string;
  OperationResult?: string;
  RejectionReason?: string;
  DaysAfterPayment?: string;
  DaysBeforePayment?: string;
  MoneyReturned?: number;
  AmountReturned?: number;
  Period?: string;
}
