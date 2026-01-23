import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text, View } from 'react-native';

const options = ['Game', 'Movie', 'Book'];

const fontColor = '#333';

export default function Index() {
  const [what, setWhat] = useState('Game');

  const onValueChange = (v: string) => setWhat(v);

  return (
    <View style={styles.root}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={what}
          itemStyle={styles.pickerItem}
          onValueChange={onValueChange}
        >
          {options.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
      </View>
      <Text style={styles.ofTheText}>of the</Text>
      <Text style={styles.yearText}>Year</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  pickerItem: {
    fontSize: 72,
    fontWeight: 'bold',
    height: 88,
  },
  ofTheText: {
    fontSize: 52,
    fontWeight: '700',
    color: fontColor,
    marginVertical: 16,
  },
  yearText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: fontColor,
  },
});
