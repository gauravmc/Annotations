'use strict';

var React = require('react-native');
var CookieManager = require('react-native-cookies');

var {
  AppRegistry,
  StyleSheet,
  Component,
  View,
  Text,
  WebView
} = React;

// var STORAGE_KEY = '@AnnotationsStore:key';
var KINDLE_HOME = 'https://kindle.amazon.com/';

class Annotations extends Component {
  constructor(props) {
    super(props);
    this.state = {loggedIn: false};
  }

  componentDidMount() {
    CookieManager.getAll((cookies) => {
      if(cookies['sess-at-main'] && cookies['sess-at-main'].domain == '.amazon.com') {
        this.setState({loggedIn: true});
      }
    });
  }

  onNavigationStateChange(navState) {
    if(navState.url == KINDLE_HOME) {
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
    // fetch('https://kindle.amazon.com/your_highlights')
    // .then((response) => response.text())
    // .then((responseText) => {
    //   if(!responseText.match(/What\sis\syour\se-mail\sor\smobile\snumber/)) {
    //     this.setState({loggedIn: true});
    //   }
    // }).catch((err)=>{
    //   console.error(err);
    // });

    if(this.state.loggedIn) {
      return (
        <View style={styles.container}>
          <Text>Render books here!</Text>
        </View>
      );
    } else {
      return (
        <WebView
          automaticallyAdjustContentInsets={true}
          style={styles.container}
          url={`${KINDLE_HOME}login`}
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
