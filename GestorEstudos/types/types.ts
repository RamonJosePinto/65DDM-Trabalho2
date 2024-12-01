export interface Subject {
    id: number;
    name: string;
    taskCount: number;
    progress: number;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    subjectId: number;
    completed: number; // 0 para não concluída, 1 para concluída
    data: string;
}

export interface SubjectRow {
    id: number;
    name: string;
    taskCount: number;
    completedCount: number;
}
