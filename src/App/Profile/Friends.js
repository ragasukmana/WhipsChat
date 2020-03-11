import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { firebaseApp } from '../../config/firebase';
import toast from '../../Public/Component/toast';
import { ListItem, Icon, Avatar } from 'react-native-elements';
import { connect } from 'react-redux';
import styles from '../../Public/Component/style';

class Profile extends Component {
  state = {
    data: [],
    text: '',
  };

  componentDidMount() {
    this.getFriend();
  }

  handleInput = text => {
    this.setState({ text });
  };

  getFriend = () => {
    let db = firebaseApp.database();
    let myid = this.props.auth.data.uid;
    try {
      db.ref(`/users/${myid}/friend`).on('value', res => {
        let data = res.val();
        const objectToArray = data ? Object.values(data) : [];
        this.setState({ data: objectToArray });
      });
    } catch (error) {
      toast('Error get friend');
    }
  };

  handleChat = item => {
    this.props.navigation.navigate('Chat', { friendUid: item });
  };

  handleAddFriend = () => {
    this.props.navigation.navigate('Addfriend');
  };

  handleProfileFriend = item => {
    this.props.navigation.navigate('PageFriends', { info: item });
  };

  handleLocation(item) {
    this.props.navigation.navigate('Location', { idFriend: item });
  }

  render() {
    return (
      <View style={styles.containerHome}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => {
            return (
              <View>
                {item.photoURL ? (
                  <ListItem
                    leftAvatar={
                      <Avatar rounded source={{ uri: item.photoURL }} />
                    }
                    onPress={() => this.handleChat(item)}
                    title={item.name}
                    subtitle={item.status}
                    rightIcon={
                      <View style={styles.containerLogoFL}>
                        <Icon
                          name="info"
                          type="material"
                          size={15}
                          reverse
                          color="#545CCB"
                          containerStyle={styles.marginLogoFL}
                          onPress={() => this.handleProfileFriend(item)}
                        />
                        <Icon
                          name="my-location"
                          type="material"
                          size={15}
                          reverse
                          color="#545CCB"
                          onPress={() => this.handleLocation(item)}
                        />
                      </View>
                    }
                  />
                ) : (
                  <ListItem
                    onPress={() => this.handleChat(item)}
                    leftAvatar={{
                      source: require('../../Public/Assets/images/default.png'),
                    }}
                    title={item.name}
                    subtitle={item.status}
                    rightIcon={
                      <View style={styles.containerLogoFL}>
                        <Icon
                          name="info"
                          type="material"
                          size={15}
                          reverse
                          color="#545CCB"
                          containerStyle={styles.marginLogoFL}
                          onPress={() => this.handleProfileFriend(item)}
                        />
                        <Icon
                          name="my-location"
                          type="material"
                          size={15}
                          reverse
                          color="#545CCB"
                          onPress={() => this.handleLocation(item)}
                        />
                      </View>
                    }
                  />
                )}
              </View>
            );
          }}
        />
        <Icon
          reverse
          raised
          name="person-add"
          type="material"
          color="#545CCB"
          containerStyle={styles.buttonaddfriend}
          onPress={() => this.handleAddFriend()}
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
)(Profile);
