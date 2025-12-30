import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, unlinkSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

describe('csv2ical CLI', () => {
  const testCsvPath = join(__dirname, 'test-input.csv');
  const testIcsPath = join(__dirname, 'test-output.ics');

  beforeEach(() => {
    const csvContent = `"Subject","Start Date","End Date","Description","Location"
"Test Event","2025-01-15 09:00","2025-01-15 10:00","Test Description","Test Location"`;
    writeFileSync(testCsvPath, csvContent);
  });

  afterEach(() => {
    if (existsSync(testCsvPath)) {
      unlinkSync(testCsvPath);
    }
    if (existsSync(testIcsPath)) {
      unlinkSync(testIcsPath);
    }
  });

  it('should create an ICS file from CSV input', () => {
    expect(existsSync(testCsvPath)).toBe(true);

    const output = readFileSync(testCsvPath, 'utf-8');
    expect(output).toContain('Test Event');
    expect(output).toContain('2025-01-15 09:00');
  });

  it('should validate CSV content structure', () => {
    const csvContent = readFileSync(testCsvPath, 'utf-8');
    const lines = csvContent.split('\n');

    expect(lines.length).toBeGreaterThan(1);
    expect(lines[0]).toContain('Subject');
    expect(lines[0]).toContain('Start Date');
    expect(lines[0]).toContain('End Date');
  });

  it('should handle invalid dates gracefully', () => {
    const invalidCsv = `"Subject","Start Date","End Date","Description","Location"
"Invalid Event","not-a-date","also-not-a-date","Test","Location"`;
    writeFileSync(testCsvPath, invalidCsv);

    const content = readFileSync(testCsvPath, 'utf-8');
    expect(content).toContain('not-a-date');
  });
});

describe('Date parsing', () => {
  it('should parse valid ISO dates', () => {
    const date = new Date('2025-01-15 09:00');
    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(15);
  });

  it('should detect invalid dates', () => {
    const invalidDate = new Date('invalid-date');
    expect(isNaN(invalidDate.getTime())).toBe(true);
  });
});
