import {ToastAndroid} from 'react-native';

function toast(props) {
  ToastAndroid.showWithGravityAndOffset(
    props,
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    0,
    120,
  );
}

export default toast;
