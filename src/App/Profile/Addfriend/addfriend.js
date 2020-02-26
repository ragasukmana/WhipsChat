import React, {Component} from 'react';
import {View, TextInput} from 'react-native';
import {Button} from 'react-native-elements';
import styles from '../../../Public/Component/style';
import {firebaseApp} from '../../../config/firebase';
import toast from '../../../Public/Component/toast';
import {connect} from 'react-redux';

class addfriend extends Component {
  static navigationOptions = {
    title: 'Add Friend',
  };
  state = {
    loading: false,
    email: '',
  };

  inputData = (text, type) => {
    this.setState({[type]: text});
  };

  addFriend = () => {
    try {
      let db = firebaseApp.database();
      let myid = this.props.auth.data.uid;
      let emailInput = this.state.email;
      const emailAccount = this.props.auth.data.email;
      db.ref('users')
        .orderByChild('email')
        .equalTo(this.state.email)
        .once('value', res => {
          if (emailInput !== emailAccount) {
            if (res.val() != null) {
              const idFriend = Object.keys(res.val())[0];
              const newFriend = res.val()[idFriend];
              delete newFriend.friend;
              db.ref(`/users/${myid}/friend`)
                .child(idFriend)
                .set({
                  ...newFriend,
                });
              this.setState({email: ''});
              toast('Friend added');
            } else {
              this.setState({email: ''});
              toast('User not Found');
            }
          } else {
            toast('Cannot add same email');
            this.setState({email: ''});
          }
        });
    } catch (error) {
      toast('Failed add friend');
    }
  };

  render() {
    return (
      <View style={styles.containerInputChange}>
        <TextInput
          placeholder="Email"
          style={styles.inputChangeProfile}
          value={this.state.email}
          onChangeText={text => this.inputData(text, 'email')}
        />
        <View>
          <Button
            titleStyle={styles.signin}
            title="Submit"
            buttonStyle={styles.signinhead}
            onPress={() => this.addFriend(this.state.email)}
            loading={this.state.loading}
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
)(addfriend);
