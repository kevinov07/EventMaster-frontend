export interface AppEvent {
    id?: number;
    title: string;
    date: string;
    location: string;
    description: string;
    category: string;
    time: string;
    userId: number;
}

export interface EventFilters {
    title?: string;
    category?: string;
    date?: string;
    location?: string;
}