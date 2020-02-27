import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    flex: 0.3,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  titlesignup: {
    fontSize: 20,
    fontWeight: 'bold',
    opacity: 0.5,
  },
  iconbacklogin: {
    alignItems: 'flex-start',
    width: 50,
    marginTop: 30,
    marginLeft: 10,
  },
  iconinput: {
    position: 'absolute',
    bottom: 12,
    right: 20,
  },
  logo: {
    height: 190,
    width: 190,
  },
  containerbody: {
    flex: 0.5,
    alignItems: 'center',
    marginBottom: 5,
  },
  signinhead: {
    alignItems: 'center',
    backgroundColor: '#545CCB',
    borderRadius: 30,
    marginTop: 20,
    padding: 12,
  },
  headerinput: {
    marginTop: 10,
    width: 300,
    marginBottom: 10,
  },
  containerinput: {
    marginBottom: 10,
  },
  signin: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    borderColor: '#545CCB',
  },
  containerbottom: {
    flex: 0.2,
  },
  headerbottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 15,
  },
  email: {
    elevation: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 15,
  },
  password: {
    marginTop: 15,
    elevation: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 15,
  },
  signup: { color: '#545CCB' },
  containersplash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splash: {
    height: '100%',
    width: '100%',
  },
  containerSetting: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    margin: 30,
    alignItems: 'center',
  },
  headerImageSetting: {
    borderRadius: 80,
  },
  imageSetting: {
    width: 150,
    height: 150,
    borderRadius: 80,
  },
  containerBodySetting: { margin: 30, width: 300 },
  headContainerSetting: { flex: 1, backgroundColor: 'white' },
  badgeHomeScreen: { position: 'absolute', top: -10, right: -8 },
  containerHome: { backgroundColor: 'white', flex: 1 },
  headerChangePicture: { marginTop: 20 },
  colorFontChangePicture: { color: '#2644F8', fontSize: 15 },
  inputChangeProfile: {
    elevation: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginTop: 30,
  },
  containerInputChange: { backgroundColor: 'white', flex: 1, padding: 16 },
  buttonaddfriend: { position: 'absolute', bottom: 25, right: 15 },
  timeSend: { position: 'absolute', right: 10, top: 10 },
  avatarChat: { width: 30, height: 30 },
  containerLogoFL: { flexDirection: 'row' },
  marginLogoFL: { marginRight: 5 },
  pinMap: { height: 35, width: 35 },
});

export default styles;
