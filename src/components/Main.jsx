import { StyleSheet, View } from 'react-native';
import LessonList from './LessonList';
import StudentList from './StudentList';
import AppBar from './AppBar';
import theme from '../theme';
import { Navigate, Route, Routes } from 'react-router-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: theme.colors.bgMain,
  },
});

const Main = () => {
  return (
    <View style={styles.container}>
      <AppBar />
      <Routes>
        <Route path="/" element={<LessonList />} />
        <Route path="/students" element={<StudentList />} />
        {/* <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/students/:id" element={<SingleStudent />} exact />
        <Route path="/lessons/:id" element={<SingleLesson />} exact /> */}
      </Routes>
    </View>
  );
};

export default Main;