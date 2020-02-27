import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { firebaseApp } from '../../config/firebase';
import { connect } from 'react-redux';
import styles from '../../Public/Component/style';
import { View, Image } from 'react-native';

class Chat extends React.Component {
  state = {
    messages: [],
    idChat: '',
    friend: '',
    myId: '',
    dataFriend: '',
    myData: [],
    chatID: '',
    getAvater: '',
  };

  createNewChat() {
    const db = firebaseApp.database();
    let friend = this.props.navigation.state.params.friendUid.uid;
    const myId = this.props.auth.data.uid;
    const dataFriend = this.props.navigation.state.params.friendUid;
    return db
      .ref(`/users/${myId}`)
      .once('value')
      .then(res => {
        let data = res.val();
        this.setState({ myData: data });
      })
      .then(() => {
        console.log(this.state.myData);

        return db
          .ref('Chat')
          .push({
            lastMessage: '',
            member: {
              [friend]: dataFriend,
              [myId]: this.state.myData,
            },
          })
          .then(ref => {
            this.setState({ chatID: ref.key });
            return ref.key;
          });
      });
  }

  addListener(chatID) {
    const db = firebaseApp.database();
    db.ref(`message/${chatID}`).on('child_added', snap => {
      let data = snap.val();
      if (data != null) {
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, [data]),
        }));
      }
    });
  }

  checkChat(friendId) {
    let db = firebaseApp.database();
    return db
      .ref('Chat')
      .orderByChild(`member/${friendId}`)
      .startAt('')
      .once('value')
      .then(snap => {
        const getIdFriend = snap.val();
        if (getIdFriend !== null) {
          const objectToKey = Object.keys(getIdFriend);
          this.setState({ chatID: objectToKey[0] });
          return objectToKey[0];
        } else {
          return null;
        }
      });
  }

  componentDidMount() {
    // const db = firebaseApp.database();
    // const myUid = this.props.auth.data.uid;
    // const toUid = this.props.navigation.state.params.friendUid.uid;
    // console.log(this.props.navigation.state.params.listChatId);
    // console.log(this.props.navigation.state.params.listChatId);

    if (this.props.navigation.state.params.listChatId !== undefined) {
      this.setState({ chatID: this.props.navigation.state.params.listChatId });
      this.addListener(this.props.navigation.state.params.listChatId);
    } else {
      const toUid = this.props.navigation.state.params.friendUid.uid;
      this.checkChat(toUid).then(chatID => {
        if (chatID !== null) {
          this.addListener(chatID);
        } else {
          this.createNewChat().then(newChatID => {
            this.addListener(newChatID);
          });
        }
      });
    }
  }

  onSend(messages = []) {
    const db = firebaseApp.database();
    db.ref(`message/${this.state.chatID}`).push({
      ...messages[0],
      createdAt: new Date().getTime(),
    });
    db.ref(`Chat/${this.state.chatID}`)
      .child('lastMessage')
      .set({
        ...messages[0],
        createdAt: new Date().getTime(),
      });
  }

  render() {
    const myId = this.props.auth.data.uid;
    return (
      <View style={styles.containerHome}>
        <GiftedChat
          inverted={true}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: myId,
          }}
          renderAvatar={() => {
            return (
              <Image
                source={require('../../Public/Assets/images/default.png')}
                style={{ width: 50, height: 50 }}
              />
            );
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
)(Chat);
