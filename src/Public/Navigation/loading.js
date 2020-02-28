import React, { Component } from 'react';
import { View, ImageBackground } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import styles from '../../Public/Component/style';

class Loading extends Component {
  componentDidMount() {
    // firebase.auth().onAuthStateChanged(user => {
    //   console.log(user);
    //   this.props.navigation.navigate(user ? 'App' : 'Auth');
    //   this.props.requestAuth(user);
    // });
    const user = this.props.auth.data.uid;
    if (user) {
      this.props.requestAuth(user);
      this.props.navigation.navigate('App');
    } else {
      this.props.navigation.navigate('Auth');
    }
  }

  render() {
    return (
      <View style={styles.containersplash}>
        <ImageBackground
          source={require('../Assets/images/splash.png')}
          style={styles.splash}
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
)(Loading);
