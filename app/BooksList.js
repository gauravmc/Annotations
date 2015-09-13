'use strict';

var React = require('react-native');
var BookRow = require('./BookRow');
var asyncDB = require('./../lib/async-db');
var KindleScraper = require('./../lib/kindle-scraper').KindleScraper;

var {
  Component,
  StyleSheet,
  ListView
} = React;

class BooksList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    };
  }

  componentDidMount() {
    asyncDB.read('book:asins', (err, asins) => {
      if(asins) {
        this.readStoredBooks(JSON.parse(asins));
      } else {
        this.fetchBooks();
      }
    });
  }

  async readStoredBooks(asins) {
    for(let asin of asins) {
      await asyncDB.read(`book:${asin}`, (err, book) => {
        this.appendBookRow(JSON.parse(book));
      });
    }
  }

  fetchBooks() {
    let scraper = new KindleScraper();

    scraper.fetchEach((bookData) => {
      let book = {title: bookData.title, author: bookData.author};
      this.appendBookRow(book);
      asyncDB.append('book:asins', bookData.asin);
      asyncDB.create(`book:${bookData.asin}`, JSON.stringify(book));
      asyncDB.create(`highlights:${bookData.asin}`, JSON.stringify(bookData.highlights));
    });
  }

  appendBookRow(book) {
    let books = this.state.books.concat([book]);
    this.setState({books, dataSource: this.state.dataSource.cloneWithRows(books)});
  }

  render() {
    return(
      <ListView
        contentContainerStyle={styles.container}
        dataSource={this.state.dataSource}
        renderRow={(book) => <BookRow bookTitle={book.title} bookAuthor={book.author} />}
      />
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  }
});

module.exports = BooksList;
