import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import styles from '../../../Public/Component/style';
import { firebaseApp } from '../../../config/firebase';
import toast from '../../../Public/Component/toast';
import { connect } from 'react-redux';

class Editstatus extends Component {
  static navigationOptions = {
    title: 'Edit Status',
  };
  state = {
    loading: false,
    status: '',
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
        this.setState({ dataUser: dataUser, status: dataUser.status });
      });
    } catch (error) {
      toast(error);
    }
  };

  inputData = (text, type) => {
    this.setState({ [type]: text });
  };

  submitChange = () => {
    this.setState({ loading: true });
    let authUpdate = firebaseApp.auth();
    let db = firebaseApp.database();
    let dataUpdate = {};
    const myid = this.props.auth.data.uid;

    authUpdate.currentUser
      .updateProfile({ status: this.state.status })
      .then(() => {
        const status = this.state.status;
        dataUpdate[`users/${myid}/status`] = status;
        db.ref('users')
          .orderByChild(`friend/${myid}`)
          .startAt('')
          .once('value')
          .then(snap => {
            const snapVal = snap.val();
            const otherUserKeys = snapVal == null ? [] : Object.keys(snapVal);
            otherUserKeys.forEach(key => {
              dataUpdate[`users/${key}/friend/${myid}/status`] = status;
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
                  dataUpdate[
                    `Chat/${keyIdChat}/member/${myid}/status`
                  ] = status;
                });
                db.ref().update(dataUpdate);
              });
            toast('Status success change');
          });
      })
      .catch(() => {
        toast('Failed update status');
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const profile = this.state.dataUser;
    return (
      <View style={styles.containerInputChange}>
        <TextInput
          placeholder="Status"
          style={styles.inputChangeProfile}
          defaultValue={profile.status}
          onChangeText={text => this.inputData(text, 'status')}
        />
        <View>
          <Button
            titleStyle={styles.signin}
            title="Submit"
            buttonStyle={styles.signinhead}
            loading={this.state.loading}
            onPress={() => this.submitChange()}
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
)(Editstatus);
