/*
  * Written by ebouther
  * https://github.com/ebouther/imdb-id
  * 
  * Edited by Prabhjot Singh
  * https://github.com/Prince25
*/

const fetch = require('node-fetch')
const cheerio = require('cheerio');

const imdbId = async function (title) {
  const url = `http://www.imdb.com/find?s=all&q=${encodeURIComponent(title)}`;

  const body = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }
  }).then(res => res.text());

  const $ = cheerio.load(body);

  let movieLink = $("body > div:nth-of-type(2) > main > div:nth-of-type(2) > div:nth-of-type(3) > section > div > div:nth-of-type(1) > section:nth-of-type(2) > div:nth-of-type(2) > ul > li:nth-of-type(1) > div:nth-of-type(2) > div > a")
    .attr('href');

  if (!movieLink.includes("tt")) {
    movieLink = $("body > div:nth-of-type(2) > main > div:nth-of-type(2) > div:nth-of-type(3) > section > div > div:nth-of-type(1) > section:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(1) > div:nth-of-type(2) > div > a")
      .attr('href');
  }

  if (!movieLink) throw new Error('Movie not found');

  const regex = /\/title\/(t{2}\d+)\/?/;
  const [, id] = regex.exec(movieLink) || [];

  if (!id) throw new Error('ID not found')

  return id;
}


module.exports = imdbId;
