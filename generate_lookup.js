const fs = require('fs');
const path = require('path');

const geojsonPath = path.resolve('public/FINAL PARBHANI MPMS.geojson');
const outputPath = path.resolve('public/qgis2web_2025_12_08-16_09_36_742787/data/mpms_lookup.js');

console.log('Reading GeoJSON...');
const rawData = fs.readFileSync(geojsonPath, 'utf8');
const data = JSON.parse(rawData);

const lookup = {};
let count = 0;

console.log('Processing features...');
data.features.forEach(feature => {
    const propNo = feature.properties.PROP_NO;
    if (propNo) {
        lookup[propNo] = feature.properties;
        count++;
    }
});

console.log(`Successfully indexed ${count} properties.`);

console.log('Generating JavaScript file...');
const jsContent = 'var mpms_lookup = ' + JSON.stringify(lookup) + ';';

fs.writeFileSync(outputPath, jsContent, 'utf8');

console.log('Done! Lookup saved to ' + outputPath);
