import React, {useState} from "react";
import {View, TextInput, Button, StyleSheet, Text} from "react-native";
import {getDatabase} from "../sqliteConfig";

const AddSubject = () => {
    const [subjectName, setSubjectName] = useState("");
    const [message, setMessage] = useState("");

    const handleAddSubject = async () => {
        const db = getDatabase();
        try {
            const result = await db.runAsync("INSERT INTO subjects (name) VALUES (?);", [subjectName]);
            setMessage("Subject added successfully!");
            setSubjectName("");
        } catch (error) {
            console.error(error);
            setMessage("Failed to add subject.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Add a new subject:</Text>
            <TextInput style={styles.input} placeholder="Enter subject name" value={subjectName} onChangeText={setSubjectName} />
            <Button title="Add Subject" onPress={handleAddSubject} />
            {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 20
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
    message: {
        marginTop: 10,
        color: "green",
    },
});

export default AddSubject;
