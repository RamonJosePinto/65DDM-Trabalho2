import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { getDatabase } from "../sqliteConfig";

const AddSubject = () => {
  const [subjectName, setSubjectName] = useState("");
  const [message, setMessage] = useState("");

  const handleAddSubject = async () => {
    const db = getDatabase();
    try {
      await db.runAsync("INSERT INTO subjects (name) VALUES (?);", [subjectName]);
      setMessage("Matéria adicionada com sucesso!");
      setSubjectName("");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao adicionar matéria.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Matéria</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome da matéria"
        value={subjectName}
        onChangeText={setSubjectName}
      />
      <Button title="Adicionar Matéria" onPress={handleAddSubject} />
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
  message: {
    marginTop: 10,
    color: "green",
  },
});

export default AddSubject;
