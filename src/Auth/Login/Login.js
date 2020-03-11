import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Icon, Button } from 'react-native-elements';
import styles from '../../Public/Component/style';
import { firebaseApp } from '../../config/firebase';
import toast from '../../Public/Component/toast';
import { connect } from 'react-redux';

class Login extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  state = {
    loading: false,
    email: '',
    password: '',
  };

  handleRegis = () => {
    this.props.navigation.navigate('Regis');
  };

  handleHome = () => {
    this.props.navigation.navigate('App');
  };

  handleInput = (text, type) => {
    this.setState({ [type]: text });
  };

  handleLogin = () => {
    this.setState({ loading: true });
    const { email, password } = this.state;
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        toast('Success Login');
        this.props.requestAuth(res.user);
      })
      .then(() => {
        this.props.navigation.navigate('App');
      })
      .catch(error => {
        var errorMessage = error.message;
        toast(errorMessage);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    return (
      //container header
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Image
              source={require('../../Public/Assets/logos/logo.png')}
              style={styles.logo}
            />
          </View>
          {/* ini container body */}
          <View style={styles.containerbody}>
            <View style={styles.headerinput}>
              <View style={styles.containerinput}>
                <View style={styles.email}>
                  <TextInput
                    placeholder="Email"
                    onChangeText={text => this.handleInput(text, 'email')}
                  />
                  <View style={styles.iconinput}>
                    <Icon name="email" type="material" />
                  </View>
                </View>
                <View style={styles.password}>
                  <TextInput
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={text => this.handleInput(text, 'password')}
                  />
                  <View style={styles.iconinput}>
                    <Icon name="https" type="material" />
                  </View>
                </View>
              </View>
              <View>
                <Button
                  titleStyle={styles.signin}
                  title="Sign In"
                  buttonStyle={styles.signinhead}
                  onPress={() => this.handleLogin()}
                  loading={this.state.loading}
                />
              </View>
            </View>
          </View>
          {/* container bottom */}
          <View style={styles.containerbottom}>
            <View style={styles.headerbottom}>
              <Text>Don't have an account ? </Text>
              <TouchableOpacity onPress={() => this.handleRegis()}>
                <Text style={styles.signup}> Sign up </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
)(Login);
