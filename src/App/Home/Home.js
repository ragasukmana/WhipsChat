import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { firebaseApp } from '../../config/firebase';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import styles from '../../Public/Component/style';

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
        // const objectToArray = listChat ? Object.values(listChat) : [];
        const objectToKey = Object.keys(listChat);
        this.setState({ listChat: listChat, listChatId: objectToKey });
      });
  }

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

    return (
      <View>
        <TouchableOpacity onPress={() => this.handleChat(chatId)}>
          {receiver.photoURL === undefined ? (
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
          ) : (
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
          )}
        </TouchableOpacity>
        <View style={{ position: 'absolute', right: 10, top: 10 }}>
          <Text>11:00</Text>
        </View>
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
