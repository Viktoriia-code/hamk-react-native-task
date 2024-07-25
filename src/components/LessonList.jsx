import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import theme from '../theme';
import { PlusIcon } from 'react-native-heroicons/solid'
import axios from 'axios';
import { BASE_URL } from '@env';
import Text from './Text';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgMain,
    alignItems: 'center',
    gap: 15,
    fontFamily: theme.fonts.main,
    paddingVertical: 15,
    paddingHorizontal: 10
  },
  header: {
    fontSize: theme.fontSizes.heading,
    textAlign: 'center',
    fontWeight: theme.fontWeights.bold,
  },
  wrapper: {
    flexDirection: 'col',
    gap: 10,
    width: '100%',
  },
  buttonAdd: {
    padding: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 100,
    position: 'absolute',
    bottom: 15,
    right: 15,
    zIndex: 100,
  },
  buttonIcon: {
    width: 30,
    height: 30,
    color: theme.colors.white
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: theme.fontWeights.medium,
    textAlign: 'center'
  },
  list: {
    width: '100%'
  },
  listItem: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flex: 1,
    padding: 15,
    marginBottom: 5
  },
  modalStyle: {
    padding: 15,
    gap: 15,
    backgroundColor: '#fefac0',
    height: '100%',
  },
  inputLabel: {
    fontWeight: theme.fontWeights.medium
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: 200,
    paddingHorizontal: 8,
    backgroundColor: theme.colors.white,
    width: '100%'
  },
  buttonCancel: {
    backgroundColor: theme.colors.error,
    padding: 10,
    minWidth: 80,
    borderRadius: theme.roundness,
  },
  buttonSubmit: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    minWidth: 80,
    borderRadius: theme.roundness,
  },
  buttonWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row'
  }
});

const UpdateBootComponent = ({ visible, onClose, bootToUpdate, updateIndex, updateBoot }) => {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    setId(bootToUpdate==undefined ? "" :bootToUpdate.id);
    setTitle(bootToUpdate==undefined ? "" :bootToUpdate.title);
  }, [bootToUpdate, visible]);

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalStyle}>
        <Text style={styles.header}>Info about the lesson</Text>
        <View style={styles.wrapper}>
          <Text style={styles.inputLabel}>ID:</Text>
          <TextInput placeholder='Enter student ID' style={styles.textInput} value={id} onChangeText={setId} />
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.inputLabel}>Name:</Text>
          <TextInput placeholder='Enter student name' style={styles.textInput} value={title} onChangeText={setTitle} />
        </View>
        <View style={styles.buttonWrapper}>
          <Pressable style={styles.buttonCancel} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.buttonSubmit} onPress={() => updateBoot(updateIndex, {id: Number(id), title: title})}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default function LessonList() {
  let [value1, setValue1] = useState('');
  let [value2, setValue2] = useState('');
  const [lessonList, setLessonList]=useState([]);
  const [modalVisible, setModalVisible]=useState(false);
  const [updateModalVisible, setUpdateModalVisible]=useState(false);
  const [updateIndex, setUpdateIndex] = useState(0);
  const [bootToUpdate, setBootToUpdate] = useState(null);

  const fetchLessonList = async () => {
    const configurationObject = {
      method: 'get',
      url: `${BASE_URL}/lessons`,
    };
    const response = await axios(configurationObject);
    setLessonList(response.data);
  };

  useEffect(() => {
    fetchLessonList();
  }, []);

  // To add a new lesson
  const postLesson = async () => {
    try{
      let response=await fetch(`${BASE_URL}/lessons`,
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({id: Number(value1), title: value2})
      });
      let json=await response.json();
      setLessonList(json);
    }
    catch(error){
      console.log(error);
    }
  }
  
  // To delete a lesson
  const deleteLesson = async (item_index) => {
    try {
      let response = await fetch(`${BASE_URL}/lessons/${item_index}`, {
        method: 'DELETE',
      });
      let updatedLessonList = await response.json();
      if (!response.ok) {
        console.error(updatedLessonList.error);
      } else {
        setLessonList(updatedLessonList);
      }
    } catch (error) {
      console.log('Fetch error:', error);
    }
  };

  // To update a lesson
  const updateBoot = async (item_index, updatedBootData) => {
    try {
      let response = await fetch(`${BASE_URL}/lessons/${item_index}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBootData) // Use the updated boot data
      });
      let updatedLessonList = await response.json();
      if (!response.ok) {
        console.error('Update failed:', updatedBootData.error);
      } else {
        setLessonList(updatedLessonList);
        setUpdateModalVisible(false);
      }
    } catch (error) {
      console.log('Fetch error:', error);
    }
  };
  
  const handleSubmit=()=>{
    postLesson();
    setValue1('');
    setValue2('');
    setModalVisible(false);
  }

  const showInputModal=()=>{
    setModalVisible(true);
  }

  const handleCancel=()=>{
    setValue1('');
    setValue2('');
    setModalVisible(false);
  }

  const handleUpdate=(index)=>{
    setUpdateIndex(index);
    setBootToUpdate(lessonList[index]);
    setUpdateModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <UpdateBootComponent
        visible={updateModalVisible}
        onClose={() => setUpdateModalVisible(false)}
        updateBoot={updateBoot}
        bootToUpdate={bootToUpdate}
        updateIndex={updateIndex}
      />
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalStyle}>
          <Text style={styles.header}>Add a new lesson</Text>
          <View style={styles.wrapper}>
            <Text style={styles.inputLabel}>Id:</Text>
            <TextInput
              placeholder='Boot ID...' 
              style={styles.textInput} 
              value={value1} 
              onChangeText={setValue1}/>
          </View>
          <View style={styles.wrapper}>
            <Text style={styles.inputLabel}>Lesson title:</Text>
            <TextInput 
              placeholder='Boot type...' 
              style={styles.textInput} 
              value={value2} 
              onChangeText={setValue2}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Pressable style={styles.buttonCancel} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.buttonSubmit} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Ok</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable onPress={showInputModal} style={styles.buttonAdd}>
        <PlusIcon style={styles.buttonIcon} />
      </Pressable>
      <Text style={styles.header}>Lessons list</Text>
      <ScrollView style={styles.list}>
        {lessonList.map((item, index)=>(
          <Pressable key={index} onLongPress={()=>deleteLesson(index)} onPress={()=>handleUpdate(index)}>
            <View style={styles.listItem} key={index}>
              <Text>{item.title}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}
