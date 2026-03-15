import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import api from '../api/client';
import { Task, TaskStatus } from '../types';
import { useNavigate } from 'react-router-dom';

type ColumnId = 'TODO' | 'IN_PROGRESS' | 'DONE';

const columns: { id: ColumnId; title: string }[] = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'DONE', title: 'Done' }
];

const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await api.get<Task[]>('/tasks');
      setTasks(res.data);
    } catch {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('taskflow_token');
    navigate('/login');
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const optimistic: Task = {
      id: Date.now(),
      title: newTitle,
      description: newDescription || null,
      status: 'TODO'
    };
    setTasks((prev) => [...prev, optimistic]);
    setNewTitle('');
    setNewDescription('');
    try {
      const res = await api.post<Task>('/tasks', {
        title: optimistic.title,
        description: optimistic.description,
        status: 'TODO' as TaskStatus
      });
      setTasks((prev) => prev.map((t) => (t.id === optimistic.id ? res.data : t)));
    } catch {
      setTasks((prev) => prev.filter((t) => t.id !== optimistic.id));
      setError('Failed to create task');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = Number(draggableId);
    const newStatus = destination.droppableId as TaskStatus;

    const prevTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      await api.put(`/tasks/${taskId}`, {
        title: task.title,
        description: task.description,
        status: newStatus
      });
    } catch {
      setTasks(prevTasks);
      setError('Failed to update task status');
    }
  };

  const renderColumnTasks = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <p className="text-slate-300 text-sm">Loading your board...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-indigo-500 flex items-center justify-center text-xs font-bold">
            TF
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide">TaskFlow</span>
            <span className="text-[11px] text-slate-400">Personal Board</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-100 border border-slate-700/80 transition"
        >
          Log out
        </button>
      </header>

      <main className="flex-1 flex flex-col gap-4 p-4">
        <section className="max-w-5xl">
          <form
            onSubmit={handleAddTask}
            className="bg-slate-900/70 rounded-xl px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center shadow-sm border border-slate-800/80"
          >
            <div className="flex-1 flex flex-col gap-2 md:flex-row">
              <input
                className="flex-1 rounded-md bg-slate-950 border border-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add a card title…"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <input
                className="flex-1 rounded-md bg-slate-950 border border-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Optional description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="self-start md:self-auto px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 font-medium text-sm shadow-sm"
            >
              Add card
            </button>
          </form>
          {error && (
            <p className="mt-2 text-xs text-red-400 bg-red-950/40 border border-red-700/60 rounded-md px-3 py-2 inline-block">
              {error}
            </p>
          )}
        </section>

        <section className="flex-1 overflow-x-auto pb-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 min-h-[340px] w-max">
              {columns.map((col) => (
                <Droppable droppableId={col.id} key={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`w-72 flex-shrink-0 rounded-xl bg-slate-900/80 border border-slate-800/80 px-3 py-3 flex flex-col shadow-sm ${
                        snapshot.isDraggingOver ? 'ring-2 ring-indigo-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-semibold text-slate-100">
                          {col.title}
                        </h2>
                        <span className="text-[11px] text-slate-500">
                          {renderColumnTasks(col.id as TaskStatus).length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {renderColumnTasks(col.id as TaskStatus).map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={String(task.id)}
                            index={index}
                          >
                            {(dragProvided, dragSnapshot) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                className={`rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 shadow-sm cursor-pointer transition text-sm ${
                                  dragSnapshot.isDragging
                                    ? 'ring-2 ring-indigo-400 scale-[1.02] shadow-lg'
                                    : 'hover:border-slate-600 hover:bg-slate-900'
                                }`}
                              >
                                <p className="font-medium text-slate-100">{task.title}</p>
                                {task.description && (
                                  <p className="mt-1 text-[11px] leading-snug text-slate-400 line-clamp-3">
                                    {task.description}
                                  </p>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;

