import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import styles from '../../../Public/Component/style';

class Friendpage extends Component {
  static navigationOptions = {
    title: 'Friend Page',
  };

  state = {
    friendInfo: this.props.navigation.state.params.info,
  };

  render() {
    const friend = this.state.friendInfo;
    return (
      <View style={styles.headContainerSetting}>
        <View style={styles.containerSetting}>
          <View style={styles.headerImageSetting}>
            {friend.photoURL === null ? (
              <Image
                source={require('../../../Public/Assets/images/default.png')}
                style={styles.imageSetting}
              />
            ) : (
              <Image
                source={{ uri: friend.photoURL }}
                style={styles.imageSetting}
              />
            )}
          </View>
          <View style={styles.containerBodySetting}>
            <View>
              <ListItem title="Email" subtitle={friend.email} bottomDivider />
              <ListItem title="Name" subtitle={friend.name} bottomDivider />
              <ListItem title="Status" subtitle={friend.status} bottomDivider />
            </View>
          </View>
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

export default connect(mapStateToProps)(Friendpage);
