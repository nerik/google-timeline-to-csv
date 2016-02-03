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
  var xmlFile = fs.readFileSync(filePath, "utf8");
  var xmlDocument = new xmldoc.XmlDocument(xmlFile);

  var track = xmlDocument.descendantWithPath("Document.Placemark.gx:Track").children;

  for (var i = 0; i < track.length; i++) {
    var when = track[i];
    if (when.name === "when") {
      var coord = track[i+1];
      var lonlat = coord.val.split(" ");
      points.push({
        time: moment.utc(when.val).format(), //drop timezone info
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
