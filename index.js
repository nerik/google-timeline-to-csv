#!/usr/bin/env node

/* eslint-env node, es6 */

var fs = require("fs");
var path = require("path");
var xmldoc = require('xmldoc');
var json2csv = require('json2csv');
var moment = require('moment');

var inputPath = process.argv[2];

var isDir = fs.statSync(inputPath).isDirectory();
var files;

if (isDir) {
  var fileRegex = /^history-([\d-]+)\.kml$/i;
  files = fs.readdirSync(inputPath).filter(file => {
    return fileRegex.test(file);
  })
} else {
  files = [inputPath];
}

var points = [];

files.forEach(file => {
  var filePath = (isDir) ? path.join(inputPath, file) : file;
  var fileContents = fs.readFileSync(filePath, "utf8");

  if (path.extname(filePath) === '.json') {
    points = points.concat(jsonToPoints(fileContents));
  } else {
    points = points.concat(xmlToPoints(fileContents));
  }

});

pointsToCsv(points, csv => {
  console.log(csv);
})

function xmlToPoints(fileContents) {
  var xmlDocument = new xmldoc.XmlDocument(fileContents);

  var track = xmlDocument.descendantWithPath("Document.Placemark.gx:Track").children;

  var filePoints = [];

  for (var i = 0; i < track.length; i++) {
    var when = track[i];
    if (when.name === "when") {
      var coord = track[i+1];
      var lonlat = coord.val.split(" ");
      filePoints.push({
        time: moment.utc(when.val).format(), //drop timezone info
        latitude: lonlat[1],
        longitude: lonlat[0],
      })
    }
  }

  return filePoints;
}

function jsonToPoints(fileContents) {

  function toDate(ts) {
    return moment(parseInt(ts, 10)).format()
  }

  var filePoints = [
    //headers. json2csv is not able to figure out absent cols on 1st row
    {
      time: null,
      accuracy: null,
      latitude: null,
      longitude: null,
      unknown: null,
      still: null,
      walking: null,
      tilting: null,
      inVehicle: null,
      onFoot: null,
      onBicycle: null,
    }
  ];

  var locations = JSON.parse(fileContents).locations;

  for (var i = 0; i < locations.length; i++) {
  // for (var i = 0; i < 100; i++) {
    var location = locations[i];

    var srcPt = {
      time: toDate(location.timestampMs),
      accuracy: location.accuracy,
      latitude: location.latitudeE7/10000000,
      longitude: location.longitudeE7/10000000
    }

    if (location.activitys === undefined) {
      filePoints.push(srcPt);
    } else {
      var activitys = location.activitys;
      for (var j = 0; j < activitys.length; j++) {
        var activity = activitys[j];
        // console.log(activity)

        var pt = Object.assign(srcPt, {
          time: toDate(activity.timestampMs)
        });

        var activities = activity.activities;

        for (var k = 0; k < activities.length; k++) {
          var activitiKey = activities[k].type;
          var activitiValue = activities[k].confidence;
          // console.log(activitiKey)
          pt[activitiKey] = activitiValue;
        }

        filePoints.push(pt);
        // console.log(pt);
      }
    }

  }

  return filePoints;
}

function pointsToCsv(points, cb) {
  json2csv({ data: points }, function(err, csv) {
    if (err) {
      console.log(err);
    }
    else {
      cb(csv);
    }
  });
}
