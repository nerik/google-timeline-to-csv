#!/usr/bin/env node

/* eslint-env node, es6 */

var fs = require("fs");
var path = require("path");
var xmldoc = require('xmldoc');
var json2csv = require('json2csv');
var moment = require('moment');

var dir = process.argv[2];
var files = fs.readdirSync(dir);
var fileRegex = /^history-([\d-]+)\.kml$/i;

var points = [];
files.filter(file => {
  return fileRegex.test(file);
}).forEach(file => {
  var xmlFile = fs.readFileSync(path.join(dir, file), "utf8");
  var xmlDocument = new xmldoc.XmlDocument(xmlFile);

  var track = xmlDocument.descendantWithPath("Document.Placemark.gx:Track").children;

  for (var i = 0; i < track.length; i++) {
    var when = track[i];
    if (when.name === "when") {
      var coord = track[i+1];
      var lonlat = coord.val.split(" ");
      points.push({
        when: moment(when.val).format(),
        latitude: lonlat[1],
        longitude: lonlat[0],
      })
    }
  }
});

json2csv({ data: points }, function(err, csv) {
  if (err) console.log(err);
  console.log(csv);
});
