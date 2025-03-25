import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

interface DaySelectorProps{
    onDateChange:(date:Date)=>void;
}

export default function DaySelector({onDateChange}:DaySelectorProps) {
const [visible,setVisible]= useState<boolean>(false);
const [day,setDay] = useState<Date>(new Date());

const onDismiss = () =>{
    setVisible(false);
};

const onConfirm = (date:Date)=>{
    setDay(date);
    onDateChange(date);
    onDismiss();
}

return (
    <View style={styles.container}>
        <Button style={styles.button}
        mode='outlined'
        onPress = {()=>setVisible(true)}>{day.toLocaleDateString()}</Button>
        { visible &&
        <DateTimePicker
        mode="date"
        value={day}
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