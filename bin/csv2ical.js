#!/usr/bin/env node

/**
 * Usage : node csv2ical -i <input csv file> -o <output ics file> -d <delimiter char>
 */

/**
 * Dependencies
 */
const log = require('winston');
const moment = require('moment');
const csv = require('csv-parse');
const ical = require('ical-generator');
const fs = require('fs');
const argv = require('yargs')
  .usage('Usage: csv2ical -i [csv] -o [ics] -d [delimiter] -H')
  .default('d', ',')
  .default('H', false).default('rows', ['0', '1', '2', '3', '4'])
  .demand(['i', 'o'])
  .describe('i', 'Input CSV file')
  .describe('o', 'Output ICS file')
  .describe('d', 'If your data uses an alternate delimiter such as ";"')
  .describe('H', 'To set if the first line of your CSV contain headers')
  .describe('rows', 'Row numbers for "Subject","Start Date","End Date" ... : --rows={0,1,2,3,4}')
  .describe('dateformat', 'Date format 31/07/2014 03:00 : --dateformat="DD-MM-YYYY HH:mm"')
  .example('csv2ical -i sample.csv -o sample.ics', '-d "," -H ')
  .argv;

/**
 * Init Stuff
 */
const stream = fs.createReadStream(argv.i);
// const log = new winston.Logger();
const cal = ical.default();

// ToDo reading ProdID from args or config file
cal.prodId({
  company: 'My Company',
  product: 'My Product',
  language: 'EN',
});
cal.name('My Calendar');

/**
* Parse CSV file and convert to ical events
*/
const parser = csv
  .parse({ from_line: 1, columns: true })
  .on('data', (data) => {
    /**
    * Only process data if StartDate starts with a number
    */
    if (data[Object.keys(data)[argv.rows[1]]].match(/^[1-9]/)) {
      // "Subject","Start Date","End Date","Description"
      // console.log(data);
      log.info(`Subject : ${data[Object.keys(data)[argv.rows[0]]]}`); // Subject
      log.info(`Start Date : ${data[Object.keys(data)[argv.rows[1]]]}`); // Start Date
      log.info(`End Date : ${data[Object.keys(data)[argv.rows[2]]]}`); // End Date
      log.info(`Description : ${data[Object.keys(data)[argv.rows[3]]]}`); // Description
      log.info(`Location : ${data[Object.keys(data)[argv.rows[4]]]}`); // Location
      log.info('-------------');

      const startdate = moment(data[Object.keys(data)[argv.rows[1]]], argv.dateformat);
      const enddate = moment(data[Object.keys(data)[argv.rows[2]]], argv.dateformat);

      if (startdate.isValid() && enddate.isValid()) {
        cal.createEvent({
          start: new Date(startdate.toISOString()),
          end: new Date(enddate.toISOString()),
          summary: data[Object.keys(data)[argv.rows[0]]],
          description: data[Object.keys(data)[argv.rows[3]]],
          location: data[Object.keys(data)[argv.rows[4]]],
        });
      }
    } else {
      log.error('Are you using headers in your CSV file, if so you need to use -H option');
    }
  })
  .on('end', () => {
    log.info(`Saving to file : ${argv.o}`);
    cal.saveSync(argv.o);
  });

stream.pipe(parser);