import { View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Profile } from './screens/Profile';

export default function Onboarding() {
  return (
    <Provider store={store}>
      <View
        style={{
          flex: 1,
        }}
      >
        <Profile />
      </View>
    </Provider>
  );
}
