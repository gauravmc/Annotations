'use strict';

import React from 'react-native';
import CookieManager from 'react-native-cookies';
import BooksList from './app/BooksList';
import asyncDB from './lib/async-db';
const KINDLE_HOME = require('./lib/kindle-scraper').KINDLE_HOME;

var {
  AppRegistry,
  StyleSheet,
  Component,
  WebView
} = React;

class Annotations extends Component {
  constructor(props) {
    super(props);
    this.state = {loggedIn: false};
    asyncDB.read('user', (err, user) => {
      if(!user) {
        asyncDB.create('user', {
          email: null,
          booksFetched: false,
          lastFetchedBookUrl: null
        });
      }
    });
  }

  componentDidMount() {
    // Temporary
    // CookieManager.clearAll(()=>{});
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

  render() {
    if(this.state.loggedIn) {
      return (
        <BooksList />
      );
    } else {
      return (
        <WebView
          automaticallyAdjustContentInsets
          style={styles.container}
          url={`${KINDLE_HOME}/login`}
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          scalesPageToFit
          startInLoadingState
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
