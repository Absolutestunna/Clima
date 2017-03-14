
import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { getApiKey } from './config/keys';





export default class WeatherApp extends Component {
  state = {
    initialPosition: {},
    lastPosition: {},
  };

  getLocationParams() {

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('position', position);
        this.setState({initialPosition: position}, () => this.fetchWeatherReportFunc());
      },
      (error) => alert(JSON.stringify(error)),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );

      this.watchID = navigator.geolocation.watchPosition((position) => {
        this.setState({lastPosition: position});
      });
  }

  fetchWeatherReportFunc(){
    let { initialPosition: { coords: { latitude, longitude } } } = this.state;
    const { apiKey } = getApiKey();
    const { baseURL } = this.props;
    let url = `${baseURL}/${apiKey}/conditions/q/${latitude},${longitude}.json`;
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('responseJson', responseJson);
        let { current_observation: { display_location: { city, state } }, temp_c, temp_f, weather } = responseJson;
        this.setState({
          city, state, temp_c, temp_f,
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Button
          onPress={() => this.getLocationParams()}
          title="Get Location"
          color="#841584"
          accessibilityLabel="Location button"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
  }
});

WeatherApp.propTypes = {
  initialPosition:  PropTypes.object,
  lastPosition: PropTypes.object
}

WeatherApp.defaultProps = {
  baseURL: "https://api.wunderground.com/api",
}

AppRegistry.registerComponent('WeatherApp', () => WeatherApp);
