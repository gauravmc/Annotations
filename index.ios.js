'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  Component,
  View,
  Text,
  WebView
} = React;

class Annotations extends Component {
  constructor(props) {
    super(props);
    this.state = {loggedIn: false};
  }

  onNavigationStateChange(navState) {
    if(navState.url == 'https://kindle.amazon.com/' && navState.title == 'Amazon Kindle: Home') {
      this.setState({loggedIn: true});
    }
  }

  render() {
    fetch('https://kindle.amazon.com/your_highlights')
    .then((response) => response.text())
    .then((responseText) => {
      if(!responseText.match(/What\sis\syour\se-mail\sor\smobile\snumber/)) {
        this.setState({loggedIn: true});
      }
    }).catch((err)=>{
      console.log(err);
    });

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
          url={'https://kindle.amazon.com/login'}
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
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
