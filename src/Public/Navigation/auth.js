import {createStackNavigator} from 'react-navigation-stack';
import Login from '../../Auth/Login';
import Regis from '../../Auth/Register';

export default createStackNavigator({
  Login,
  Regis,
});
