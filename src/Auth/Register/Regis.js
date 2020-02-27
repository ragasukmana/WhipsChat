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

class Regis extends Component {
  hadleLogin = () => {
    this.props.navigation.navigate('Login');
  };
  static navigationOptions = {
    headerShown: false,
  };

  state = {
    email: '',
    password: '',
    loading: false,
    name: '',
  };

  handleChange = (text, type) => {
    this.setState({ [type]: text });
  };

  handleRegis = () => {
    let db = firebaseApp.database();
    this.setState({ loading: true });
    const { email, password } = this.state;
    firebaseApp
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(credentialUser => {
        db.ref('/users')
          .child(credentialUser.user.uid)
          .set({
            name: this.state.name,
            email: this.state.email,
            uid: credentialUser.user.uid,
            status: 'Hello Gorgeous World',
          });
      })
      .then(() => {
        this.props.requestAuth();
        this.props.navigation.navigate('Login');
      })
      .catch(function(error) {
        var errorMessage = error.message;
        toast(errorMessage);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.hadleLogin()}>
          <View style={styles.iconbacklogin}>
            <Icon size={40} name="keyboard-arrow-left" type="material" />
          </View>
        </TouchableOpacity>
        <ScrollView>
          <View style={styles.header}>
            <Image
              source={require('../../Public/Assets/logos/logo.png')}
              style={styles.logo}
            />
            <Text style={styles.titlesignup}> Sign Up </Text>
          </View>
          {/* ini container body */}
          <View style={styles.containerbody}>
            <View style={styles.headerinput}>
              <View style={styles.containerinput}>
                <View style={styles.email}>
                  <TextInput
                    placeholder="Name"
                    onChangeText={text => this.handleChange(text, 'name')}
                  />
                  <View style={styles.iconinput}>
                    <Icon name="person" type="material" />
                  </View>
                </View>
                <View style={styles.password}>
                  <TextInput
                    placeholder="Email"
                    onChangeText={text => this.handleChange(text, 'email')}
                  />
                  <View style={styles.iconinput}>
                    <Icon name="email" type="material" />
                  </View>
                </View>
                <View style={styles.password}>
                  <TextInput
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={text => this.handleChange(text, 'password')}
                  />
                  <View style={styles.iconinput}>
                    <Icon name="https" type="material" />
                  </View>
                </View>
              </View>
              <View>
                <Button
                  titleStyle={styles.signin}
                  title="Sign Up"
                  buttonStyle={styles.signinhead}
                  onPress={() => this.handleRegis()}
                  loading={this.state.loading}
                />
              </View>
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
  requestAuth: () => dispatch({ type: 'POST_REGISTER_FULFILLED' }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Regis);
