import React, {useState, useEffect, useCallback} from "react";
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from "react-native";
import {useRouter, useLocalSearchParams} from "expo-router";
import {getDatabase} from "../sqliteConfig";
import {useFocusEffect} from "@react-navigation/native";
import {Task} from "@/types/types";

export default function TasksScreen() {
    const router = useRouter();
    const {subjectId} = useLocalSearchParams();
    const [tasks, setTasks] = useState<Task[]>([]);

    const fetchTasks = async () => {
        const db = getDatabase();
        try {
            const rows = await db.getAllAsync("SELECT * FROM tasks WHERE subjectId = ?;", [subjectId]);
            setTasks(rows);
        } catch (error) {
            console.error(error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTasks();
        }, [subjectId])
    );

    const handleAddTask = () => {
        router.push(`/addTask?subjectId=${subjectId}`);
    };

    const toggleCompleted = async (taskId: number, currentStatus: number) => {
        const db = getDatabase();
        try {
            await db.runAsync("UPDATE tasks SET completed = ? WHERE id = ?;", [currentStatus === 1 ? 0 : 1, taskId]);
            fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tarefas</Text>
            <FlatList
                data={tasks}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <View style={styles.taskItem}>
                        <View style={styles.taskContent}>
                            <Text style={styles.taskTitle}>{item.title}</Text>
                            {item.description && <Text style={styles.taskDescription}>{item.description}</Text>}
                            {item.data && <Text style={styles.taskDate}>Data: {formatDate(item.data)}</Text>}
                        </View>
                        <TouchableOpacity
                            style={[styles.statusCircle, item.completed === 1 && styles.statusCircleCompleted]}
                            onPress={() => toggleCompleted(item.id, item.completed)}
                        />
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyMessage}>Nenhuma tarefa cadastrada.</Text>}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20, marginTop: 20},
    title: {fontSize: 24, fontWeight: "bold", marginBottom: 20},
    taskItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    taskContent: {flex: 1},
    taskTitle: {fontSize: 18, fontWeight: "bold"},
    taskDescription: {fontSize: 14, color: "#666", marginTop: 5},
    taskDate: {fontSize: 14, color: "#888", marginTop: 5},
    statusCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#4D96FF",
    },
    statusCircleCompleted: {
        backgroundColor: "#4CAF50",
        borderColor: "#4CAF50",
    },
    emptyMessage: {textAlign: "center", fontSize: 16, color: "#666", marginTop: 20},
    addButton: {
        position: "absolute",
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#4D96FF",
        justifyContent: "center",
        alignItems: "center",
    },
    addButtonText: {fontSize: 30, color: "#FFF", fontWeight: "bold"},
});
