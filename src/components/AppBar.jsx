import { View, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { Link } from 'react-router-native';
import theme from '../theme';
import Text from './Text';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.primary,
    padding: 15,
  },
  scroll: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },
  text: {
    fontSize: theme.fontSizes.subheading,
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
  },
});

const AppBar = () => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.scroll}>

        <Link to="/" style={styles.tab}>
          <Text style={styles.text}>My lessons</Text>
        </Link>

        <Link to="/students" style={styles.tab}>
          <Text style={styles.text}>My students</Text>
        </Link>

      </ScrollView>
    </View>
  );
};

export default AppBar;