import { PersonIncomeDomain } from '../domain/person-income/person-income.domain';

export interface PersonIncomePort {
  createPersonIncome(personIncome: PersonIncomeDomain): Promise<void>;
  getIncomeByPersonId(personId: string): Promise<PersonIncomeDomain | null>;
  getIncomeById(incomeId: string): Promise<PersonIncomeDomain | null>;
}
