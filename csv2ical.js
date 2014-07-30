#!/usr/bin/env node

// Usage : node csv2ical.js -i <input csv file> -o <output ics file> -d <delimiter char>

var argv = require('yargs')
  .usage('Usage: csv2ical.js -i [csv] -o [ics] -d [delimiter] -H')
  .default('d', ",")
  .default('H', false)
  .default('rows', ["0", "1", "2", "3", "4"])
  .demand(['i','o'])
  .describe('i', 'Input CSV file')
  .describe('o', 'Output ICS file')
  .describe('d', 'If your data uses an alternate delimiter such as ";"')
  .describe('H', 'To set if the first line of your CSV contain headers')
  .describe('rows', 'Row numbers for "Subject","Start Date","End Date" ... : --rows={0,1,2,3}')
  .describe('dateformat', 'Date format 31/07/2014 03:00 : --dateformat="DD-MM-YYYY HH:mm"')
  .example('csv2ical.js -i query_semicolon.csv -o test.ics -d ";" -H', '')
  .argv;

//console.log(argv);
//console.log(argv.rows[2]);

// Init iCal
var ical = require('ical-generator'),
    cal = ical();

cal.setProdID({
    company: 'My Company',
    product: 'My Product',
    language: 'EN'
});
cal.setDomain('mycompany.com').setName('My Calendar');

// Init moment
var moment = require('moment');

// Init CSV
var csv = require("fast-csv");
var fs = require('fs');
var stream = fs.createReadStream(argv.i);

csv
 .fromStream(stream, {headers : argv.H, delimiter: argv.d})
 .on("record", function (data){

  // "Subject","Start Date","End Date","Description"
	//console.log(data);
  console.log("Subject : "     + data[Object.keys(data)[argv.rows[0]]]); // Subject
  console.log("Start Date : "  + data[Object.keys(data)[argv.rows[1]]]); // Start Date
	console.log("End Date : "    + data[Object.keys(data)[argv.rows[2]]]); // End Date
	console.log("Description : " + data[Object.keys(data)[argv.rows[3]]]); // Description
  console.log("Location : "    + data[Object.keys(data)[argv.rows[4]]]); // Description
  console.log("-------------");

	var startdate = moment(data[Object.keys(data)[argv.rows[1]]], argv.dateformat);
	var enddate   = moment(data[Object.keys(data)[argv.rows[2]]], argv.dateformat) ;

	console.log(startdate.isValid());
	console.log(enddate.isValid());


	if(startdate.isValid() && enddate.isValid())
	{
		cal.addEvent({
			start: new Date(startdate.toISOString()),
			end: new Date(enddate.toISOString()),
			summary: data[Object.keys(data)[argv.rows[0]]],
			description: data[Object.keys(data)[argv.rows[3]]],
			location: data[Object.keys(data)[argv.rows[4]]],
			url: 'http://mycompany.com/'
		});
	}

 })
 .on("end", function(){
   console.log(" Saving to file : " + argv.o);
	 cal.saveSync(argv.o);

 });
