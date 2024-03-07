import { CommonActions } from '@react-navigation/native';

let navigatorRef;

export const setNavigator = (ref) => {
  navigatorRef = ref;
};

export const navigateToLogin = () => {
  navigatorRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    })
  );
};

export const navigateToHome = () => {
  navigatorRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    })
  );
};