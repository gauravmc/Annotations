'use strict';

var React = require('react-native');
var CookieManager = require('react-native-cookies');
var BooksList = require('./app/BooksList');

const KINDLE_HOME = require('./lib/kindle-scraper').KINDLE_HOME;

var {
  AppRegistry,
  StyleSheet,
  Component,
  WebView
} = React;

// var STORAGE_KEY = '@AnnotationsStore:key';

class Annotations extends Component {
  constructor(props) {
    super(props);
    this.state = {loggedIn: false};
  }

  componentDidMount() {
    CookieManager.getAll((cookies) => {
      if(cookies['at-main'] && cookies['at-main'].domain == '.amazon.com') {
        this.setState({loggedIn: true});
      }
    });
  }

  onNavigationStateChange(navState) {
    if(navState.url == `${KINDLE_HOME}/`) {
      this.setState({loggedIn: true});
    }
  }

  // async _loadInitialState() {
  //   try {
  //     var value = await AsyncStorage.getItem(STORAGE_KEY);
  //     if (value !== null){
  //       this.setState({selectedValue: value});
  //       console.log('Recovered selection from disk: ' + value);
  //     } else {
  //       console.log('Initialized with no selection on disk.');
  //     }
  //   } catch (error) {
  //     console.error('AsyncStorage error: ' + error.message);
  //   }
  // }
  //
  // async _onValueChange(selectedValue) {
  //   this.setState({selectedValue});
  //   try {
  //     await AsyncStorage.setItem(STORAGE_KEY, selectedValue);
  //     console.log('Saved selection to disk: ' + selectedValue);
  //   } catch (error) {
  //     console.error('AsyncStorage error: ' + error.message);
  //   }
  // }
  //
  // async _removeStorage() {
  //   try {
  //     await AsyncStorage.removeItem(STORAGE_KEY);
  //     console.log('Selection removed from disk.');
  //   } catch (error) {
  //     console.error('AsyncStorage error: ' + error.message);
  //   }
  // }

  render() {
    if(this.state.loggedIn) {
      return (
        <BooksList />
      );
    } else {
      return (
        <WebView
          automaticallyAdjustContentInsets={true}
          style={styles.container}
          url={`${KINDLE_HOME}/login`}
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          scalesPageToFit={true}
          startInLoadingState={true}
        />
      );
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

AppRegistry.registerComponent('Annotations', () => Annotations);
