#!/usr/bin/env node

import { createReadStream, writeFileSync } from 'fs';
import { parse } from 'csv-parse';
import ical, { ICalCalendar, ICalEventData } from 'ical-generator';
import winston from 'winston';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

interface CSVRow {
  [key: string]: string;
}

interface ParsedArguments {
  i: string;
  o: string;
  d: string;
  H: boolean;
  rows: string[];
  dateformat?: string;
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

const argv = yargs(hideBin(process.argv))
  .usage('Usage: csv2ical -i [csv] -o [ics] -d [delimiter] -H')
  .option('i', {
    alias: 'input',
    describe: 'Input CSV file',
    type: 'string',
    demandOption: true,
  })
  .option('o', {
    alias: 'output',
    describe: 'Output ICS file',
    type: 'string',
    demandOption: true,
  })
  .option('d', {
    alias: 'delimiter',
    describe: 'If your data uses an alternate delimiter such as ";"',
    type: 'string',
    default: ',',
  })
  .option('H', {
    alias: 'headers',
    describe: 'To set if the first line of your CSV contain headers',
    type: 'boolean',
    default: false,
  })
  .option('rows', {
    describe:
      'Row numbers for "Subject","Start Date","End Date" ... : --rows=0,1,2,3,4',
    type: 'array',
    default: ['0', '1', '2', '3', '4'],
  })
  .option('dateformat', {
    describe: 'Date format 31/07/2014 03:00 : --dateformat="DD/MM/YYYY HH:mm"',
    type: 'string',
  })
  .example(
    'csv2ical -i sample.csv -o sample.ics -d ";" -H',
    'Convert CSV with semicolon delimiter and headers'
  )
  .help()
  .parseSync() as ParsedArguments;

const cal: ICalCalendar = ical({
  prodId: {
    company: 'csv2ical',
    product: 'csv2ical',
    language: 'EN',
  },
  name: 'CSV2iCal Calendar',
});

const stream = createReadStream(argv.i);
const parser = parse({
  delimiter: argv.d,
  columns: argv.H,
  skip_empty_lines: true,
  trim: true,
});

let eventCount = 0;

parser.on('data', (data: CSVRow | string[]) => {
  try {
    const rowIndices = argv.rows.map((r) => parseInt(r, 10));

    let subject: string;
    let startDateStr: string;
    let endDateStr: string;
    let description: string;
    let location: string;

    if (Array.isArray(data)) {
      subject = data[rowIndices[0]] || '';
      startDateStr = data[rowIndices[1]] || '';
      endDateStr = data[rowIndices[2]] || '';
      description = data[rowIndices[3]] || '';
      location = data[rowIndices[4]] || '';
    } else {
      const keys = Object.keys(data);
      const subjectKey = keys[rowIndices[0]];
      const startDateKey = keys[rowIndices[1]];
      const endDateKey = keys[rowIndices[2]];
      const descriptionKey = keys[rowIndices[3]];
      const locationKey = keys[rowIndices[4]];

      subject = data[subjectKey] || '';
      startDateStr = data[startDateKey] || '';
      endDateStr = data[endDateKey] || '';
      description = data[descriptionKey] || '';
      location = data[locationKey] || '';
    }

    if (!startDateStr || !startDateStr.match(/^[0-9]/)) {
      return;
    }

    logger.info(`Subject: ${subject}`);
    logger.info(`Start Date: ${startDateStr}`);
    logger.info(`End Date: ${endDateStr}`);
    logger.info(`Description: ${description}`);
    logger.info(`Location: ${location}`);
    logger.info('-------------');

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      logger.warn(`Invalid date format for event: ${subject}`);
      return;
    }

    const eventData: ICalEventData = {
      start: startDate,
      end: endDate,
      summary: subject,
      description: description || '',
      location: location || '',
    };

    cal.createEvent(eventData);
    eventCount++;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error processing row: ${error.message}`);
    }
  }
});

parser.on('end', () => {
  logger.info(`Processed ${eventCount} events`);
  logger.info(`Saving to file: ${argv.o}`);

  try {
    writeFileSync(argv.o, cal.toString());
    logger.info('Successfully saved calendar file');
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error saving file: ${error.message}`);
      process.exit(1);
    }
  }
});

parser.on('error', (error: Error) => {
  logger.error(`CSV parsing error: ${error.message}`);
  process.exit(1);
});

stream.on('error', (error: Error) => {
  logger.error(`File reading error: ${error.message}`);
  process.exit(1);
});

stream.pipe(parser);
