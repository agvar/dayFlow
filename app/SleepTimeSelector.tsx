import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SleepTime } from './types/types';


interface SleepTimeSelectorProps {
    onSleepTimeChange : (SleepTime:SleepTime) => void ;
}

export default function SleepTimeSelector({ onSleepTimeChange} :SleepTimeSelectorProps) {
    const [visible,setVisible] = useState<{start:boolean; end:boolean}>({ start:false, end:false});
    const [sleepTime,setSleepTime] = useState<{start:string; end:string}>({start: '22:00',end:'06:00'});

    const onDismiss = () =>{
        setVisible({start:false,end:false});
    };

    const onConfirm = (type: 'start'|'end',date:Date)=>{
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const time = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`;
        const newSleepTime = {...sleepTime,[type]:time}
        setSleepTime(newSleepTime);
        onSleepTimeChange(newSleepTime);
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