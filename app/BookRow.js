'use strict';

var React = require('react-native');

var {
  View,
  Text,
  Component,
  StyleSheet,
  PropTypes,
  Image
} = React;

const PLACEHOLDER_BOOK_IMG = 'https://dl.dropboxusercontent.com/u/45917215/highlights/no_book_cover.jpg';

class BookRow extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {};
  // }

  componentDidMount() {
    // Search for and add image;
  }

  chopRowText(text) {
    return text.length > 42 ? `${text.slice(0, 42)}...` : text;
  }

  render() {
    return(
      <View style={styles.row}>
        <Image resizeMode={Image.resizeMode.contain} style={styles.bookImg} source={{uri: PLACEHOLDER_BOOK_IMG}} />
        <View style={styles.bookContent}>
          <Text>{this.chopRowText(this.props.bookTitle)}</Text>
          <Text>{this.chopRowText(this.props.bookAuthor)}</Text>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 2,
    paddingBottom: 2
  },
  bookImg: {
    width: 50,
    height: 50
  },
  bookContent: {
    alignSelf: 'center'
  }
});

BookRow.propTypes = {
  bookAuthor: PropTypes.string.isRequired,
  bookTitle: PropTypes.string.isRequired
};

module.exports = BookRow;
