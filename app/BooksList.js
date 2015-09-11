'use strict';

var React = require('react-native');
var BookRow = require('./BookRow');

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
    this.fetchBooks();
  }

  fetchBooks() {
    let scraper = new KindleScraper();
    scraper.fetchEach((bookData) => {
      let books = this.state.books;
      books.push({title: bookData.title, author: bookData.author});
      this.setState({dataSource: this.state.dataSource.cloneWithRows(books)});
    });
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
