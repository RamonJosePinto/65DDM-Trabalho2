import React, {useState} from "react";
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from "react-native";
import {useRouter} from "expo-router";
import {getDatabase} from "../sqliteConfig";
import {useFocusEffect} from "@react-navigation/native";
import {Subject, SubjectRow} from "@/types/types";

export default function HomeScreen() {
    const router = useRouter();
    const [subjects, setSubjects] = useState<Subject[]>([]); // Use o tipo Subject[]

    const fetchSubjects = async () => {
        const db = getDatabase();
        try {
            const rows = await db.getAllAsync(`
        SELECT subjects.id, subjects.name,
          COUNT(tasks.id) AS taskCount,
          SUM(CASE WHEN tasks.completed = 1 THEN 1 ELSE 0 END) AS completedCount
        FROM subjects
        LEFT JOIN tasks ON tasks.subjectId = subjects.id
        GROUP BY subjects.id;
      `);
            setSubjects(
                rows.map((row: SubjectRow) => ({
                    ...row,
                    progress: row.taskCount > 0 ? row.completedCount / row.taskCount : 0,
                }))
            );
        } catch (error) {
            console.error(error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchSubjects();
        }, [])
    );

    const handleOpenTasks = (subjectId: number) => {
        router.push(`/tasks?subjectId=${subjectId}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Minhas Matérias</Text>
            <FlatList
                data={subjects}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                renderItem={({item, index}) => {
                    console.log("Rendering item:", item); // Adicione este log
                    return (
                        <TouchableOpacity style={[styles.card, {backgroundColor: cardColors[index % cardColors.length]}]} onPress={() => handleOpenTasks(item.id)}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <View style={styles.taskInfo}>
                                <Text style={styles.cardTaskCount}>{item.taskCount && item.taskCount > 0 ? `${item.taskCount} Tarefas` : "Nenhuma tarefa"}</Text>
                                {item.taskCount && item.taskCount > 0 && <Text style={styles.cardTaskPercentage}>{`${Math.round((item.progress ?? 0) * 100)}%`}</Text>}
                            </View>
                            {item.taskCount && item.taskCount > 0 && (
                                <View style={styles.progressBarBackground}>
                                    <View style={[styles.progressBarForeground, {width: `${(item.progress ?? 0) * 100}%`}]} />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                }}
                ListEmptyComponent={<Text style={styles.emptyMessage}>Nenhuma matéria cadastrada.</Text>}
            />
        </View>
    );
}

const cardColors = ["#f44236", "#4cb050", "#2196f3", "#FFC107", "#FF4081", "#29B6F6", "#673ab7", "#9c26b0"];

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20, marginTop: 20},
    title: {fontSize: 24, fontWeight: "bold", marginBottom: 20},
    card: {
        flex: 1,
        margin: 10,
        padding: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    cardTitle: {fontSize: 18, fontWeight: "bold", color: "#FFF"},
    taskInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 5,
    },
    cardTaskCount: {fontSize: 14, color: "#FFF"},
    cardTaskPercentage: {fontSize: 14, color: "#FFF"},
    progressBarBackground: {
        width: "100%",
        height: 10,
        backgroundColor: "#bdbdbd", // Cinza para a parte não preenchida
        borderRadius: 5,
        marginTop: 10,
        overflow: "hidden",
    },
    progressBarForeground: {
        height: "100%",
        backgroundColor: "#FFFFFF", // Branco para a parte preenchida
        borderRadius: 5, // Mantém o formato arredondado
    },
    emptyMessage: {textAlign: "center", fontSize: 16, color: "#666"},
});
