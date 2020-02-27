import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import { firebaseApp } from '../../config/firebase';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import styles from '../../Public/Component/style';
import Moment from 'moment';
import Geolocation from 'react-native-geolocation-service';

class Home extends Component {
  static navigationOptions = {
    title: 'Chat',
  };
  state = {
    users: [],
    listChat: [],
    listChatId: [],
  };

  componentDidMount() {
    let db = firebaseApp.database();
    const myId = this.props.auth.data.uid;
    db.ref('/Chat')
      .orderByChild(`member/${myId}`)
      .startAt('')
      .on('value', snap => {
        const listChat = snap.val() == null ? {} : snap.val();
        const objectToKey = Object.keys(listChat);
        this.setState({ listChat: listChat, listChatId: objectToKey });
      });
    this.getLocation(myId);
  }

  getLocation = async user_id => {
    const hasLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Example App',
        message: 'Example App access to your location',
      },
    );
    if (hasLocationPermission) {
      let db = firebaseApp.database();
      const myId = this.props.auth.data.uid;
      let dataUpdate = {};
      Geolocation.getCurrentPosition(position => {
        db.ref(`users/${user_id}/latitude`).set(position.coords.latitude);
        db.ref(`users/${user_id}/longitude`).set(position.coords.longitude);
        db.ref('users')
          .orderByChild(`friend/${myId}`)
          .startAt('')
          .once('value')
          .then(snap => {
            const snapVal = snap.val();
            const otherUser = snapVal == null ? [] : Object.keys(snapVal);
            otherUser.forEach(key => {
              dataUpdate[`users/${key}/friend/${myId}/latitude`] =
                position.coords.latitude;
              dataUpdate[`users/${key}/friend/${myId}/longitude`] =
                position.coords.longitude;
            });
            db.ref().update(dataUpdate);
          });
        () => {},
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 };
      });
    }
  };

  getReceiver = members => {
    const myID = this.props.auth.data.uid;
    const compare = Object.keys(members);
    if (compare[0] !== myID) {
      return members[compare[0]];
    } else {
      return members[compare[1]];
    }
  };

  handleChat = chatId => {
    this.props.navigation.navigate('Chat', {
      listChatId: chatId,
    });
  };

  renderItem = chatId => {
    const dataChat = this.state.listChat[chatId];
    const receiver = this.getReceiver(dataChat.member);
    const lastMessages = this.state.listChat[chatId].lastMessage;
    const createdAt = this.state.listChat[chatId].lastMessage.createdAt;
    return (
      <View>
        <TouchableOpacity onPress={() => this.handleChat(chatId)}>
          {receiver.photoURL === undefined ? (
            <View>
              <ListItem
                leftAvatar={{
                  source: require('../../Public/Assets/images/default.png'),
                }}
                title={receiver.name}
                subtitle={lastMessages.text}
                badge={{
                  value: 1,
                  textStyle: { color: 'white' },
                  containerStyle: { marginTop: 20 },
                  badgeStyle: { backgroundColor: '#2644F8' },
                }}
              />
              <View style={styles.timeSend}>
                <Text>{Moment(createdAt).format('h:mm')}</Text>
              </View>
            </View>
          ) : (
            <View>
              <ListItem
                leftAvatar={{
                  source: { uri: receiver.photoURL },
                }}
                title={receiver.name}
                subtitle={lastMessages.text}
                badge={{
                  value: 1,
                  textStyle: { color: 'white' },
                  containerStyle: { marginTop: 20 },
                  badgeStyle: { backgroundColor: '#2644F8' },
                }}
              />
              <View style={styles.timeSend}>
                <Text>{Moment(createdAt).format('h:mm')}</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.containerHome}>
        <FlatList
          data={this.state.listChatId}
          renderItem={({ item }) => {
            return this.renderItem(item);
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => ({
  requestAuth: payload =>
    dispatch({
      type: 'POST_LOGIN_FULFILLED',
      payload,
    }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
