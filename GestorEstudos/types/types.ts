// types.d.ts

export interface Subject {
    id: number;
    name: string;
    taskCount?: number; // Opcional, usado para calcular tarefas associadas
    progress?: number; // Opcional, usado para o progresso da matéria
}

export interface Task {
    id: number;
    title: string;
    description?: string; // Opcional
    subjectId: number;
    completed: number; // 0 para não concluída, 1 para concluída
}

export interface SubjectRow {
    id: number;
    name: string;
    taskCount: number;
    completedCount: number;
}
