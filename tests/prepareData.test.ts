import { prepareData } from '../build/index.js';
// import { prepareData } from '../src/prepareData';
import testInput from './input.json';
import expectedOutput from './output.json';
import { RawEntity } from '../src/raw-types';
import { HeatMap, LeadersData, VoteData, ChartData, DiagramData, ActivityData, StoryData } from '../src/stories';

describe('prepareData', () => {
  const sprintId = 977;
  let output = prepareData(testInput as RawEntity[], { sprintId });

  describe('Leaders', () => {
    const expectedTemplate = expectedOutput[0].data as LeadersData;
    const template = output[0].data as LeadersData;

    it(`first slide should be "leaders"`, () => {
      expect(output[0].alias).toBe('leaders');
    });

    it(`title should be ${expectedTemplate.title}`, () => {
      expect(template.title).toBe(expectedTemplate.title);
    });

    it(`subtitle should be ${expectedTemplate.subtitle}`, () => {
      expect(template.subtitle).toBe(expectedTemplate.subtitle);
    });

    it(`emoji should be ${expectedTemplate.emoji}`, () => {
      expect(template.emoji).toBe(expectedTemplate.emoji);
    });

    describe('users', () => {
      it(`should have ${template.users.length} users`, () => {
        expect(template.users).toHaveLength(expectedTemplate.users.length);
      });

      expectedTemplate.users.forEach((user, index) => {
        it(`${index} user should be ${JSON.stringify(user)}`, () => {
          expect(template.users[index]).toEqual(user);
        });
      });
    });
  });

  describe('Vote', () => {
    const expectedTemplate = expectedOutput[1].data as VoteData;
    const template = output[1].data as VoteData;

    it(`second slide should be "vote"`, () => {
      expect(output[1].alias).toBe('vote');
    });

    it(`title should be ${expectedTemplate.title}`, () => {
      expect(template.title).toBe(expectedTemplate.title);
    });

    it(`subtitle should be ${expectedTemplate.subtitle}`, () => {
      expect(template.subtitle).toBe(expectedTemplate.subtitle);
    });

    it(`emoji should be ${expectedTemplate.emoji}`, () => {
      expect(template.emoji).toBe(expectedTemplate.emoji);
    });

    it(`should have ${template.users.length} users`, () => {
      expect(template.users).toHaveLength(expectedTemplate.users.length);
    });

    describe('users', () => {
      it(`should have ${template.users.length} users`, () => {
        expect(template.users).toHaveLength(expectedTemplate.users.length);
      });

      expectedTemplate.users.forEach((user, index) => {
        it(`${index} user should be ${JSON.stringify(user)}`, () => {
          expect(template.users[index]).toEqual(user);
        });
      });
    });
  });

  describe('Chart', () => {
    const expectedTemplate = expectedOutput[2].data as ChartData;
    const template = output[2].data as ChartData;

    it(`third slide should be "chart"`, () => {
      expect(output[2].alias).toBe('chart');
    });

    it(`title should be ${expectedTemplate.title}`, () => {
      expect(template.title).toBe(expectedTemplate.title);
    });

    it(`subtitle should be ${expectedTemplate.subtitle}`, () => {
      expect(template.subtitle).toBe(expectedTemplate.subtitle);
    });

    describe('values', () => {
      it(`should have ${template.values.length} values`, () => {
        expect(template.values).toHaveLength(expectedTemplate.values.length);
      });

      expectedTemplate.values.forEach((value, index) => {
        it(`${index} value should be ${JSON.stringify(value)}`, () => {
          expect(template.values[index]).toEqual(value);
        });
      });
    });

    describe('users', () => {
      it(`should have ${template.users.length} users`, () => {
        expect(template.users).toHaveLength(expectedTemplate.users.length);
      });

      expectedTemplate.users.forEach((user, index) => {
        it(`${index} user should be ${JSON.stringify(user)}`, () => {
          expect(template.users[index]).toEqual(user);
        });
      });
    });
  });

  describe('Diagram', () => {
    const expectedTemplate = expectedOutput[3].data as DiagramData;
    const template = output[3].data as DiagramData;

    it(`fourth slide should be "diagram"`, () => {
      expect(output[3].alias).toBe('diagram');
    });

    it(`title should be ${expectedTemplate.title}`, () => {
      expect(template.title).toBe(expectedTemplate.title);
    });

    it(`subtitle should be ${expectedTemplate.subtitle}`, () => {
      expect(template.subtitle).toBe(expectedTemplate.subtitle);
    });

    it(`totalText should be ${expectedTemplate.totalText}`, () => {
      expect(template.totalText).toBe(expectedTemplate.totalText);
    });

    it(`differenceText should be ${expectedTemplate.differenceText}`, () => {
      expect(template.differenceText).toBe(expectedTemplate.differenceText);
    });

    describe('categories', () => {
      it(`should have ${expectedTemplate.categories.length} categories`, () => {
        expect(template.categories).toHaveLength(template.categories.length);
      });

      expectedTemplate.categories.forEach((category, index) => {
        it(`${index} category should be ${JSON.stringify(category)}`, () => {
          expect(template.categories[index]).toEqual(category);
        });
      });
    });
  });

  describe('Activity', () => {
    const expectedTemplate = expectedOutput[4].data as ActivityData;
    const template = output[4].data as ActivityData;

    it(`fifth slide should be "activity"`, () => {
      expect(output[4].alias).toBe('activity');
    });

    it(`title should be ${expectedTemplate.title}`, () => {
      expect(template.title).toBe(expectedTemplate.title);
    });

    it(`subtitle should be ${expectedTemplate.subtitle}`, () => {
      expect(template.subtitle).toBe(expectedTemplate.subtitle);
    });

    describe('heat map', () => {
      const expectedHeatMap = expectedTemplate.data;
      const heatMapArray: [string, number[]][] = Object.keys(expectedHeatMap).map((day) => [
        day,
        expectedHeatMap[day as keyof HeatMap],
      ]);

      it.each(heatMapArray)(`%s should be %p`, (day: string, hoursArray: number[]) => {
        const expected = template.data[day as keyof HeatMap];
        expect(expected).toEqual(hoursArray);
      });
    });
  });
});
