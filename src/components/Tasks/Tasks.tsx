import { useState, useMemo } from "react";
import styles from "./Tasks.module.css";
import AddTaskModal from "../AddTaskModal/AddTaskModal";
import type { TaskFormData } from "../AddTaskModal/AddTaskModal";

type Task = {
  id: string;
  title: string;
  status: "default" | "active";
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Prepare project requirements", status: "default" },
    { id: "2", title: "Review client feedback", status: "default" },
  ]);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  /* ===============================
     Selection logic
  =============================== */

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedTasks = useMemo(
    () => tasks.filter((t) => selectedIds.has(t.id)),
    [tasks, selectedIds]
  );

  const canEdit = selectedTasks.length === 1;
  const canDelete = selectedTasks.length > 0;

  /* ===============================
     CRUD handlers
  =============================== */

  const handleAddTask = (data: TaskFormData) => {
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: data.title,
        status: data.status,
      },
    ]);
  };

  const handleEditTask = (data: TaskFormData) => {
    if (!editingTask) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: data.title,
              status: data.status,
            }
          : task
      )
    );
  };

  const handleDeleteTasks = () => {
    setTasks((prev) =>
      prev.filter((task) => !selectedIds.has(task.id))
    );
    setSelectedIds(new Set());
  };

  return (
    <>
      <section className={styles.tasks}>
        <header className={styles["tasks__header"]}>
          <h3 className={styles["tasks__title"]}>
          Task-manager <span>({tasks.length})</span>
          </h3>

          <div className={styles["tasks__actions"]}>
            <button
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
              aria-label="Add task"
            >
              <i className="fa-solid fa-plus" />
            </button>

            <button
              disabled={!canEdit}
              onClick={() => {
                setEditingTask(selectedTasks[0]);
                setIsModalOpen(true);
              }}
              aria-label="Edit task"
            >
              <i className="fa-solid fa-pen" />
            </button>

            <button
              disabled={!canDelete}
              onClick={handleDeleteTasks}
              aria-label="Delete tasks"
            >
              <i className="fa-solid fa-trash" />
            </button>
          </div>
        </header>

        <ul className={styles["tasks__list"]}>
          {tasks.map((task) => (
            <li
              key={task.id}
              className={styles["tasks__item"]}
            >
              <input
                type="checkbox"
                checked={selectedIds.has(task.id)}
                onChange={() => toggleSelect(task.id)}
              />

              <span className={styles["tasks__name"]}>
                {task.title}
              </span>

              <span
                className={`${styles["tasks__badge"]} ${
                  task.status === "active"
                    ? styles["tasks__badge--active"]
                    : styles["tasks__badge--default"]
                }`}
              >
                {task.status.toUpperCase()}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleEditTask : handleAddTask}
        initialData={
          editingTask
            ? {
                title: editingTask.title,
                status: editingTask.status,
              }
            : undefined
        }
      />
    </>
  );
}
