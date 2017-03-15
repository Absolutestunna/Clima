
import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TextInput
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
    location: 'Greenville, SC',
    icon_url: "https://icons.wxug.com/i/c/k/partlycloudy.gif",
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
        console.log('responseJson', responseJson);
        const { current_observation: { display_location: { full }, temp_c, temp_f, weather, icon_url } } = responseJson;
        this.setState({
          location: full, temp_c, temp_f, weather
        }, this.handleDisplayPageDetails);
      })
      .catch((error) => {
        console.error(error);
      });
   }
   handleDisplayPageDetails() {
     let { temp_c } = this.state;
     let backgroundColor = tempToColor(temp_c);
     this.setState({
       viewPageBackgroundColor: { backgroundColor }
     });
   }

   queryPartialLookup(query) {
     let { text } = query;
     let url = `https://autocomplete.wunderground.com/aq?query=${text}`;
     console.log('url', url);
     return fetch(url)
       .then((response) => response.json())
       .then((responseJson) => {
         console.log('responseJson', responseJson);
       })
       .catch((error) => {
         console.error(error);
       });
   }

   //REMOVE
   componentDidMount() {
     this.handleDisplayPageDetails()
   }

  render() {
    let { viewPageBackgroundColor, weather, location, icon_url, temp_c } = this.state;
    const { container, iconStyle } = styles;
    let temp = `${temp_c}ºC`;
    return (
      <View style={[viewPageBackgroundColor, container]}>

        <Text>
          <Image
            style={iconStyle}
            source={{uri: icon_url}} />
        </Text>
        <Text>
          {location}
        </Text>
        <Text>
          {weather}
        </Text>
        <Text>
          {temp}
        </Text>

        <Button
          onPress={() => this.getLocationParams()}
          title="Get Location"
          color="#841584"
          accessibilityLabel="Location button"
        />

        <TextInput
          style={{height: 40}}
          placeholder="Type here to translate!"
          onChangeText={(text) => this.queryPartialLookup({text})}
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
  },
  iconStyle: {
    width: 100,
    height: 100
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
