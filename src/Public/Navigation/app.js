import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {View} from 'react-native';
import {Icon, Badge} from 'react-native-elements';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import Home from '../../App/Home';
import Chat from '../../App/Chat/Chat';
import Friends from '../../App/Profile';
import Setting from '../../App/Setting';
import styles from '../Component/style';
import Editname from '../../App/Setting/EditName';
import Editstatus from '../../App/Setting/EditStatus';
import Addfriend from '../../App/Profile/Addfriend/addfriend';

const Homescreen = createStackNavigator({
  Home: {
    screen: Home,
  },
  Chat: {
    screen: Chat,
  },
});

const Profilescreen = createStackNavigator({
  Friends: {
    screen: Friends,
  },
  Addfriend: {
    screen: Addfriend,
  },
});

const Settingscreen = createStackNavigator({
  Setting: {
    screen: Setting,
  },
  Editname: {
    screen: Editname,
  },
  Editstatus: {
    screen: Editstatus,
  },
});

// Homescreen.navigationOptions = ({navigation}) => {
//   let tabBarVisible;
//   if (navigation.state.routes.length > 1) {
//     navigation.state.routes.map(route => {
//       if (route.routeName === 'Chat') {
//         tabBarVisible = false;
//       } else {
//         tabBarVisible = true;
//       }
//     });
//   }
//   return {
//     tabBarVisible,
//   };
// };

export default createBottomTabNavigator(
  {
    Home: {
      screen: Homescreen,
      navigationOptions: () => ({
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon name="chat" type="material" size={22} color={tintColor} />
            <Badge
              value={99}
              status="primary"
              containerStyle={styles.badgeHomeScreen}
            />
          </View>
        ),
      }),
    },
    Friends: {
      screen: Profilescreen,
      navigationOptions: () => ({
        tabBarIcon: ({tintColor}) => (
          <Icon name="people" type="material" size={22} color={tintColor} />
        ),
      }),
    },
    Setting: {
      screen: Settingscreen,
      navigationOptions: () => ({
        tabBarIcon: ({tintColor}) => (
          <Icon name="settings" type="material" size={22} color={tintColor} />
        ),
      }),
    },
  },
  {
    tabBarOptions: {
      showLabel: false, // hide labels
      activeTintColor: '#2644F8', // active icon color
      inactiveTintColor: '#ABADC8', // inactive icon color
      style: {
        backgroundColor: '#FFFFFF', // TabBar background
      },
    },
  },
);
