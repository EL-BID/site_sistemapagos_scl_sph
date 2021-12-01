

import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere, IsolationLevel, repository, Transaction, Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, Request, requestBody,
  response, Response,
  RestBindings
} from '@loopback/rest';
import csv from 'csv';
import {v4 as uuidv4} from 'uuid';
import {AM} from '../interfaces/AM';
import {ARC} from '../interfaces/ARC';
import {BDA} from '../interfaces/BDA';
import {BDI} from '../interfaces/BDI';
import {FamilyMember} from '../interfaces/FamilyMember';
import {RPIB} from '../interfaces/RPIB';
import {Beneficiary, FamilyGroupMember, File, Log, Payment} from '../models';
import {BeneficiaryRepository, FamilyGroupMemberRepository, FileRepository, LogRepository, PaymentRepository} from '../repositories';
import {Actions} from '../utils/actions';
import {Formats} from '../utils/formats';
const moment = require('moment');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs')
const dateFormat = require("dateformat");
import multer = require('multer');

@authenticate("jwt")
export class FileController {
  /**
 * Constructor
 * @param handler - Inject an express request handler to deal with the request
 */
  constructor(
    @repository(FileRepository,)
    public fileRepository: FileRepository,
    @repository(BeneficiaryRepository,)
    public beneficiaryRepository: BeneficiaryRepository,
    @repository(BeneficiaryRepository,)
    public beneficiarySearchRepository: BeneficiaryRepository,
    @repository(FamilyGroupMemberRepository,)
    public familyGroupMemberRepository: FamilyGroupMemberRepository,
    @repository(PaymentRepository,)
    public paymentRepository: PaymentRepository,
    @repository(LogRepository)
    public logRepository: LogRepository,
    @inject(RestBindings.Http.REQUEST) private request: Request
  ) { }

  @post('/files', {
    responses: {
      '200': {
        content: {'application/json': {}},
      },
    },
  })
  async fileUpload(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<File> {
    const storage = multer.memoryStorage();
    const upload = multer({storage});
    return new Promise<File>((resolve, reject) => {
      upload.any()(request, response, uploadError => {
        if (uploadError) return reject(uploadError);
        const uploadFiles = request.files as Express.Multer.File[];
        let uploadFile = uploadFiles[0];
        if (uploadFile) {
          let fileCount = 0;
          let fileCountInterval = 0;
          let fileInterval = 1000;
          let errorCount = 0;
          let errorLimit = 10000;
          let file = new File;
          file.ID = uuidv4();
          file.author = uuidv4();
          file.batch_id = uuidv4();
          file.created = new Date();
          file.status = "created";
          file.type = request.body.type;
          file.current_row = 0;
          file.total_rows = 0;
          this.fileRepository.create(file);
          resolve(file);
          let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.UPLOAD, tag: file.ID, event: Actions.UPLOAD, description: `The file with the ID ${file.ID} has been created`})
          this.logRepository.create(log);
          if (request.body.type == "BDI") {

            FileController.getCSVElements(uploadFile, file).then(async (beneficiaries: Array<BDI>) => {
              let error = false;
              let JSONError = JSON.parse(file.error || '[]');
              try {
                file.total_rows = beneficiaries.length;
                this.fileRepository.updateById(file.ID, file);
                let beneficiariesToSave: Beneficiary[] = [];
                for await (let b of beneficiaries) {
                  let beneficiary = new Beneficiary
                  beneficiary.gender = b.Gender || 1;
                  beneficiary.instrument = b.Instrument;
                  beneficiary.account_status = b.AccountStatus;
                  beneficiary.account_owner = b.AccountOwner;
                  beneficiary.bank_code = b.BankCode;
                  beneficiary.account_number = b.AccountNumber;
                  beneficiary.last_name_1 = b.LastName1;
                  beneficiary.last_name_2 = b.LastName2;
                  beneficiary.first_name = b.FirstName;
                  beneficiary.middle_name = b.MiddleName;
                  beneficiary.marital_status = b.MaritalStatus;
                  beneficiary.national_id_type = b.NationalIDType;
                  beneficiary.national_id_number = b.NationalID;
                  beneficiary.status = b.Status;
                  beneficiary.created = new Date();
                  let dataBaseBeneficiary = await this.beneficiaryRepository.findOne({fields: {ID: true}, where: {national_id_number: b.NationalID}});
                  if (!dataBaseBeneficiary) {
                    beneficiary.ID = uuidv4();
                    beneficiary.birthday = new Date(moment(b.Birthday, Formats.LATAM_DATE_FORMAT).format(Formats.US_DATE_FORMAT));
                    if (!(beneficiary.birthday instanceof Date && !isNaN(beneficiary.birthday.valueOf()))) {
                      JSONError.push({"type": "error", "title": "error", "description": `Beneficiary with national_id ${b.NationalID} has an invalid birthday, line ${fileCount + 2}`});
                      error = true;
                      errorCount = errorCount + 1;
                    }
                    beneficiariesToSave.push(beneficiary);
                  }
                  else {
                    JSONError.push({"type": "warning", "title": "Alert", "description": `Beneficiary with national_id ${b.NationalID} exist in the database, line ${fileCount + 2} `});
                    error = true;
                    errorCount = errorCount + 1;
                  }
                  if (fileCountInterval == fileInterval) {
                    file.current_row = fileCount;
                    this.fileRepository.updateById(file.ID, file);
                    fileCountInterval = 0;
                  }
                  if (errorCount > errorLimit) {
                    break;
                  }
                  fileCount++;
                  fileCountInterval++;
                }
                const tx: Transaction = await this.beneficiaryRepository.beginTransaction(IsolationLevel.READ_COMMITTED);
                if (!error) {
                  for await (let beneficiary of beneficiariesToSave) {
                    await this.beneficiaryRepository.create(beneficiary, {transaction: tx});
                  }
                  await tx.commit();
                  file.status = "completed"
                  file.current_row = fileCount;
                  this.fileRepository.updateById(file.ID, file);
                }
                else {
                  tx.rollback();
                  file.error = JSON.stringify(JSONError);
                  file.status = "error"
                  file.current_row = fileCount;
                  this.fileRepository.updateById(file.ID, file);
                  log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.ERROR, tag: file.ID, event: Actions.ERROR, description: `Error while loading file ${file.ID}. Go to the file error for more information`});
                  this.logRepository.create(log);
                }
              } catch (err) {
                log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.ERROR, tag: file.ID, event: Actions.ERROR, description: `Error while loading file ${file.ID}. Go to the application console for more information`})
                this.logRepository.create(log);
                JSONError.push({"type": "error", "title": "error", "description": `Unexpected error has occurred, please contact the administrator`});
                file.error = JSON.stringify(JSONError);
                file.status = "error"
                this.fileRepository.updateById(file.ID, file);
                console.error(err);
              }
            });
          }
          else if (request.body.type == "BDA-SB") {
            FileController.getCSVElements(uploadFile, file).then(async (beneficiaries: Array<BDA>) => {
              try {
                file.total_rows = beneficiaries.length;
                this.fileRepository.updateById(file.ID, file);
                let error = false;
                let JSONError = JSON.parse(file.error || '[]');
                let beneficiariesToUpdate: Beneficiary[] = [];
                for await (let b of beneficiaries) {
                  let dataBaseBeneficiary = await this.beneficiaryRepository.findOne({fields: {ID: true, alert: true}, where: {national_id_number: b.NationalID}});
                  if (dataBaseBeneficiary) {
                    let beneficiary = new Beneficiary;
                    beneficiary.ID = dataBaseBeneficiary.ID;
                    beneficiary.instrument = b.Instrument;
                    beneficiary.account_status = b.UpdateNote;
                    beneficiary.update_note = b.UpdateNote;
                    beneficiary.bank_code = b.BankCode;
                    beneficiary.account_number = b.AccountNumber;
                    beneficiary.last_name_1 = b.LastName1;
                    beneficiary.last_name_2 = b.LastName2;
                    beneficiary.first_name = b.FirstName;
                    beneficiary.middle_name = b.MiddleName;
                    beneficiary.national_id_type = b.NationalIDType;
                    beneficiary.updated = new Date();
                    beneficiary.birthday = new Date(moment(b.Birthday, Formats.LATAM_DATE_FORMAT).format(Formats.US_DATE_FORMAT));
                    if (!(beneficiary.birthday instanceof Date && !isNaN(beneficiary.birthday.valueOf()))) {
                      JSONError.push({"type": "error", "title": "error", "description": `Beneficiary with national_id ${b.NationalID} has an invalid birthday, line ${fileCount + 2}`});
                      error = true;
                      errorCount = errorCount + 1;
                    }

                    if (b.UpdateNote == "CC") {
                      let JSONAlert = JSON.parse(dataBaseBeneficiary.alert || '[]')
                      JSONAlert.push({"type": "warning", "title": "Alert", "description": "Account Status is CC"});
                      beneficiary.alert = JSON.stringify(JSONAlert);
                    }
                    beneficiariesToUpdate.push(beneficiary);
                  }
                  else {
                    JSONError.push({"type": "warning", "title": "Alert", "description": `Beneficiary with national_id ${b.NationalID} not found, line ${fileCount + 2} `});
                    error = true;
                    errorCount = errorCount + 1;
                  }
                  if (fileCountInterval == fileInterval) {
                    file.current_row = fileCount;
                    this.fileRepository.updateById(file.ID, file);
                    fileCountInterval = 0;
                  }
                  if (errorCount > errorLimit) {
                    break;
                  }
                  fileCount++;
                  fileCountInterval++;
                }
                const tx: Transaction = await this.beneficiaryRepository.beginTransaction(IsolationLevel.READ_COMMITTED);
                if (!error) {
                  for await (let beneficiary of beneficiariesToUpdate) {
                    await this.beneficiaryRepository.updateById(beneficiary.ID, beneficiary, {transaction: tx});
                  }
                  await tx.commit();
                  file.current_row = fileCount;
                  file.status = "completed";
                  this.fileRepository.updateById(file.ID, file);
                }
                else {
                  tx.rollback();
                  file.error = JSON.stringify(JSONError);
                  file.status = "error"
                  file.current_row = fileCount;
                  this.fileRepository.updateById(file.ID, file);
                  log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.ERROR, tag: file.ID, event: Actions.ERROR, description: `Error while loading file ${file.ID}. Go to the file error for more information`});
                  this.logRepository.create(log);
                }
              } catch (err) {
                log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.ERROR, tag: file.ID, event: Actions.ERROR, description: `Error while loading file ${file.ID}. Go to the application console for more information`});
                this.logRepository.create(log);
                let JSONError = JSON.parse(file.error || '[]');
                JSONError.push({"type": "error", "title": "error", "description": `Unexpected error has occurred, please contact the administrator`});
                file.error = JSON.stringify(JSONError);
                file.status = "error"
                this.fileRepository.updateById(file.ID, file);
                console.error(err);
              }
            });
          }
          else if (request.body.type == "RPIB") {
            FileController.getCSVElements(uploadFile, file).then(async (payments: Array<RPIB>) => {
              try {
                file.total_rows = payments.length;
                this.fileRepository.updateById(file.ID, file);
                let paymentsToUpdate: Payment[] = [];
                let JSONError = JSON.parse(file.error || '[]');
                let error = false;
                for await (let p of payments) {
                  let dataBasePayment: any = await this.beneficiarySearchRepository.dataSource.execute(`SELECT p.id id  FROM public.beneficiary b inner join public.payment p on b.id = p.beneficiary where b.national_id_number = $1 and b.account_number = $2 and  b.bank_code = $3 and  b.national_id_type= $4 and p.period =$5`, [p.NationalID, p.AccountNumber, p.BankCode, p.NationalID, p.Period]).then((dataBasePayment: Array<number>) => {
                    return dataBasePayment;
                  });
                  if (dataBasePayment) {
                    let payment = new Payment;
                    payment.ID = dataBasePayment[0].id;
                    payment.operation_result = p.OperationResult;
                    payment.rejection_reason = p.RejectionReason;
                    payment.movements_days_after_payment = p.DaysAfterPayment;
                    payment.movements_days_before_payment = p.DaysBeforePayment;
                    payment.money_returned = p.MoneyReturned;
                    payment.amount_returned = p.AmountReturned;
                    payment.updated = new Date();
                    paymentsToUpdate.push(payment);
                  } else {
                    JSONError.push({"type": "warning", "title": "Alert", "description": `Beneficiary with national_id ${p.NationalID} not found, line ${fileCount + 2}`});
                    error = true;
                    errorCount = errorCount + 1;
                  }
                  if (fileCountInterval == fileInterval) {
                    file.current_row = fileCount;
                    this.fileRepository.updateById(file.ID, file);
                    fileCountInterval = 0;
                  }
                  if (errorCount > errorLimit) {
                    break;
                  }
                  fileCount++;
                  fileCountInterval++;
                }
                const tx: Transaction = await this.beneficiaryRepository.beginTransaction(IsolationLevel.READ_COMMITTED);
                if (!error) {
                  for await (let payment of paymentsToUpdate) {
                    await this.paymentRepository.updateById(payment.ID, payment, {transaction: tx});
                  }
                  await tx.commit();
                  file.current_row = fileCount;
                  file.status = "completed";
                  this.fileRepository.updateById(file.ID, file);
                }
                else {
                  tx.rollback();
                  file.error = JSON.stringify(JSONError);
                  file.status = "error"
                  file.current_row = fileCount;
                  this.fileRepository.updateById(file.ID, file);
                  log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.ERROR, tag: file.ID, event: Actions.ERROR, description: `Error while loading file ${file.ID}. Go to the file error for more information`});
                  this.logRepository.create(log);
                }
              } catch (err) {
                log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.ERROR, tag: file.ID, event: Actions.ERROR, description: `Error while loading file ${file.ID}. Go to the application console for more information`});
                this.logRepository.create(log);
                let JSONError = JSON.parse(file.error || '[]');
                JSONError.push({"type": "error", "title": "error", "description": `Unexpected error has occurred, please contact the administrator`});
                file.error = JSON.stringify(JSONError);
                file.status = "error"
                this.fileRepository.updateById(file.ID, file);
                console.error(err);
              }
            });
          }
          else if (request.body.type == "BDA-ARC") {
            FileController.getCSVElements(uploadFile, file).then(async (beneficiaries: Array<ARC>) => {
              try {
                file.total_rows = beneficiaries.length;
                this.fileRepository.updateById(file.ID, file);
                let error = false;
                let JSONError = JSON.parse(file.error || '[]');
                let beneficiariesToUpdate: Beneficiary[] = [];
                for await (let b of beneficiaries) {
                  let dataBaseBeneficiary = await this.beneficiaryRepository.findOne({fields: {ID: true, alert: true}, where: {national_id_number: b.NationalID}});
                  if (dataBaseBeneficiary) {
                    let beneficiary = new Beneficiary;
                    beneficiary.ID = dataBaseBeneficiary.ID;
                    beneficiary.arc_status = b.ARCStatus;
                    beneficiary.updated = new Date();
                    if (b.ARCStatus == 0) {
                      let JSONAlert = JSON.parse(dataBaseBeneficiary.alert || '[]')
                      JSONAlert.push({"type": "warning", "title": "Alert", "description": "ARC Status is 0"});
                      beneficiary.alert = JSON.stringify(JSONAlert);
                    }
                    beneficiariesToUpdate.push(beneficiary);
                  }
                  else {
                    JSONError.push({"type": "warning", "title": "Alert", "description": `Beneficiary with national_id ${b.NationalID} not found, line ${fileCount + 2}`});
                    error = true;
                    errorCount = errorCount + 1;
                  }
                  if (fileCountInterval == fileInterval) {
                    file.current_row = fileCount;
                    this.fileRepository.updateById(file.ID, file);
                    fileCountInterval = 0;
                  }
                  if (errorCount > errorLimit) {
                    break;
                  }
                  fileCount++;
                  fileCountInterval++;
                }
                const tx: Transaction = await this.beneficiaryRepository.beginTransaction(IsolationLevel.READ_COMMITTED);
                if (!error) {
                  for await (let beneficiary of beneficiariesToUpdate) {
                    await this.beneficiaryRepository.updateById(beneficiary.ID, beneficiary, {transaction: tx});
                  }
                  await tx.commit();
                  file.current_row = fileCount;
                  file.status = "completed";
                  this.fileRepository.updateById(file.ID, file);
                }
                else {
                  tx.rollback();
                  file.error = JSON.stringify(JSONError);
                  file.status = "error"
                  file.current_row = fileCount;
                  this.fileRepository.updateById(file.ID, file);
                  log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.ERROR, tag: file.ID, event: Actions.ERROR, description: `Error while loading file ${file.ID}. Go to the file error for more information`});
                  this.logRepository.create(log);
                }
              } catch (err) {
                log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.ERROR, tag: file.ID, event: Actions.ERROR, description: `Error while loading file ${file.ID}. Go to the application console for more information`});
                this.logRepository.create(log);
                let JSONError = JSON.parse(file.error || '[]');
                JSONError.push({"type": "error", "title": "error", "description": `Unexpected error has occurred, please contact the administrator`});
                file.error = JSON.stringify(JSONError);
                file.status = "error"
                this.fileRepository.updateById(file.ID, file);
                console.error(err);
              }
            });
          }
          else if (request.body.type == "BDA-AM") {
            FileController.getCSVElements(uploadFile, file).then(async (beneficiaries: Array<AM>) => {
              try {
                file.total_rows = beneficiaries.length;
                this.fileRepository.updateById(file.ID, file);
                let error = false;
                let JSONError = JSON.parse(file.error || '[]');
                let beneficiariesToUpdate: Beneficiary[] = [];
                for await (let b of beneficiaries) {
                  let dataBaseBeneficiary = await this.beneficiaryRepository.findOne({fields: {ID: true, alert: true}, where: {national_id_number: b.NationalID}});
                  if (dataBaseBeneficiary) {
                    let beneficiary = new Beneficiary;
                    beneficiary.ID = dataBaseBeneficiary.ID;
                    beneficiary.am_status = b.AMStatus;
                    beneficiary.updated = new Date();
                    if (b.AMStatus == 0) {
                      let JSONAlert = JSON.parse(dataBaseBeneficiary.alert || '[]')
                      JSONAlert.push({"type": "warning", "title": "Alert", "description": "AM Status is 0"});
                      beneficiary.alert = JSON.stringify(JSONAlert);
                    }
                    beneficiariesToUpdate.push(beneficiary);
                  }
                  else {
                    JSONError.push({"type": "warning", "title": "Alert", "description": `Beneficiary with national_id ${b.NationalID} not found, line ${fileCount + 2}`});
                    error = true;
                    errorCount = errorCount + 1;
                  }
                  if (fileCountInterval == fileInterval) {
                    file.current_row = fileCount;
                    this.fileRepository.updateById(file.ID, file);
                    fileCountInterval = 0;
                  }
                  if (errorCount > errorLimit) {
                    break;
                  }
                  fileCount++;
                  fileCountInterval++;
                }
                const tx: Transaction = await this.beneficiaryRepository.beginTransaction(IsolationLevel.READ_COMMITTED);
                if (!error) {
                  for await (let beneficiary of beneficiariesToUpdate) {
                    await this.beneficiaryRepository.updateById(beneficiary.ID, beneficiary, {transaction: tx});
                  }
                  await tx.commit();
                  file.current_row = fileCount;
                  file.status = "completed";
                  this.fileRepository.updateById(file.ID, file);
                }
                else {
                  tx.rollback();
                  file.error = JSON.stringify(JSONError);
                  file.status = "error"
                  file.current_row = fileCount;
                  this.fileRepository.updateById(file.ID, file);
                  log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.ERROR, tag: file.ID, event: Actions.ERROR, description: `Error while loading file ${file.ID}. Go to the file error for more information`});
                  this.logRepository.create(log);
                }
              } catch (err) {
                log = new Log({ID: uuidv4(), user: request.userInfo?.id, created: new Date(), type: Actions.ERROR, tag: file.ID, event: Actions.ERROR, description: `Error while loading file ${file.ID}. Go to the application console for more information`});
                this.logRepository.create(log);
                let JSONError = JSON.parse(file.error || '[]');
                JSONError.push({"type": "error", "title": "error", "description": `Unexpected error has occurred, please contact the administrator`});
                file.error = JSON.stringify(JSONError);
                file.status = "error"
                this.fileRepository.updateById(file.ID, file);
                console.error(err);
              }
            });
          } else if (request.body.type == "FM") {
            FileController.getCSVElements(uploadFile, file).then(async (familyGroupMembers: Array<FamilyMember>) => {
              try {
                file.total_rows = familyGroupMembers.length;
                this.fileRepository.updateById(file.ID, file);
                let familyGroupMembersToSave: FamilyGroupMember[] = [];
                let familyGroupMembersToUpdate: FamilyGroupMember[] = [];
                for await (let fgm of familyGroupMembers) {
                  let familyGroupMember = new FamilyGroupMember
                  familyGroupMember.last_name_1 = fgm.LastName1;
                  familyGroupMember.last_name_2 = fgm.LastName2;
                  familyGroupMember.first_name = fgm.FirstName;
                  familyGroupMember.middle_name = fgm.MiddleName;
                  familyGroupMember.gender = fgm.Gender;
                  familyGroupMember.national_id_type = fgm.NationalIDType;
                  familyGroupMember.marital_status = fgm.MaritalStatus;
                  familyGroupMember.relationship = fgm.Relationship;
                  familyGroupMember.add_income = fgm.AddIncome;
                  familyGroupMember.education_level = fgm.EducationLevel;
                  familyGroupMember.health_insurance = fgm.HealthInsurance;
                  familyGroupMember.special_needs = fgm.SpecialNeeds;
                  familyGroupMember.handicap = fgm.Handicap;
                  familyGroupMember.national_id_number = fgm.NationalID;

                  let dataBaseBeneficiary = await this.beneficiaryRepository.findOne({fields: {ID: true}, where: {national_id_number: fgm.BeneficiaryNationalID}});
                  if (dataBaseBeneficiary) {
                    familyGroupMember.beneficiary = dataBaseBeneficiary.ID;
                  }
                  let dataBaseFamilyGroup = await this.familyGroupMemberRepository.findOne({fields: {ID: true}, where: {national_id_number: fgm.NationalID}});
                  if (!dataBaseFamilyGroup) {
                    familyGroupMember.ID = uuidv4();
                    familyGroupMembersToSave.push(familyGroupMember);
                  }
                  else {
                    familyGroupMember.ID = dataBaseFamilyGroup.ID;
                    familyGroupMembersToUpdate.push(familyGroupMember);
                  }
                  if (fileCountInterval == fileInterval) {
                    file.current_row = fileCount;
                    this.fileRepository.updateById(file.ID, file);
                    fileCountInterval = 0;
                  }
                  fileCount++;
                  fileCountInterval++;
                }
                const tx: Transaction = await this.beneficiaryRepository.beginTransaction(IsolationLevel.READ_COMMITTED);
                for (let familyGroupMember of familyGroupMembersToUpdate) {
                  await this.familyGroupMemberRepository.replaceById(familyGroupMember.ID, familyGroupMember, {transaction: tx});
                }
                for (let familyGroupMember of familyGroupMembersToSave) {
                  await this.familyGroupMemberRepository.create(familyGroupMember, {transaction: tx});
                }
                await tx.commit();
                file.current_row = fileCount;
                file.status = "completed";
                this.fileRepository.updateById(file.ID, file);
              } catch (err) {
                log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.ERROR, tag: file.ID, event: Actions.ERROR, description: `Error while loading file ${file.ID}. Go to the application console for more information`});
                this.logRepository.create(log);
                let JSONError = JSON.parse(file.error || '[]');
                JSONError.push({"type": "error", "title": "error", "description": `Unexpected error has occurred, please contact the administrator`});
                file.error = JSON.stringify(JSONError);
                file.status = "error"
                file.current_row = fileCount;
                this.fileRepository.updateById(file.ID, file);
                console.error(err);
              }
            });
          }
        }
        else {
          reject();
        }
      });
    });
  }




  @post('/download/banks')
  @response(200, {
    description: 'Download amount  per beneficiary',
    content: {'application/json': {schema: CountSchema}},
  })
  async downloadBanks(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody() body: any) {
    let startDate = moment(this.request.body.startDate, Formats.LATAM_DATE_FORMAT).format(Formats.US_DATE_FORMAT);
    let finishDate = moment(this.request.body.finishDate, Formats.LATAM_DATE_FORMAT).format(Formats.US_DATE_FORMAT);
    let bank_code = this.request.body.bankCode;
    let beneficiaries: any;
    if (this.request.body.limit) {
      beneficiaries = await this.paymentRepository.dataSource.execute(`SELECT b.id, b.account_number, b.bank_code, b.first_name, b.middle_name,b.last_name_1,b.last_name_2,  b.national_id_number, b.national_id_type, p.amount, p.period FROM public.beneficiary b inner join payment p ON  b.id = p.beneficiary where p.bank_code = $1 and p.created >= $2 and p.created <= $3 limit $4 `, [bank_code, startDate, finishDate, this.request.body.limit]).then((databaseBeneficiaries: Array<number>) => {
        return databaseBeneficiaries;
      });
    }
    else {
      beneficiaries = await this.paymentRepository.dataSource.execute(`SELECT b.id, b.account_number, b.bank_code, b.first_name, b.middle_name,b.last_name_1,b.last_name_2,  b.national_id_number, b.national_id_type, p.amount, p.period FROM public.beneficiary b inner join payment p ON  b.id = p.beneficiary where p.bank_code = $1 and p.created >= $2 and p.created <= $3 `, [bank_code, startDate, finishDate]).then((databaseBeneficiaries: Array<number>) => {
        return databaseBeneficiaries;
      });
    }
    let filename = `IB${bank_code}${dateFormat(new Date(), 'mmddyy')}.csv`
    const csvWriter = createCsvWriter({
      path: filename,
      header: [
        {id: 'account_number', title: 'Numero de Cuenta Banco'},
        {id: 'bank_code', title: 'Codigo Identificación Banco'},
        {id: 'national_id_type', title: 'Nacionalidad de la clienta'},
        {id: 'national_id_number', title: 'Cedula de identidad de la clienta'},
        {id: 'first_name', title: 'Primer Nombre'},
        {id: 'middle_name', title: 'Segundo Nombre'},
        {id: 'last_name_1', title: 'Primer Apellido'},
        {id: 'last_name_2', title: 'Segundo Apellido'},
        {id: 'amount', title: 'Monto a Abonar'},
        {id: 'period', title: 'Periodo'},
      ]
    });


    await csvWriter.writeRecords(beneficiaries);
    response.download(filename, filename, function (err) {
      if (err) {
        console.log(err);
      }
      fs.unlinkSync(filename);
    });
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.DOWNLOAD, event: Actions.DOWNLOAD, description: `The Beneficiary with the email ${this.request.userInfo?.email} has downladed the file`})
    this.logRepository.create(log);
    return response;
  }

  @post('/download/centralbank')
  @response(200, {
    description: 'Download transfers per bank',
    content: {'application/json': {schema: CountSchema}},
  })
  async downloadCentralBank(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody() body: any) {
    let startDate = moment(this.request.body.startDate, Formats.LATAM_DATE_FORMAT).format(Formats.US_DATE_FORMAT);
    let finishDate = moment(this.request.body.finishDate, Formats.LATAM_DATE_FORMAT).format(Formats.US_DATE_FORMAT);
    let banks: any = await this.paymentRepository.dataSource.execute(`SELECT sum (amount) amount,bank_code FROM payment where  created >= $1 and created <= $2 GROUP BY bank_code`, [startDate, finishDate]).then((databaseBanks: Array<number>) => {
      return databaseBanks;
    });
    let filename = `IB${dateFormat(new Date(), 'mmddyy')}.csv`
    const csvWriter = createCsvWriter({
      path: filename,
      header: [{id: 'bank_code', title: 'Código Identificación Banco'},
      {id: 'amount', title: 'Monto a Abonar'}]
    });

    let records = []
    for await (let b of banks) {
      let record = {
        bank_code: b.bank_code,
        amount: b.amount
      };
      records.push(record);
    }

    await csvWriter.writeRecords(records);
    response.download(filename, filename, function (err) {
      if (err) {
        console.log(err);
      }
      fs.unlinkSync(filename);
    });
    let log = new Log({ID: uuidv4(), user: this.request.userInfo?.email, created: new Date(), type: Actions.DOWNLOAD, event: Actions.DOWNLOAD, description: `The Beneficiary with the email ${this.request.userInfo?.email} has downladed the file`})
    this.logRepository.create(log);
    return response;
  }


  @get('/files/count')
  @response(200, {
    description: 'File model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(File) where?: Where<File>,
  ): Promise<Count> {
    return this.fileRepository.count(where);
  }

  @get('/files')
  @response(200, {
    description: 'Array of File model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(File, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(File) filter?: Filter<File>,
  ): Promise<File[]> {
    return this.fileRepository.find(filter);
  }

  @patch('/files')
  @response(200, {
    description: 'File PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(File, {partial: true}),
        },
      },
    })
    file: File,
    @param.where(File) where?: Where<File>,
  ): Promise<Count> {
    return this.fileRepository.updateAll(file, where);
  }

  @get('/files/{id}')
  @response(200, {
    description: 'File model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(File, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(File, {exclude: 'where'}) filter?: FilterExcludingWhere<File>
  ): Promise<File> {
    return this.fileRepository.findById(id, filter);
  }

  @patch('/files/{id}')
  @response(204, {
    description: 'File PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(File, {partial: true}),
        },
      },
    })
    file: File,
  ): Promise<void> {
    await this.fileRepository.updateById(id, file);
  }

  @put('/files/{id}')
  @response(204, {
    description: 'File PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() file: File,
  ): Promise<void> {
    await this.fileRepository.replaceById(id, file);
  }

  @del('/files/{id}')
  @response(204, {
    description: 'File DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.fileRepository.deleteById(id);
  }

  private static async getCSVElements(inputFile: Express.Multer.File, file: File) {
    return new Promise<any>(resolve => {
      let csvBuffer = Buffer.alloc(inputFile.size, inputFile.buffer, 'base64');
      file.metadata = JSON.stringify({"encoding": inputFile.encoding, "fieldname": inputFile.fieldname, "mimetype": inputFile.mimetype, "originalname": inputFile.originalname, "size": inputFile.size});
      const fileName = inputFile.originalname
      file.file_name = fileName;
      fs.writeFileSync(fileName, csvBuffer);

      var csvData: any[] = [];
      //@ts-ignore
      fs.createReadStream(fileName).pipe(csv.parse({columns: true, delimiter: ',', trim: true}))
        .on('data', function (csvrow: any) {
          csvData.push(csvrow);
        })
        .on('end', function () {
          fs.unlinkSync(fileName)
          resolve(csvData);
        }).on('error', function (err: Error) {
          console.log(err);
          return new Array<string>();
        });
    });
  }

}
