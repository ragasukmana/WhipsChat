import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { firebaseApp } from '../../config/firebase';
import { connect } from 'react-redux';
import styles from '../../Public/Component/style';
import { View, Image } from 'react-native';
import { Avatar } from 'react-native-elements';

class Chat extends React.Component {
  state = {
    messages: [],
    idChat: '',
    friend: '',
    myId: '',
    dataFriend: '',
    myData: [],
    chatID: '',
    getAvatar: '',
  };

  createNewChat() {
    const db = firebaseApp.database();
    const friend = this.props.navigation.state.params.friendUid.uid;
    const myId = this.props.auth.data.uid;
    const dataFriend = this.props.navigation.state.params.friendUid;
    return db
      .ref(`/users/${myId}`)
      .once('value')
      .then(res => {
        const data = res.val();
        delete data.friend;
        this.setState({ myData: data });
      })
      .then(() => {
        console.log(dataFriend);
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
      if (data) {
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
        if (getIdFriend) {
          const objectToKey = Object.keys(getIdFriend);
          this.setState({ chatID: objectToKey[0] });
          return objectToKey[0];
        } else {
          return null;
        }
      });
  }

  componentDidMount() {
    if (this.props.navigation.state.params.listChatId) {
      this.setState({ chatID: this.props.navigation.state.params.listChatId });
      this.addListener(this.props.navigation.state.params.listChatId);
    } else {
      const toUid = this.props.navigation.state.params.friendUid.uid;
      this.checkChat(toUid).then(chatID => {
        if (chatID) {
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
    const foto = this.state.getAvatar;

    return (
      <View style={styles.containerHome}>
        <GiftedChat
          inverted={true}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: myId,
          }}
          renderAvatar={props => {
            const db = firebaseApp.database();
            const friendId = props.currentMessage.user._id;
            db.ref(`users/${friendId}`).on('value', res => {
              let dataFriend = res.val();
              this.setState({ getAvatar: dataFriend });
            });
            return (
              <View>
                {foto.photoURL ? (
                  <Avatar
                    rounded
                    source={{ uri: foto.photoURL }}
                    style={styles.avatarChat}
                  />
                ) : (
                  <Image
                    source={require('../../Public/Assets/images/default.png')}
                    style={styles.avatarChat}
                  />
                )}
              </View>
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
