import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useActivity } from '../context/ActivityContext';


export default function DaySelector() {
    const [visible, setVisible] = useState<boolean>(false);
    const { selectedDate, setSelectedDate } = useActivity();

    const onDismiss = () => {
        setVisible(false);
    };

    const onConfirm = (date: Date) => {
        setSelectedDate(date);
        onDismiss();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
                <Ionicons name="calendar" size={24} color="#6200ee" />
                <Text style={styles.dateText}>
                    {selectedDate.toLocaleDateString()}
                </Text>
            </TouchableOpacity>
            {visible && (
                <DateTimePicker
                    mode="date"
                    value={selectedDate}
                    minimumDate={new Date()}
                    maximumDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                    onChange={(event, date) => date && onConfirm(date)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    title: { marginBottom: 16, textAlign: 'center' },
    button: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, borderRadius: 4 },
    dateText: { color: '#6200ee', fontSize: 16 }
});