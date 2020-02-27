import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { firebaseApp } from '../../../config/firebase';
import { connect } from 'react-redux';
import { Button, Avatar, Icon } from 'react-native-elements';

class Location extends Component {
  state = {
    msg: [],
    text: '',
    idFriend: this.props.navigation.state.params.idFriend.uid,
    photoFriend: this.props.navigation.state.params.idFriend.photoURL,
    myPhoto:
      'https://cdn3.iconfinder.com/data/icons/bunch-of-stuff/126/slice87-512.png',
    // latitudeFriend: this.props.navigation.state.params.idFriend.latitude,
    // longitudeFriend: this.props.navigation.state.params.idFriend.longitude,
    latitudeFriend: -6.5980046,
    longitudeFriend: 106.7952779,
    myLatitude: -6.5980046,
    myLongtitude: 106.7952779,
  };

  componentDidMount() {
    this.getMyData();
  }

  handleMoveMyLoc = () => {
    this.refs.map.animateToRegion(
      {
        latitude: this.state.myLatitude,
        longitude: this.state.myLongtitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      2000,
    );
  };

  handleMoveFriend = () => {
    this.refs.map.animateToRegion(
      {
        latitude: this.state.latitudeFriend,
        longitude: this.state.longitudeFriend,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      2000,
    );
  };

  getMyData() {
    const db = firebaseApp.database();
    const myId = this.props.auth.data.uid;
    db.ref(`/users/${myId}`)
      .once('value')
      .then(res => {
        let data = res.val();
        this.setState({
          myLatitude: data.latitude,
          myLongtitude: data.longitude,
          myPhoto: data.photoURL,
        });
      });
  }

  render() {
    const myLatitude = this.state.myLatitude;
    const myLongtitude = this.state.myLongtitude;

    return (
      <View style={styles.container}>
        <MapView
          ref="map"
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: this.state.latitudeFriend,
            longitude: this.state.longitudeFriend,
            latitudeDelta: 0.015, //zoom
            longitudeDelta: 0.0121, //zoom
          }}>
          <Marker
            coordinate={{
              latitude: this.state.latitudeFriend,
              longitude: this.state.longitudeFriend,
            }}>
            <Avatar
              rounded
              source={{ uri: this.state.photoFriend }}
              style={styles.pinMap}
            />
          </Marker>
          <Marker
            coordinate={{
              latitude: myLatitude,
              longitude: myLongtitude,
            }}>
            <Avatar
              rounded
              source={{ uri: this.state.myPhoto }}
              style={styles.pinMap}
            />
          </Marker>
        </MapView>
        <View style={styles.containerButton}>
          <Button
            title="Friend Location"
            containerStyle={styles.button}
            onPress={() => this.handleMoveFriend()}
            titleStyle={styles.titleButton}
          />
          <Button
            title="My Location"
            containerStyle={styles.button}
            onPress={() => this.handleMoveMyLoc()}
            titleStyle={styles.titleButton}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(Location);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  pinMap: {
    height: 35,
    width: 35,
  },
  containerButton: { flexDirection: 'row', marginBottom: 20 },
  button: { margin: 10 },
  titleButton: { fontSize: 12 },
});
