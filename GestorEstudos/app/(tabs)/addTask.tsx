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
            setMessage("Task added successfully!");
            setTaskTitle("");
            setTaskDescription("");
            setSubjectId(null);
        } catch (error) {
            console.error(error);
            setMessage("Failed to add task.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Add a new task:</Text>
            <TextInput style={styles.input} placeholder="Enter task title" value={taskTitle} onChangeText={setTaskTitle} />
            <TextInput style={styles.input} placeholder="Enter task description" value={taskDescription} onChangeText={setTaskDescription} />
            <Picker selectedValue={subjectId} style={styles.picker} onValueChange={itemValue => setSubjectId(itemValue)}>
                <Picker.Item label="Select a subject" value={null} />
                {subjects.map(subject => (
                    <Picker.Item key={subject.id} label={subject.name} value={subject.id} />
                ))}
            </Picker>
            <Button title="Add Task" onPress={handleAddTask} />
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
    label: {
        fontSize: 18,
        marginBottom: 10,
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
