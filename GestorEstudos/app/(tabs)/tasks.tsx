import React from "react";
import {View, Text, FlatList, Button, StyleSheet} from "react-native";
import {useRouter, useLocalSearchParams} from "expo-router";

export default function TasksScreen() {
    const router = useRouter();
    const {subjectId} = useLocalSearchParams();

    const handleAddTask = () => {
        router.push("/tasks");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tarefas</Text>
            {/* Substituir pelo fetch das tarefas do SQLite */}
            <FlatList
                data={[
                    {id: 1, name: "Estudar Álgebra"},
                    {id: 2, name: "Revisar Gramática"},
                ]}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => <Text style={styles.item}>{item.name}</Text>}
            />
            <Button title="Adicionar Tarefa" onPress={handleAddTask} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20},
    title: {fontSize: 20, fontWeight: "bold", marginBottom: 20},
    item: {padding: 10, borderBottomWidth: 1, borderColor: "#ccc"},
});
