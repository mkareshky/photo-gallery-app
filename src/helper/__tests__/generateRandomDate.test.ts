import generateRandomDate from '../generateRandomDate';

describe('generateRandomDate', () => {
  test('returns a valid ISO date string', () => {
    const dateStr = generateRandomDate();
    expect(() => new Date(dateStr)).not.toThrow();
    expect(new Date(dateStr).toISOString()).toBe(dateStr);
  });

  test('generates a date between Jan 1, 2020 and now', () => {
    const dateStr = generateRandomDate();
    const date = new Date(dateStr);
    const startDate = new Date(2020, 0, 1);
    const currentDate = new Date();

    expect(date.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
    expect(date.getTime()).toBeLessThanOrEqual(currentDate.getTime());
  });

  test('generates unique dates on multiple calls', () => {
    const dates = new Set();

    for (let i = 0; i < 10; i++) {
      dates.add(generateRandomDate());
    }

    expect(dates.size).toBeGreaterThan(1); // Ensure randomness
  });
});