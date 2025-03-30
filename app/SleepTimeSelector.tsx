import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setSleepTime } from './store/slices/sleepTimeSlice';
import { RootState } from './store/store';


export default function SleepTimeSelector() {
    const dispatch = useDispatch();
    const sleepTime = useSelector((state: RootState) => state.sleepTime.sleepTime);
    const [visible,setVisible] = useState<{start:boolean; end:boolean}>({ start:false, end:false});

    const onDismiss = () =>{
        setVisible({start:false,end:false});
    };

    const onConfirm = (type: 'start'|'end',date:Date)=>{
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const time = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`;
        const newSleepTime = {...sleepTime,[type]:time}
        dispatch(setSleepTime(newSleepTime));
        onDismiss();
    }

    return (
        <View style={styles.container}>
            <Text variant="titleMedium" style={styles.title}>Schedule your Sleep</Text>
            <View style={styles.buttonContainer}>
                <Button
                mode='outlined'
                onPress = {()=>setVisible({...visible,start:true})}>
                    Sleep Time:{sleepTime.start}
                </Button>

                <Button
                mode='outlined'
                onPress = {()=>setVisible({...visible,end:true})}
                >
                    Wake Time : {sleepTime.end}
                </Button>
            </View>
            { visible.start &&
            <DateTimePicker
            mode="time"
            value = {new Date()}
            onChange={(event,date)=> date && onConfirm('start',date as Date)}
            />}

            { visible.end &&
            <DateTimePicker 
            mode="time"
            value = {new Date()}
            onChange={(event,date)=> date && onConfirm('end',date as Date)}
            />}
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        padding :16,
    },
    title :{
        marginBottom:16,
    },
    buttonContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        gap:16
    }
})