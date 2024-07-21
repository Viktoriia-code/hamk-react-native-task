import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, Modal, Pressable, ScrollView, StyleSheet, TextInput, Touchable, View } from 'react-native';
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
    width: '100%',
  },
  textInput1: {
    borderColor: 'black',
    borderWidth: 2,
    padding: 5,
    backgroundColor: 'lightblue',
    width: '20%',
    paddingVertical: 10,
  },
  textInput2: {
    borderColor: 'black',
    borderWidth: 2,
    padding: 5,
    backgroundColor: 'lightblue',
    width: '70%',
    paddingVertical: 10,
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
    gap: 15
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: 200,
    paddingHorizontal: 8,
  },
});

const UpdateBootComponent = ({ visible, onClose, bootToUpdate, updateIndex, updateBoot }) => {
  const [id, setId] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    setId(bootToUpdate==undefined ? "" :bootToUpdate.id);
    setType(bootToUpdate==undefined ? "" :bootToUpdate.type);
  }, [bootToUpdate, visible]);

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalStyle}>
        <Text style={styles.header}>Info about the lesson</Text>
        <View style={styles.wrapper}>
          <TextInput
            placeholder="Boot ID..."
            style={styles.textInput}
            value={id}
            onChangeText={setId}
          />
          <TextInput
            placeholder="Boot type..."
            style={styles.textInput}
            value={type}
            onChangeText={setType}
          />
        </View>
        <View style={styles.wrapper}>
          <View>
            <Button title="Cancel" onPress={onClose} />
          </View>
          <View>
            <Button
              title="Update"
              onPress={() => updateBoot(updateIndex, {id: Number(id), type: type})}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function LessonList() {
  let [value1, setValue1] = useState('');
  let [value2, setValue2] = useState('');
  const [bootList, setBootList]=useState([]);
  const [modalVisible, setModalVisible]=useState(false);
  const [updateModalVisible, setUpdateModalVisible]=useState(false);
  const [updateIndex, setUpdateIndex] = useState(0);
  const [bootToUpdate, setBootToUpdate] = useState(null);

  const fetchBootList = async () => {
    const configurationObject = {
      method: 'get',
      url: BASE_URL,
    };
    const response = await axios(configurationObject);
    setBootList(response.data);
  };
  // To fetch data
  {/*const fetchBootList=async()=>{
    try{
      let response=await fetch("http://127.0.0.1:3000/data");
      let json=await response.json();
      setBootList(json);
    }
    catch(error){
      console.log(error);
    }
  }*/}

  useEffect(() => {
    fetchBootList();
  }, []);

  // To add a new boot
  const postBoot=async()=>{
    try{
      let response=await fetch("http://192.168.0.4:8080/data",
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({id: Number(value1), name: value2})
      });
      let json=await response.json();
      setBootList(json);
    }
    catch(error){
      console.log(error);
    }
  }
  
  // To delete a boot
  const deleteBoot = async (item_index) => {
    try {
      let response = await fetch(`http://127.0.0.1:3000/data/${item_index}`, {
        method: 'DELETE',
      });
      let updatedBootList = await response.json();
      if (!response.ok) {
        console.error(updatedBootList.error);
      } else {
        setBootList(updatedBootList);
      }
    } catch (error) {
      console.log('Fetch error:', error);
    }
  };

  // To update a boot
  const updateBoot = async (item_index, updatedBootData) => {
    try {
      let response = await fetch(`http://127.0.0.1:3000/data/${item_index}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBootData) // Use the updated boot data
      });
      let updatedBootList = await response.json();
      if (!response.ok) {
        console.error('Update failed:', updatedBootData.error);
      } else {
        setBootList(updatedBootList);
        setUpdateModalVisible(false);
      }
    } catch (error) {
      console.log('Fetch error:', error);
    }
  };
  
  const handleSubmit=()=>{
    postBoot();
    setValue1('');
    setValue2('');
    setModalVisible(false);
  }
  
  const deleteFish=(removeId)=>{
    deleteBoot(removeId);
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
    setBootToUpdate(bootList[index]);
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
            <TextInput placeholder='Boot ID...' style={styles.textInput1} value={value1} onChangeText={setValue1}/>
            <TextInput placeholder='Boot type...' style={styles.textInput2} value={value2} onChangeText={setValue2}/>
          </View>
          <View style={styles.wrapper}>
            <View style={styles.buttonstyle}><Button title='Cancel' onPress={handleCancel} /></View>
            <View style={styles.buttonstyle}><Button title='Ok' onPress={handleSubmit} /></View>
          </View>
        </View>
      </Modal>
      <Pressable onPress={showInputModal} style={styles.buttonAdd}>
        <PlusIcon style={styles.buttonIcon} />
      </Pressable>
      <Text style={styles.header}>Lessons list</Text>
      <ScrollView style={styles.list}>
        {bootList.map((item, index)=>(
          <Pressable key={index} onLongPress={()=>deleteFish(index)} onPress={()=>handleUpdate(index)}>
            <View style={styles.listItem} key={index}>
              <Text>{item.name}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}
