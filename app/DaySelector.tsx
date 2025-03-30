import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDate } from './store/slices/dateSlice';
import { RootState } from './store/store';

export default function DaySelector() {
const [visible,setVisible]= useState<boolean>(false);
const dispatch = useDispatch();
const selectedDate = useSelector((state: RootState) => new Date(state.date.selectedDate));

const onDismiss = () =>{
    setVisible(false);
};

const onConfirm = (date:Date)=>{
    dispatch(setSelectedDate(date));
    onDismiss();
}

return (
    <View style={styles.container}>
        <Button style={styles.button}
        mode='outlined'
        onPress = {()=>setVisible(true)}>{selectedDate.toLocaleDateString()}</Button>
        { visible &&
        <DateTimePicker
        mode="date"
        value={selectedDate}
        minimumDate={new Date()}
        maximumDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
        onChange={(event, date) => date && onConfirm(date)}
        />}
    </View>
)
}

const styles = StyleSheet.create({
    container : {
        padding :16,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    title :{
        marginBottom:16,
        textAlign: 'center',
    },
    button:{
        flexDirection:'row',
        justifyContent:'center',
        gap:16
    }
})