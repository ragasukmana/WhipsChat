import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import styles from '../../../Public/Component/style';
import { firebaseApp } from '../../../config/firebase';
import toast from '../../../Public/Component/toast';
import { connect } from 'react-redux';

class Editname extends Component {
  static navigationOptions = {
    title: 'Edit Name',
  };
  state = {
    loading: false,
    Name: '',
    dataUser: [],
  };
  componentDidMount() {
    this.getDataUser();
  }

  getDataUser = () => {
    let db = firebaseApp.database();
    let myid = this.props.auth.data.uid;
    try {
      db.ref(`/users/${myid}`).on('value', res => {
        let dataUser = res.val();
        this.setState({ dataUser: dataUser, Name: dataUser.name });
      });
    } catch (error) {
      toast(error);
    }
  };

  submitChange = () => {
    this.setState({ loading: true });
    let authUpdate = firebaseApp.auth();
    let db = firebaseApp.database();
    let dataUpdate = {};
    const myid = this.props.auth.data.uid;

    authUpdate.currentUser
      .updateProfile({ displayName: this.state.Name })
      .then(() => {
        const name = this.state.Name;
        dataUpdate[`users/${myid}/name`] = name;
        db.ref('users')
          .orderByChild(`friend/${myid}`)
          .startAt('')
          .once('value')
          .then(snap => {
            const snapVal = snap.val();
            const otherUserKeys = snapVal == null ? [] : Object.keys(snapVal);
            otherUserKeys.forEach(key => {
              dataUpdate[`users/${key}/friend/${myid}/name`] = name;
            });
            db.ref('Chat')
              .orderByChild(`member/${myid}`)
              .startAt('')
              .once('value')
              .then(snaps => {
                const snapVals = snaps.val();
                const ontherUsersKey =
                  snapVals == null ? [] : Object.keys(snapVals);
                ontherUsersKey.forEach(keyIdChat => {
                  dataUpdate[`Chat/${keyIdChat}/member/${myid}/name`] = name;
                });
                db.ref().update(dataUpdate);
              });
            toast('Name success changed');
          });
      })
      .catch(() => {
        toast('Failed update name');
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  inputData = (text, type) => {
    this.setState({ [type]: text });
  };

  render() {
    const profile = this.state.dataUser;
    return (
      <View style={styles.containerInputChange}>
        <TextInput
          placeholder="Name"
          style={styles.inputChangeProfile}
          defaultValue={profile.name}
          onChangeText={text => this.inputData(text, 'Name')}
        />
        <View>
          <Button
            titleStyle={styles.signin}
            title="Submit"
            buttonStyle={styles.signinhead}
            onPress={() => this.submitChange()}
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
)(Editname);
