import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  ToastAndroid,
  TextInput,
  FlatList,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { db } from './src/config/firebase';

const link =
  'https://cdn3.iconfinder.com/data/icons/bunch-of-stuff/126/slice87-512.png';
class App extends React.Component {
  componentDidMount() {
    this.getData();
  }

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

  addData = name => {
    try {
      db.ref('/name').push({
        name,
      });
      ToastAndroid.show('success tambah data', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show('gagal tambah data', ToastAndroid.SHORT);
    }
  };
  handleChange = text => {
    this.setState({ text });
  };
  getData = () => {
    try {
      db.ref('/name').on('value', res => {
        let data = res.val();
        const objectToArray = data ? Object.values(data) : [];
        this.setState({ msg: objectToArray });
        console.log(objectToArray);
      });
    } catch (error) {
      console.log(error);
    }
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
            <Image source={{ uri: link }} style={{ height: 35, width: 35 }} />
          </Marker>
        </MapView>
        <TextInput
          style={{
            borderWidth: 2,
            width: '80%',
            height: 50,
            padding: 12,
            borderRadius: 5,
          }}
          onChangeText={text => this.handleChange(text)}
          placeholder="masukkan nama"
        />

        <Button title="hit me" onPress={() => this.addData(this.state.text)} />
        <FlatList
          data={this.state.msg}
          renderItem={({ item }) => <Text>{item.name}</Text>}
        />
      </View>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  map: {
    height: '50%',
    width: '100%',
  },
});
