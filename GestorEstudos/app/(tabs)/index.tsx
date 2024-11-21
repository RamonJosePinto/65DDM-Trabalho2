import React from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleAddSubject = () => {
    router.push('/add-subject');
  };

  const handleOpenTasks = (subjectId: number) => {
    router.push(`/tasks?subjectId=${subjectId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Matérias</Text>
      {/* Aqui você deve adicionar a lista de matérias (Mock para exemplo) */}
      <FlatList
        data={[{ id: 1, name: 'Matemática' }, { id: 2, name: 'Português' }]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleOpenTasks(item.id)}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Adicionar Matéria" onPress={handleAddSubject} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
});
