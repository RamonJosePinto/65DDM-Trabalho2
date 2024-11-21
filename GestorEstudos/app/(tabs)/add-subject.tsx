import React, {useState} from "react";
import {View, Text, TextInput, Button, StyleSheet} from "react-native";
import {useRouter} from "expo-router";

export default function AddSubjectScreen() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSave = () => {
        // Lógica para salvar no banco SQLite
        console.log("Salvar matéria:", name, description);
        router.push("/");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adicionar Matéria</Text>
            <TextInput style={styles.input} placeholder="Nome da matéria" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Descrição" value={description} onChangeText={setDescription} />
            <Button title="Salvar" onPress={handleSave} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20},
    title: {fontSize: 20, fontWeight: "bold", marginBottom: 20},
    input: {borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5},
});
