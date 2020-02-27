import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const link =
  'https://cdn3.iconfinder.com/data/icons/bunch-of-stuff/126/slice87-512.png';
class Location extends Component {
  state = {
    msg: [],
    text: '',
  };

  handlemove = () => {
    this.refs.map.animateToRegion(
      {
        latitude: -6.1709743,
        longitude: 106.6374831,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      2000,
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref="map"
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: -6.1370679,
            longitude: 106.6206678,
            latitudeDelta: 0.015, //zoom
            longitudeDelta: 0.0121, //zoom
          }}>
          <Marker
            coordinate={{
              latitude: -6.1370679,
              longitude: 106.6206678,
            }}>
            <Image source={{ uri: link }} style={styles.pinMap} />
          </Marker>
        </MapView>
      </View>
    );
  }
}

export default Location;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  map: {
    height: '100%',
    width: '100%',
  },
  pinMap: {
    height: 35,
    width: 35,
  },
});
