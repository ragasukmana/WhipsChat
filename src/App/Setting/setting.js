import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text, ScrollView } from 'react-native';
import toast from '../../Public/Component/toast';
import { ListItem } from 'react-native-elements';
import { firebaseApp } from '../../config/firebase';
import styles from '../../Public/Component/style';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';

class Setting extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  state = {
    photo: null,
    blobPhoto: null,
    dataProfile: [],
    dataUser: [],
    renderPhoto: null,
  };

  componentDidMount() {
    this.getUser();
    this.getDataUser();
  }

  getUser = () => {
    let db = firebaseApp.database();
    const id_user = this.props.auth.data.uid;
    try {
      db.ref(`/users/${id_user}`).on('value', snap => {
        let data = snap.val();
        this.setState({
          dataProfile: data,
        });
      });
    } catch (error) {
      toast(error);
    }
  };

  submitChangeFriend = photo => {
    this.setState({ loading: true });
    let authUpdate = firebaseApp.auth();
    let db = firebaseApp.database();
    let dataUpdate = {};
    const myid = this.props.auth.data.uid;
    authUpdate.currentUser
      .updateProfile({ photoURL: this.state.status })
      .then(() => {
        dataUpdate[`users/${myid}/photoURL`] = photo;
        db.ref('users')
          .orderByChild(`friend/${myid}`)
          .startAt('')
          .once('value')
          .then(snap => {
            const snapVal = snap.val();
            const otherUserKeys = snapVal == null ? [] : Object.keys(snapVal);
            otherUserKeys.forEach(key => {
              dataUpdate[`users/${key}/friend/${myid}/photoURL`] = photo;
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
                    `Chat/${keyIdChat}/member/${myid}/photoURL`
                  ] = photo;
                });
                db.ref().update(dataUpdate);
              });
            toast('Done');
          });
      })
      .catch(() => {
        toast('Failed update status');
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  handlePicture = () => {
    const options = {
      storageOption: {
        quality: 0.4,
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        toast('Take Image Cancel');
      } else if (response.error) {
        toast('Take Image Error');
      } else {
        this.setState({ renderPhoto: response.uri });
        const source = response;
        if (source) {
          const ext = source.fileName.split('.').pop();
          const filename = `${this.props.auth.data.uid}.${ext}`;
          this.setState({
            photo: source,
          });
          this.handleUpload(source.uri, filename)
            .then(snapshot => {
              const { fullPath } = snapshot.metadata;
              firebaseApp
                .storage()
                .ref()
                .child(fullPath)
                .getDownloadURL()
                .then(url => {
                  // const db = firebaseApp.database();
                  const user = firebaseApp.auth().currentUser;
                  this.submitChangeFriend(url);
                  // db.ref(`users/${user.uid}/photoURL/`).set(url);
                  user
                    .updateProfile({
                      photoURL: url,
                    })
                    .then(function() {
                      toast('image success uploaded');
                    })
                    .catch(function(error) {
                      toast(error);
                    });
                });
            })
            .catch(error => {
              toast(error);
            });
        }
      }
    });
  };

  handleUpload = async (uri, image_name) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebaseApp
      .storage()
      .ref()
      .child(`pictures/${image_name}`);

    return ref.put(blob);
  };

  handleLogout = () => {
    firebaseApp
      .auth()
      .signOut()
      .then(() => {
        toast('Account Success Sign Out');
        this.props.requestLogout();
        this.props.navigation.navigate('Auth');
      })
      .catch(function(error) {
        var errorMessage = error.message;
        toast(errorMessage);
      });
  };

  getDataUser = () => {
    let db = firebaseApp.database();
    let myid = this.props.auth.data.uid;
    try {
      db.ref(`/users/${myid}`).on('value', res => {
        let dataUser = res.val();
        this.setState({ dataUser: dataUser });
      });
    } catch (error) {
      toast(error);
    }
  };

  render() {
    const { dataProfile } = this.state;
    const profile = this.state.dataUser;

    return (
      <View style={styles.headContainerSetting}>
        <ScrollView>
          <View style={styles.containerSetting}>
            <View style={styles.headerImageSetting}>
              {this.props.auth.data.photoURL === null ? (
                <Image
                  source={
                    this.state.renderPhoto
                      ? { uri: this.state.renderPhoto }
                      : require('../../Public/Assets/images/default.png')
                  }
                  style={styles.imageSetting}
                />
              ) : (
                <Image
                  source={
                    this.state.renderPhoto
                      ? { uri: this.state.renderPhoto }
                      : { uri: dataProfile.photoURL }
                  }
                  style={styles.imageSetting}
                />
              )}
            </View>
            <View style={styles.headerChangePicture}>
              <TouchableOpacity onPress={() => this.handlePicture()}>
                <Text style={styles.colorFontChangePicture}>
                  Change Pictures
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.containerBodySetting}>
              <View>
                <ListItem
                  title="Email"
                  subtitle={profile.email}
                  bottomDivider
                />
                <TouchableOpacity
                  activeOpacity={0.4}
                  onPress={() => this.props.navigation.navigate('Editname')}>
                  <ListItem
                    title="Name"
                    subtitle={profile.name}
                    bottomDivider
                    rightIcon={{ name: 'keyboard-arrow-right', size: 32 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.4}
                  onPress={() => this.props.navigation.navigate('Editstatus')}>
                  <ListItem
                    title="Status"
                    subtitle={profile.status}
                    bottomDivider
                    rightIcon={{ name: 'keyboard-arrow-right', size: 32 }}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => this.handleLogout()}>
                <ListItem
                  title="Sign out"
                  bottomDivider
                  rightIcon={{ name: 'exit-to-app' }}
                />
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
  requestLogout: () => dispatch({ type: 'POST_LOGOUT' }),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Setting);
