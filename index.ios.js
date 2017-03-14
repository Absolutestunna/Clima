
import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { getApiKey } from './config/keys';
import { tempToColor } from './config/weatherColors';


export default class WeatherApp extends Component {
  state = {
    initialPosition: {},
    lastPosition: {},
    temp_c: '28',
    temp_f: '55',
    weather: 'Partly Cloudy',
    viewPageBackgroundColor: {backgroundColor: 'hsl(348, 99%, 100%)'}
  };

  fetchWeatherInfoByIP() {
    const { apiKey } = getApiKey();
    const { baseURL } = this.props;
    let IPlocationUrl = `${baseURL}/${apiKey}/conditions/q/autoip.json`
    this.fetchWeatherInfoFunc(IPlocationUrl)
  }

  getLocationParams() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({initialPosition: position}, () => this.fetchWeatherInfoByGeoLocation());
      },
      (error) => {
        let { message } = error
        alert(message)
        this.fetchWeatherInfoByIP()
      }
    );
  }

  fetchWeatherInfoByGeoLocation(){
    let { initialPosition: { coords: { latitude, longitude } } } = this.state;
    const { apiKey } = getApiKey();
    const { baseURL } = this.props;
    let geoLocationUrl = `${baseURL}/${apiKey}/conditions/q/${latitude},${longitude}.json`
    this.fetchWeatherInfoFunc(geoLocationUrl);
  }

  fetchWeatherInfoFunc(url) {
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        const { current_observation: { display_location: { city, state }, temp_c, temp_f, weather } } = responseJson;
        this.setState({
          city, state, temp_c, temp_f, weather
        }, this.handleDisplayPageDetails);
      })
      .catch((error) => {
        console.error(error);
      });
   }
   handleDisplayPageDetails() {
     let { temp_c } = this.state;
     let backgroundColor = tempToColor(temp_c);
     console.log('backgroundColor', backgroundColor);
     this.setState({
       viewPageBackgroundColor: { backgroundColor }
     })

   }

   componentDidMount() {
     this.handleDisplayPageDetails()
   }

  //
  // 31 - 44,640 - 58,416
  // 28 - 53,760

  render() {
    let { viewPageBackgroundColor } = this.state;
    console.log('viewPageBackgroundColor', viewPageBackgroundColor);
    return (
      <View style={[viewPageBackgroundColor, styles.container]}>
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
