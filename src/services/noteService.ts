import axios from 'axios';
import type { Note } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;
const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}

export async function fetchNotes({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  if (search.trim() !== '') {
    params.search = search.trim();
  }

  const response = await client.get<FetchNotesResponse>('/notes', { params });
  return response.data;
}


export async function createNote(
  note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Note> {
  const response = await client.post<Note>('/notes', note);
  return response.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const response = await client.delete<Note>(`/notes/${noteId}`);
  return response.data;
}
