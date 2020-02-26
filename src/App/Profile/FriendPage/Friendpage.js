import React, {Component} from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import toast from '../../Public/Component/toast';
import {ListItem} from 'react-native-elements';
import {firebaseApp} from '../../config/firebase';
import styles from '../../Public/Component/style';
import ImagePicker from 'react-native-image-picker';
import {connect} from 'react-redux';

class friendpage extends Component {
  state = {
    photo: null,
    blobPhoto: null,
    dataProfile: [],
    dataUser: [],
  };
  render() {
    return (
      <View style={styles.headContainerSetting}>
        <View style={styles.containerSetting}>
          <View style={styles.headerImageSetting}>
            {this.props.auth.data.photoURL === null ? (
              <Image
                source={require('../../Public/Assets/images/default.png')}
                style={styles.imageSetting}
              />
            ) : (
              <Image
                source={{uri: dataProfile.photoURL}}
                style={styles.imageSetting}
              />
            )}
          </View>
          <View style={styles.headerChangePicture}>
            <TouchableOpacity onPress={() => this.handlePicture()}>
              <Text style={styles.colorFontChangePicture}>Change Pictures</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.containerBodySetting}>
            <View>
              <ListItem title="Email" subtitle={profile.email} bottomDivider />
              <TouchableOpacity
                activeOpacity={0.4}
                onPress={() => this.props.navigation.navigate('Editname')}>
                <ListItem
                  title="Name"
                  subtitle={profile.name}
                  bottomDivider
                  rightIcon={{name: 'keyboard-arrow-right', size: 32}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.4}
                onPress={() => this.props.navigation.navigate('Editstatus')}>
                <ListItem
                  title="Status"
                  subtitle={profile.status}
                  bottomDivider
                  rightIcon={{name: 'keyboard-arrow-right', size: 32}}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => this.handleLogout()}>
              <ListItem
                title="SignOut"
                bottomDivider
                rightIcon={{name: 'exit-to-app'}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default friendpage;
