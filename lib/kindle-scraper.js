'use strict';

const KINDLE_HOME = 'https://kindle.amazon.com';
var cheerio = require('./cheerio');

class KindleScraper {
  async fetchEach(onFetch, onDone) {
    let bookData;
    let nextBookUrl = `${KINDLE_HOME}/your_highlights`;
    while(nextBookUrl) {
      try {
        [bookData, nextBookUrl] = await this.fetchBook(nextBookUrl);
        // bookData.imageUrl = await this.fetchBookImageUrl(bookData.kindleUrl);
        // if(!bookData.imageUrl) {
        //   bookData.imageUrl = await this.fetchBookImageUrlFromAmazonHome(bookData.asin);
        // }
      } catch (error) {
        console.error('fetchBook error: ' + error.message);
      }
      if(bookData) onFetch(bookData);
    }
    onDone();
  }

  fetchBook(bookUrl) {
    console.log('fetching book...' + bookUrl);
    return fetch(bookUrl).then((response) => response.text())
      .then((responseText) => {
        let $ = cheerio.load(responseText);
        if($('.noHighlight').attr()) {
          return [false, false];
        }

        let book = {};
        let el = $('.bookMain .title a');
        book.title = el.text().trim();
        book.kindleUrl = `${KINDLE_HOME}${el.attr().href}`;
        book.asin = book.kindleUrl.split('/').slice(-1)[0];
        book.titlesetId = book.kindleUrl.split('/').slice(-2)[0];
        book.author = $('.bookMain .author').text().trim().replace(/^by\s/, '');
        book.annotatedOn = $('.bookMain .lastHighlighted').text().replace(/Last\sannotated\son\s/, '');
        book.annotatedOn = Date.parse(book.annotatedOn)/1000;

        book.highlights = [];
        $('#allHighlightedBooks .highlightRow').each((_, el) => {
          let hl = {};
          hl.content = $(el).children('.highlight').text().trim();
          hl.annotationId = $(el).find('form #annotation_id').attr().value;
          hl.loc = $(el).children('.readMore').text().replace(/Read\smore\sat\slocation\s/, '');
          book.highlights.push(hl);
        });

        let nextBookUrl = false;
        if($('#nextBookLink').attr()) {
          nextBookUrl = `${KINDLE_HOME}${$('#nextBookLink').attr().href}`;
        }
        return [book, nextBookUrl];
      });
  }

  async fetchBookImageUrl(kindleUrl) {
    console.log('fetching image for book...' + kindleUrl);
    return fetch(kindleUrl).then((response) => response.text())
      .then((responseText) => {
        if(responseText.length == 0) {
          return null;
        } else {
          let $ = cheerio.load(responseText);
          return $('.bookCover').attr().src.replace(/\._.*_/,'');
        }
      });
  }

  fetchBookImageUrlFromAmazonHome(asin) {
    console.log('fetching image for book from amazon.com...');
    return fetch(`http://www.amazon.com/dp/${asin}`).then((response) => response.text())
      .then((responseText) => {
        let $ = cheerio.load(responseText);
        let imageUrl = Object.keys(JSON.parse($('#main-image-container img').attr()['data-a-dynamic-image']))[0];
        return imageUrl.replace(/\._.*_/,'');
      });
  }
}

module.exports = {KindleScraper, KINDLE_HOME};
