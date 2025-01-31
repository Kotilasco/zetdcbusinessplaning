import { faker } from '@faker-js/faker'

export type Expenditure = {
  staff_category: string
  approved_estab: number
  strength_m: number
  strength_f: number
  total: number
  percentage_in_place: number
  variance: number
}

const range = (len: number) => {
  const arr: number[] = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}
const budget_components = [
  'Executive Management',
  'Senior Management (D5 and above)',
  'Middle Management (D3-D4)',
  'Professional/ Supervisory (C4 - D2)',
  'Skilled/Junior Supervisory (C1 - C3)',
  'Semi-Skilled Staff(B1 - B5)',
  'General Worker (A1 - A3)',
];

const newPerson = (component: string): Expenditure => {
  const strength_m = faker.number.int(300);
  const strength_f = faker.number.int(300);
  const approved = faker.number.int(1000);
  const total = strength_m + strength_f;
  const percentage_in_place = Math.round((total / approved) * 100);
  const variance = total - approved;
  return {
    staff_category: component,
    approved_estab: approved,
    strength_m: strength_m,
    strength_f: strength_f,
    total: total,
    percentage_in_place: percentage_in_place,
    variance: variance,
  };
};

export function makeData(...lens: number[]): { data: Expenditure[], grandTotals: { approved_estab: number, strength_m: number, strength_f: number, total: number, percentage_in_place: number, variance: number } } {
  const makeDataLevel = (depth = 0): Expenditure[] => {
    const len = Math.min(lens[depth]!, budget_components.length);
    return range(len).map((d): Expenditure => {
      return newPerson(budget_components[d]);
    });
  };

  const data = makeDataLevel();
  const grandTotals = {
    approved_estab: data.reduce((sum, item) => sum + item.approved_estab, 0),
    strength_m: data.reduce((sum, item) => sum + item.strength_m, 0),
    strength_f: data.reduce((sum, item) => sum + item.strength_f, 0),
    total: data.reduce((sum, item) => sum + item.total, 0),
    percentage_in_place: data.reduce((sum, item) => sum + item.percentage_in_place, 0),
    variance: data.reduce((sum, item) => sum + item.variance, 0),
  };

  return { data, grandTotals };
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
