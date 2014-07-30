### csv2ical.js

Quick and dirty CSV to iCal convertor

**Usage :**
```
Usage: csv2ical.js -i [csv] -o [ics] -d [delimiter] -H

Examples:
  csv2ical.js -i query_semicolon.csv -o test.ics -d ";" -H


Options:
  -i            Input CSV file                                                              [required]
  -o            Output ICS file                                                             [required]
  -d            If your data uses an alternate delimiter such as ";"                        [default: ","]
  -H            To set if the first line of your CSV contain headers                        [default: false]
  --rows        Row numbers for "Subject","Start Date","End Date" ... : --rows={0,1,2,3,4}  [default: 0,1,2,3,4]
  --dateformat  Date format 31/07/2014 03:00 : --dateformat="DD-MM-YYYY HH:mm"
```

**Sample CSV file**
```
"Subject","Start Date","End Date","Description","Location"
"Darth Vader birthday","2014-07-30 18:00","2014-07-31 03:00","Super Big party","Death star"
"C3PO birthday","2014-08-01 16:00","2014-08-01 18:00","Super Big party","Tatooine"
"R2D2 birthday","2014-08-24 09:00","2014-08-24 23:00","Super Big party","Coruscant"
```

**Example :**
```
./csv2ical.js -i sample.csv -o sample.ics -H
Subject : Darth Vader birthday
Start Date : 2014-07-30 18:00
End Date : 2014-07-31 03:00
Description : Super Big party
Location : Death star
-------------
Subject : C3PO birthday
Start Date : 2014-08-01 16:00
End Date : 2014-08-01 18:00
Description : Super Big party
Location : Tatooine
-------------
Subject : R2D2 birthday
Start Date : 2014-08-24 09:00
End Date : 2014-08-24 23:00
Description : Super Big party
Location : Coruscant
-------------
Saving to file : sample.ics
```
