const imdbId = require('./utils/index.js');
const sleep = require('./utils/sleep.js');
const { readTxtFile, writeCSV } = require('./utils/io_handler.js');

const DELAY = 1000;				// Delay between searches in milliseconds
const OUTPUT_FILE = "imdb_ids";	// Output file name
const ERROR_FILE = "errors";	// Error file name


// Get file name from terminal argument
const args = process.argv.slice(2);
let fileName;

if (!args[0] || !args[0].endsWith(".txt")) {
	console.error("Error: please provide a txt file to extract movie or show names from.");
	process.exit(-1);
} else {
	fileName = args[0];
}


// Read movie or show names from the txt file
console.log("Reading txt file " + fileName);
let titles = readTxtFile(fileName);


// Get the IMDB ID of each movie or show, and write to CSV file
// Write error file with original movie or show title, error, and the URL attempted
const
	ID_CSV_HEADER = [
		{ id: 'title', title: 'Text File Title' },
		{ id: 'imdbTitle', title: 'IMDB Title' },
		{ id: 'id', title: 'IMDB ID' },
		{ id: 'url', title: 'IMDB URL' },
	],
	ERROR_CSV_HEADER = [
		{ id: 'title', title: 'Title' },
		{ id: 'error', title: 'Error Message' },
		{ id: 'url', title: 'Query URL' },
	],
	errorData = [],
	data = [];

console.log("\nGetting IMDB IDs...");
let count = 0;
(async () => {
	for (const title of titles) {
		try {
			const info = await imdbId(title);
			const id = info.id;
			const imdbTitle = info.imdbTitle;
			data.push({
				title,
				imdbTitle,
				id,
				url: `https://www.imdb.com/title/${id}/`
			});
		} catch (error) {
			errorData.push({
				title,
				error: error.message,
				url: `https://www.imdb.com/find?s=all&q=${encodeURIComponent(title)}`
			});
		}
		count++;
		process.stdout.write(`${count}/${titles.length} titles completed.\r`);
		await sleep(DELAY);
	}


	await writeCSV(OUTPUT_FILE, data, ID_CSV_HEADER);
	if (errorData.length != 0) await writeCSV(ERROR_FILE, errorData, ERROR_CSV_HEADER);

	console.log(`\nSuccessfully retrieved IMDB IDs of ${errorData.length == 0 ? "all" : `${data.length}/${titles.length}`} titles! See ${OUTPUT_FILE}.csv`);
	if (errorData.length != 0) console.log(`${errorData.length} titles had errors. See ${ERROR_FILE}.csv for more information.`);
})();
