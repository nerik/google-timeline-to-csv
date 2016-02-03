# google-timeline-to-csv
Converts Google Timeline data to CSV. This allows temporal analysis of the data, with CartoDB's Torque for instance.
It can handle multiple individual day files and merge them as one CSV file, or one single Takeout KML file.
Note: this might be possible using ogr2ogr, but not out of the box AFAIK (using some KML driver). A simple customized node script seemed a faster and saner way.

[![](https://raw.githubusercontent.com/nerik/google-timeline-to-csv/master/test/screenshot.png)](https://nerik.cartodb.com/viz/ef3108ae-984e-11e5-8415-0ecd1babdde5/public_map)

[Check out the demo on CartoDB](https://nerik.cartodb.com/viz/ef3108ae-984e-11e5-8415-0ecd1babdde5/public_map).

## Usage

- Go on the [Google Timeline](https://www.google.com/maps/timeline) page

- Download the kml files for each day you need (select a day, click on the cog icon on the bottom right, choose 'Export this day to KML'), or download your whole history as a single kml file.

- clone this repo and install dependencies :
```
npm i
```

- Run the script :
```
./index.js [directory containing individual day files] > target_file.csv
./index.js [single kml file] > target_file.csv
```

- Import to CartoDB

- Have fun :)
