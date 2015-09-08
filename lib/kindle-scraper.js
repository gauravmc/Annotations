'use strict';

const KINDLE_HOME = 'https://kindle.amazon.com/';

class KindleScraper {
  async fetchEach(store) {
    let bookData;
    let completedLastBook = false;
    let nextBookUrl = `${KINDLE_HOME}/your_highlights`;
    while(!completedLastBook) {
      try {
        [bookData, nextBookUrl, completedLastBook] = await this.fetchBook(nextBookUrl);
      } catch (error) {
        console.error('fetchBook error: ' + error.message);
      }
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

  bookDataFromPage(html) {
    let bookData = {title: 'Book title'};
    let nextBookUrl = 'https://google.com';
    let completedLastBook = true;
    return [bookData, nextBookUrl, completedLastBook];
  }
}

module.exports = {KindleScraper, KINDLE_HOME};
