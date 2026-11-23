"use client";

import { FormEvent, useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/tasks";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTasks() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Tasks load nahi ho paaye");
      setTasks(await response.json());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Backend se connection nahi ho raha",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        },
      );

      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || "Task save nahi hua");
      }

      setTitle("");
      setDescription("");
      setEditingId(null);
      await loadTasks();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Task save nahi ho paaya",
      );
    }
  }

  function editTask(task: Task) {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle("");
    setDescription("");
  }

  async function deleteTask(id: number) {
    setError("");
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Task delete nahi hua");
      await loadTasks();
      if (editingId === id) cancelEdit();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Task delete nahi ho paaya",
      );
    }
  }

  return (
    <main className="app-shell">
      <section className="todo-card">
        <header className="card-header">
          <div>
            <p className="eyebrow">MY WORKSPACE</p>
            <h1>Task Manager</h1>
          </div>
          <div className="task-count">{tasks.length}</div>
        </header>

        <form className="task-form" onSubmit={submitTask}>
          <label htmlFor="title">Task title</label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs to be done?"
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add more details..."
            required
            rows={3}
          />

          <div className="form-actions">
            {editingId && (
              <button
                type="button"
                className="cancel-button"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
            <button type="submit" className="primary-button">
              {editingId ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>

        {error && <div className="error-message">{error}</div>}

        <div className="task-list">
          {loading ? (
            <p className="empty-state">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="empty-state">
              No tasks yet. Add your first task above.
            </p>
          ) : (
            tasks.map((task) => (
              <article className="task-item" key={task.id}>
                <div className="task-copy">
                  <h2>{task.title}</h2>
                  <p>{task.description}</p>
                </div>
                <div className="task-actions">
                  <button
                    type="button"
                    className="icon-button edit-button"
                    onClick={() => editTask(task)}
                    aria-label={`Edit ${task.title}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="icon-button delete-button"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
