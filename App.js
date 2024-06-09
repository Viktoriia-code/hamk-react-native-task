import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 15,
    gap: 15,
    //justifyContent: 'center',
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
  buttonstyle:{
    width:'30%',
  },
  list: {
    width: '90%',
    backgroundColor: 'yellow',
    padding: 10
  },
  listItem: {
    backgroundColor: '#90ee90',
    borderWidth: 3,
    borderColor: 'red',
    flex: 1,
    marginBottom: 10
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

const BootList = [
  {
    id: 0,
    type: 'Winter boot'
  },
  {
    id: 1,
    type: 'Summer boot'
  }
]

const UpdateBoot = ({ visible, onClose, onUpdate, bootToUpdate }) => {
  const [id, setId] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    setId(bootToUpdate==undefined ? "" :bootToUpdate.id);
    setType(bootToUpdate==undefined ? "" :bootToUpdate.type);
  }, [bootToUpdate, visible]);

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalStyle}>
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
              onPress={() => {onUpdate({ id, type })}}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function App() {
  let [value1, setValue1] = useState('');
  let [value2, setValue2] = useState('');
  const [bootList, setBootList]=useState(BootList);
  const [modalVisible, setModalVisible]=useState(false);
  const [updateModalVisible, setUpdateModalVisible]=useState(false);
  const [updateIndex, setUpdateIndex] = useState(0);
  const [bootToUpdate, setBootToUpdate] = useState(null);
  
  const handleSubmit=()=>{
    let newValue = {id: Number(value1), type: value2};
    setBootList(bootList=>[...bootList, newValue]);
    setValue1('');
    setValue2('');
    setModalVisible(false);
  }
  
  const deleteFish=(removeId)=>{
    setBootList(bootList=>bootList.filter((value1, index)=>index!=removeId));
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

  const updateBoot=(bootToUpdate)=>{
    setBootList((prevBootList) =>
      prevBootList.map((boot, index) =>
        index === updateIndex ? bootToUpdate : boot
      )
    );
    setUpdateModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <UpdateBoot
        visible={updateModalVisible}
        onClose={() => setUpdateModalVisible(false)}
        onUpdate={updateBoot}
        bootToUpdate={bootToUpdate}
      />
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalStyle}>
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
      <Button title='ADD BOOT' onPress={showInputModal} />
      <Text style={{textAlign: 'center'}}>Boot list</Text>
      <ScrollView style={styles.list}>
        {bootList.map((item, index)=>(
          <Pressable key={index} onLongPress={()=>deleteFish(index)} onPress={()=>handleUpdate(index)}>
            <View style={styles.listItem} key={index}>
              <Text>{item.id}: {item.type}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

