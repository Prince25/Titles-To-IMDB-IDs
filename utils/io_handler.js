const csv = require('csv-writer');
const fs = require('fs');


// Reads the given txt file and returns an array of items
function readTxtFile(fileName) {
    let data = fs.readFileSync(fileName, "utf-8")
        .replace(/\r\n/g, '\n')
        .split("\n")
        .filter(x => x);
    console.log(fileName + ' successfully processed! Read ' + data.length + ' items.');
    return data;
}


// Writes the given data to a csv file
// fileName: the name of the file to write to
// data: an array of objects
// headers: an array of objects with id and title properties
function writeCSV(fileName, data, header) {
    return new Promise(async resolve => {
        const createCsvWriter = csv.createObjectCsvWriter;
        const csvWriter = createCsvWriter({
            path: fileName + '.csv',
            header: header
        });

        await csvWriter.writeRecords(data)
        console.log('The CSV file, ' + fileName + '.csv, was written successfully')
        resolve();
    })
}


module.exports = {
    readTxtFile,
    writeCSV
}
