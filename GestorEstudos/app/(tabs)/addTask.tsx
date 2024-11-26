import React, {useState, useCallback} from "react";
import {View, TextInput, Button, StyleSheet, Text} from "react-native";
import {Picker} from "@react-native-picker/picker";
import {getDatabase} from "../sqliteConfig";
import {Subject} from "@/types/types";
import {useFocusEffect} from "@react-navigation/native";

const AddTask = () => {
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [subjectId, setSubjectId] = useState<number | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [message, setMessage] = useState("");

    const fetchSubjects = async () => {
        const db = getDatabase();
        try {
            const rows = await db.getAllAsync("SELECT * FROM subjects;");
            setSubjects(rows);
        } catch (error) {
            console.error(error);
        }
    };

    // Atualizar as matérias sempre que a tela ganhar foco
    useFocusEffect(
        useCallback(() => {
            fetchSubjects();
        }, [])
    );

    const handleAddTask = async () => {
        const db = getDatabase();
        try {
            await db.runAsync("INSERT INTO tasks (title, description, subjectId) VALUES (?, ?, ?);", [taskTitle, taskDescription, subjectId]);
            setMessage("Tarefa adicionada com sucesso!");
            setTaskTitle("");
            setTaskDescription("");
            setSubjectId(null);
        } catch (error) {
            console.error(error);
            setMessage("Erro ao adicionar tarefa.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adicionar Tarefa</Text>
            <TextInput style={styles.input} placeholder="Digite o título da tarefa" value={taskTitle} onChangeText={setTaskTitle} />
            <TextInput style={styles.input} placeholder="Digite a descrição da tarefa" value={taskDescription} onChangeText={setTaskDescription} />
            <Picker selectedValue={subjectId} style={styles.picker} onValueChange={itemValue => setSubjectId(itemValue)}>
                <Picker.Item label="Selecione uma matéria" value={null} />
                {subjects.map(subject => (
                    <Picker.Item key={subject.id} label={subject.name} value={subject.id} />
                ))}
            </Picker>
            <Button title="Adicionar Tarefa" onPress={handleAddTask} />
            {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 20,
    },
    title: {
        fontSize: 24, // Mesmo tamanho do título em index.tsx
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    picker: {
        height: 50,
        marginBottom: 20,
    },
    message: {
        marginTop: 10,
        color: "green",
    },
});

export default AddTask;
