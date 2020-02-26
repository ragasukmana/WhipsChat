import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import App from './app';
import Auth from './auth';
import Loading from './loading';

const switchNavigator = createSwitchNavigator(
  {
    Loading,
    Auth,
    App,
  },
  {
    initialRouteName: 'Loading',
  },
);

export default createAppContainer(switchNavigator);
