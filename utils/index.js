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


  // Extract Movie Element
  // Method 1
  let movieElement = $('a.ipc-metadata-list-summary-item__t[role="button"]').filter((i, el) => {
    const href = $(el).attr('href');
    return href && href.includes('/title/');
  });

  // Method 2
  if (movieElement.length === 0) {
    movieElement = $('a[role="button"][tabindex="0"]').filter((i, el) => {
      const href = $(el).attr('href');
      // Check if href contains 'title/' which is common for IMDb titles
      return href && href.includes('/title/');
    });
  }

  // Method 3
  if (movieElement.length === 0) {
    movieElement = $('a').filter((i, el) => {
      const className = $(el).attr('class');
      const href = $(el).attr('href');
      return className && className.includes('ipc-metadata-list-summary-item') && href && href.includes('/title/');
    });
  }


  // Extract Movie Link and Title
  let link, imdbTitle = null;
  if (movieElement.length > 0) {
    link = movieElement.first().attr('href');
    imdbTitle = movieElement.first().text().trim();
  } else {
    throw new Error('Movie element not found')
  }

  // Check if the link is a valid movie link (has /title/ or "tt", instead of /name/ or "nm") )
  if (!link || !imdbTitle || !link.includes("tt")) {
    throw new Error('Invalid movie link')
  }


  // Extract ID
  const regex = /\/title\/(t{2}\d+)\/?/;
  const [, id] = regex.exec(link) || [];

  if (!id) throw new Error('ID not found')

  return {imdbTitle, id};
}

module.exports = imdbId;
