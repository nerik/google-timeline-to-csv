# google-timeline-to-csv
Converts google timeline day data files (KML) into a single CSV file.
Initial goal is to have something digestible by CartoDB's Torque.

[![](https://raw.githubusercontent.com/nerik/google-timeline-to-csv/master/test/screenshot.png)](https://nerik.cartodb.com/viz/ef3108ae-984e-11e5-8415-0ecd1babdde5/public_map)

[Check out the demo on CartoDB](https://nerik.cartodb.com/viz/ef3108ae-984e-11e5-8415-0ecd1babdde5/public_map).

## Usage

- Go on the [Google Timeline](https://www.google.com/maps/timeline) page

- Download the kml files for each day you need (select a day, click on the cog icon on the bottom right, choose 'Export this day to KML')

- clone this repo and install dependencies :
```
npm i
```

- Run the script :
```
./index.js directory_containing_kml_files > target_file.csv
```

- Upload to CartoDB or whatever.
