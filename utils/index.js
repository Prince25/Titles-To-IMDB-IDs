const fetch = require('node-fetch')
const cheerio = require('cheerio');

const imdbId = async function (title) {
  const url = `http://www.imdb.com/find?s=all&q=${encodeURIComponent(title)}`;

  const body = await fetch(url).then(res => res.text());

  const $ = cheerio.load(body);
  const movieLink = $("#main > .article >  .findSection > .findList > tbody").find("td").find("a").attr('href');

  if (!movieLink) throw new Error('Movie not found');

  const regex = /\/title\/(t{2}\d+)\/?/;
  const [,id] = regex.exec(movieLink) || [];

  if (!id) throw new Error('ID not found')

  return id;
}


module.exports = imdbId;
