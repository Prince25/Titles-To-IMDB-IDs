# Titles to IMDB IDs
Convert movie or show titles/names to IMDB IDs.

This program takes in a [text](https://en.wikipedia.org/wiki/Text_file) file (`.txt`) containing movie and show titles (one per line), queries [IMDB](https://www.imdb.com/) search to get their IMDB IDs, and saves results to a [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) file (`.csv`).

### Inspiration
I needed to transfer two of my personal lists (watched movies and movies I'd like to watch) saved in text files to [Trakt](https://trakt.tv/). I found [Trakt.tv tools](https://github.com/xbgmsharp/trakt) which does exactly that but it requires IMDB IDs instead of movie names. Fortunately, there is an existing [package](https://github.com/ebouther/imdb-id) created by [ebouther](https://github.com/ebouther) that converts a movie or show title to its respective IMDB ID. I simply utilize his tool to convert a text file full of movie and show titles to IMDB IDs.


## Installation
0. Get a Terminal: [cmd](https://en.wikipedia.org/wiki/Cmd.exe) (Windows), [Terminal](https://en.wikipedia.org/wiki/Terminal_(macOS)) (macOS), or [Console](https://en.wikipedia.org/wiki/Linux_console) (Linux)
1. Install [Node.js](https://nodejs.org/en/), either LTS or Current.
2. Clone or [download](https://github.com/Prince25/Titles-To-IMDB-IDs/archive/refs/heads/main.zip) this repository\
`git clone https://github.com/Prince25/Titles-To-IMDB-IDs.git`
3. Go to root directory\
`cd Titles-To-IMDB-IDs`
4. Install npm packages via a terminal\
`npm install`


## Usage
Run `node main.js <Text File>`.

Replace `<Text File>` with the text file containing the movie or show titles to convert.

`main.js` contains additional configurable options:
  - `DELAY`: Delay in milliseconds between IMDB search queries. Default: `1000`. Be careful to not set this too low.
  - `OUTPUT_FILE`: The name of the output CSV file containing the titles, IMDB IDs, and IMDB URLs. Default: `imdb_ids`.
  - `ERROR_FILE`: The name of the error CSV file containing the titles which failed to be converted as well as the error message and the attempted IMDB search query URL. Default: `errors`.

Upon run, a `OUTPUT_FILE` CSV containing the respective IMDB IDs will be generated. If some titles failed to convert, a `ERROR_FILE` CSV will be created as well.

### Example
An example text file (`example.txt`) is provided for demonstration. Running\
`npm run example`\
OR\
`node main.js example.txt`\
will generate `imdb_ids.csv` and `errors.csv`.


## License
See the [LICENSE](LICENSE) file for license rights and limitations (MIT).
