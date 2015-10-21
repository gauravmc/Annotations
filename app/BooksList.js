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
    this.loadOrFetchBooks();
  }

  async loadOrFetchBooks() {
    let asins = await asyncDB.read('book:asins');
    if(asins) {
      for(let asin of asins) {
        await asyncDB.read(`book:${asin}`, (err, book) => this.appendBookRow(book));
      }
    } else {
      await asyncDB.create('book:asins', []);
      this.fetchBooks();
    }
  }

  fetchBooks() {
    let scraper = new KindleScraper();

    scraper.fetchEach((bookData) => {
      let book = {title: bookData.title, author: bookData.author};
      this.appendBookRow(book);
      asyncDB.append('book:asins', bookData.asin);
      asyncDB.create(`book:${bookData.asin}`, book);
      asyncDB.create(`highlights:${bookData.asin}`, bookData.highlights);
    }, asyncDB.merge('user', {booksFetched: true}));
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
    flexDirection: 'column',
    justifyContent: 'flex-start'
  }
});

module.exports = BooksList;
