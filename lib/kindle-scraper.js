'use strict';

const KINDLE_HOME = 'https://kindle.amazon.com';
var cheerio = require('./cheerio');

class KindleScraper {
  async fetchEach(store) {
    let bookData;
    let nextBookUrl = `${KINDLE_HOME}/your_highlights`;
    var counter = 0;
    while(counter < 3) {
      try {
        [bookData, nextBookUrl] = await this.fetchBook(nextBookUrl);
      } catch (error) {
        console.error('fetchBook error: ' + error.message);
      }
      counter += 1;
      store(bookData);
    }
  }

  fetchBook(bookUrl) {
    console.log('fetching book...' + bookUrl);
    return fetch(bookUrl)
      .then((response) => response.text())
      .then((responseText) => {
        return this.bookDataFromPage(responseText);
      })
      .then((data) => data);
  }

  async bookDataFromPage(html) {
    let $ = cheerio.load(html);
    let book = {};

    let el = $('.bookMain .title a');
    book.title = el.text().trim();
    book.kindleUrl = `${KINDLE_HOME}${el.attr().href}`;
    // book.imageUrl = await this.getBookImageUrl(book.kindleUrl);
    book.asin = book.kindleUrl.split('/').slice(-1)[0];
    book.titlesetId = book.kindleUrl.split('/').slice(-2)[0];
    book.author = $('.bookMain .author').text().trim().replace(/^by\s/, '');
    book.lastAnnotatedOn = $('.bookMain .lastHighlighted').text().replace(/Last\sannotated\son\s/, '');

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
  }

  // getBookImageUrl(kindleUrl) {
  //   console.log('fetching image for book...' + kindleUrl);
  //   return fetch(kindleUrl).then((response) => response.text())
  //     .then((responseText) => {
  //       let $ = cheerio.load(responseText);
  //       return $('.bookCover').attr().src.replace(/\._.*_/,'');
  //     })
  //     .then((imageUrl) => imageUrl);
  // }
}

module.exports = {KindleScraper, KINDLE_HOME};
