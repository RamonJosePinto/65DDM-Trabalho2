import React, {useState, useEffect, useCallback} from "react";
import {View, Text, FlatList, StyleSheet} from "react-native";
import {Calendar} from "react-native-calendars";
import {getDatabase} from "../sqliteConfig";
import {useFocusEffect} from "@react-navigation/native";

interface Task {
    id: number;
    title: string;
    data: string;
    completed: number;
}

interface MarkedDates {
    [key: string]: {
        marked: boolean;
        dotColor: string;
    };
}

const CalendarScreen = () => {
    const [markedDates, setMarkedDates] = useState<MarkedDates>({});
    const [progress, setProgress] = useState(0);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedMonth, setSelectedMonth] = useState({
        month: new Date().getMonth() + 1, // Mês atual (1-12)
        year: new Date().getFullYear(), // Ano atual
    });

    const fetchTasks = async () => {
        const db = getDatabase();
        try {
            const rows: Task[] = await db.getAllAsync(`
        SELECT id, title, data, completed
        FROM tasks;
      `);

            const dates: MarkedDates = {};
            let completedCount = 0;

            const tasksThisMonth = rows.filter(task => {
                const taskDate = new Date(task.data);
                return taskDate.getMonth() + 1 === selectedMonth.month && taskDate.getFullYear() === selectedMonth.year;
            });

            tasksThisMonth.forEach(task => {
                const date = task.data.split("T")[0];
                if (!dates[date]) {
                    dates[date] = {
                        marked: true,
                        dotColor: task.completed ? "green" : "red",
                    };
                }
                if (task.completed) {
                    completedCount++;
                }
            });

            setMarkedDates(dates);
            setTasks(tasksThisMonth);

            const totalTasks = tasksThisMonth.length;
            setProgress(totalTasks > 0 ? completedCount / totalTasks : 0);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [selectedMonth]);

    useFocusEffect(
        useCallback(() => {
            fetchTasks();
        }, [selectedMonth])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.progressText}>Progresso do Mês: {Math.round(progress * 100)}%</Text>
            <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarForeground, {width: `${progress * 100}%`}]} />
            </View>
            <Calendar
                markedDates={markedDates}
                theme={{
                    selectedDayBackgroundColor: "#00adf5",
                    todayTextColor: "#00adf5",
                    arrowColor: "#00adf5",
                }}
                onMonthChange={(month: any) => {
                    setSelectedMonth({month: month.month, year: month.year});
                }}
            />
            <Text style={styles.tasksTitle}>Tarefas do Mês</Text>
            <FlatList
                data={tasks}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <View style={styles.taskItem}>
                        <Text style={styles.taskTitle}>
                            {item.title} - <Text style={[styles.taskStatus, {color: item.completed ? "green" : "red"}]}>{item.completed ? "Concluída" : "Pendente"}</Text>
                        </Text>
                        <Text style={styles.taskDate}>Data: {new Date(item.data).toLocaleDateString("pt-BR")}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyMessage}>Nenhuma tarefa para este mês.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20, marginTop: 20},
    progressText: {fontSize: 18, marginBottom: 10},
    progressBarBackground: {
        width: "100%",
        height: 10,
        backgroundColor: "#D3D3D3",
        borderRadius: 5,
        marginBottom: 20,
        overflow: "hidden",
    },
    progressBarForeground: {
        height: "100%",
        backgroundColor: "#4CAF50",
    },
    tasksTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    },
    taskItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    taskStatus: {
        fontSize: 14,
    },
    taskDate: {
        fontSize: 14,
        color: "#666",
    },
    emptyMessage: {textAlign: "center", fontSize: 16, color: "#666", marginTop: 20},
});

export default CalendarScreen;
