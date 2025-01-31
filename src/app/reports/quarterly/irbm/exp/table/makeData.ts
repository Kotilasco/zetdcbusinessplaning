import { faker } from '@faker-js/faker'

export type Expenditure = {
  budget_component: string
  original_budget: number
  adjustments: number
  revised_budget: number
  expenditure_this_month: number
  cumulative_expenditure: number
  balance: number
}

const range = (len: number) => {
  const arr: number[] = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}
const budget_components = [
  'Operational Expenditure (Recurrent Expenditure)-OE:',
  'Operational Expenditure (OE) - Retained Revenue',
  'Operational Expenditure (OE) - Other sources of funding',
  'Capital expenditure -',
  'Capital expenditure - Retained Revenue',
  'Capital expenditure – Other sources of funding',
  'Total'
];

const newPerson = (component: string): Expenditure => {
  return {
    budget_component: component,
    original_budget: parseFloat(faker.finance.amount({
      max: 1000000000,
      min: 10000,
    })),
    adjustments: 0,
    revised_budget: faker.number.int(1000),
    expenditure_this_month: parseFloat(faker.finance.amount({
      max: 10000000,
      min: 10000,
    })),
    cumulative_expenditure: parseFloat(faker.finance.amount({
      max: 10000000000,
      min: 10000,
    })),
    balance: parseFloat(faker.finance.amount({
      max: 1000000000000,
      min: 10000,
    })),
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Expenditure[] => {
    const len = lens[depth] || budget_components.length;
    return budget_components.slice(0, len).map((component): Expenditure => {
      return newPerson(component);
    });
  };

  return makeDataLevel();
}

/* export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Expenditure[] => {
    const len = lens[depth]!
    return range(len).map((d): Expenditure => {
      return newPerson()
    })
  }

  return makeDataLevel()
} */
