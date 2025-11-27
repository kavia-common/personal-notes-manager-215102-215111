import { supabase } from '../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * listNotes: lists notes for the current authenticated user.
 * Assumes notes table with RLS enforcing user_id = auth.uid().
 */
export async function listNotes() {
  const { data, error } = await supabase
    .from('notes')
    .select('id, user_id, title, content, created_at, updated_at')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data || []).map((n) => ({
    id: n.id,
    userId: n.user_id,
    title: n.title,
    content: n.content,
    createdAt: n.created_at,
    updatedAt: n.updated_at,
  }));
}

/**
 * PUBLIC_INTERFACE
 * createNote: creates a note for the current user.
 */
export async function createNote({ title, content }) {
  // user_id will be set from RLS using auth.uid(); also include for clarity.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const uid = user?.id || null;

  const payload = {
    user_id: uid || undefined,
    title: title?.trim() || 'Untitled note',
    content: content || '',
  };

  const { data, error } = await supabase
    .from('notes')
    .insert([payload])
    .select('id, user_id, title, content, created_at, updated_at')
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    content: data.content,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * PUBLIC_INTERFACE
 * updateNote: updates note title/content by id for the current user.
 */
export async function updateNote(id, { title, content }) {
  const patch = {};
  if (typeof title === 'string') patch.title = title.trim() || 'Untitled note';
  if (typeof content === 'string') patch.content = content;

  const { data, error } = await supabase
    .from('notes')
    .update(patch)
    .eq('id', id)
    .select('id, user_id, title, content, created_at, updated_at')
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    content: data.content,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * PUBLIC_INTERFACE
 * deleteNote: deletes a note by id for the current user.
 */
export async function deleteNote(id) {
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw error;
  return { id };
}
