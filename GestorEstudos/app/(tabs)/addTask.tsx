import React, {useState} from "react";
import {View, Text, TextInput, Button, StyleSheet} from "react-native";
import {useRouter} from "expo-router";

export default function AddTaskScreen() {
    const router = useRouter();
    const [taskName, setTaskName] = useState("");
    const [dueDate, setDueDate] = useState("");

    const handleSave = () => {
        // Lógica para salvar no banco SQLite
        console.log("Salvar tarefa:", taskName, dueDate);
        router.push("/tasks");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adicionar Tarefa</Text>
            <TextInput style={styles.input} placeholder="Nome da tarefa" value={taskName} onChangeText={setTaskName} />
            <TextInput style={styles.input} placeholder="Prazo (AAAA-MM-DD)" value={dueDate} onChangeText={setDueDate} />
            <Button title="Salvar" onPress={handleSave} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20},
    title: {fontSize: 20, fontWeight: "bold", marginBottom: 20},
    input: {borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5},
});
