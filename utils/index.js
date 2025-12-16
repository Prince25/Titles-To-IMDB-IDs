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
  // Fetch Search Results Page
  const url = `http://www.imdb.com/find?s=all&q=${encodeURIComponent(title)}`;
  const body = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }
  }).then(res => res.text());

  const $ = cheerio.load(body);


  // Extract Movie Element
  let movieElement = null;

  // Target the titles section to avoid searching in People or other sections
  const titlesSection = $('section[data-testid="find-results-section-title"]');

  // Method 1: Find the first movie list item and get the anchor with title
  if (titlesSection.length > 0) {
    const firstMovieItem = titlesSection.find('li.ipc-metadata-list-summary-item').first();
    if (firstMovieItem.length > 0) {
      // Look for the anchor inside ipc-title that contains the h3 with ipc-title__text
      const titleLink = firstMovieItem.find('a.ipc-title-link-wrapper').first();
      if (titleLink.length > 0) {
        movieElement = titleLink;
      }
    }
  }

  // Method 2: Search for h3 with class ipc-title__text and traverse up through ancestors
  if (!movieElement || movieElement.length === 0) {
    if (titlesSection.length > 0) {
      const titleElement = titlesSection.find('h3.ipc-title__text').first();
      if (titleElement.length > 0) {
        movieElement = titleElement.closest('a.ipc-title-link-wrapper');
      }
    }
  }

  // Method 3: Find any anchor with ipc-title-link-wrapper class inside metadata list items
  if (!movieElement || movieElement.length === 0) {
    if (titlesSection.length > 0) {
      movieElement = titlesSection.find('li.ipc-metadata-list-summary-item a.ipc-title-link-wrapper').first();
    }
  }

  // Method 4: Fallback: find any anchor that contains h3.ipc-title__text with /title/ in href
  if (!movieElement || movieElement.length === 0) {
    if (titlesSection.length > 0) {
      movieElement = titlesSection.find('a').filter((i, el) => {
        const href = $(el).attr('href');
        const hasTitle = $(el).find('h3.ipc-title__text').length > 0;
        return href && href.includes('/title/') && hasTitle;
      }).first();
    }
  }


  // Extract Movie Link and Title
  let link, imdbTitle = null;
  if (movieElement && movieElement.length > 0) {
    link = movieElement.attr('href');
    imdbTitle = movieElement.find('h3.ipc-title__text').text().trim();
    // Fallback to all text if h3 not found
    if (!imdbTitle) {
      imdbTitle = movieElement.text().trim();
    }
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

  return { imdbTitle, id };
}

module.exports = imdbId;
