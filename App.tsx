import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AvatarCreator from './screen/AvatarCreator';

export default function App() {
  return (
    <View style={styles.container}>
     
     {/* 個人 */}
      <AvatarCreator/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
});
