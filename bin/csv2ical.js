#!/usr/bin/env node


/**
 * Usage : node csv2ical.js -i <input csv file> -o <output ics file> -d <delimiter char>
 */

/**
 * Dependencies
 */
const bunyan = require('bunyan');
const moment = require('moment');
const csv = require('fast-csv');
const ical = require('ical-generator');
const fs = require('fs');
const argv = require('yargs').usage('Usage: csv2ical.js -i [csv] -o [ics] -d [delimiter] -H').default('d', ',').default('H', false).default('rows', ['0', '1', '2', '3', '4']).demand(['i', 'o']).describe('i', 'Input CSV file').describe('o', 'Output ICS file').describe('d', 'If your data uses an alternate delimiter such as ";"').describe('H', 'To set if the first line of your CSV contain headers').describe('rows', 'Row numbers for "Subject","Start Date","End Date" ... : --rows={0,1,2,3,4}').describe('dateformat', 'Date format 31/07/2014 03:00 : --dateformat="DD-MM-YYYY HH:mm"').example('csv2ical.js -i sample.csv -o sample.ics -d ";" -H', '').argv;

/**
 * Init Stuff
 */
const stream = fs.createReadStream(argv.i);
const log = bunyan.createLogger({ name: 'csv2ical' });
const cal = ical();

log.info(argv);

cal.setProdID({
  company: 'My Company',
  product: 'My Product',
  language: 'EN'
});
cal.setDomain('mycompany.com').setName('My Calendar');

/**
* Parse CSV file and convert to ical events
*/
csv.fromStream(stream, { headers: argv.H, delimiter: argv.d }).on('record', data => {
  // "Subject","Start Date","End Date","Description"
  // console.log(data);
  // log.info(`Subject : ${data[Object.keys(data)[argv.rows[0]]]}`); // Subject
  // log.info(`Start Date : ${data[Object.keys(data)[argv.rows[1]]]}`); // Start Date
  // log.info(`End Date : ${data[Object.keys(data)[argv.rows[2]]]}`); // End Date
  // log.info(`Description : ${data[Object.keys(data)[argv.rows[3]]]}`); // Description
  // log.info(`Location : ${data[Object.keys(data)[argv.rows[4]]]}`); // Location
  log.info('-------------');

  const startdate = moment(data[Object.keys(data)[argv.rows[1]]], argv.dateformat);
  const enddate = moment(data[Object.keys(data)[argv.rows[2]]], argv.dateformat);

  if (startdate.isValid() && enddate.isValid()) {
    cal.addEvent({
      start: new Date(startdate.toISOString()),
      end: new Date(enddate.toISOString()),
      summary: data[Object.keys(data)[argv.rows[0]]],
      description: data[Object.keys(data)[argv.rows[3]]],
      location: data[Object.keys(data)[argv.rows[4]]],
      url: 'http://mycompany.com/'
    });
  }
}).on('end', () => {
  log.info(`Saving to file : ${ argv.o }`);
  cal.saveSync(argv.o);
});