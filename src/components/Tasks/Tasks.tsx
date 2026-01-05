import { useState } from "react";
import styles from "./Tasks.module.css";
import AddTaskModal from "../AddTaskModal/AddTaskModal";
import type { TaskFormData } from "../AddTaskModal/AddTaskModal";

type Task = {
  id: string;
  title: string;
};

export default function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "211212" },
    { id: "2", title: "22-02-test" },
    { id: "3", title: "123" },
  ]);

  const handleAddTask = (data: TaskFormData) => {
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: data.title,
      },
    ]);
  };

  return (
    <>
      <section className={styles.tasks}>
        <header className={styles["tasks__header"]}>
          <h3 className={styles["tasks__title"]}>
            TASKS <span>({tasks.length})</span>
          </h3>

          <button
            className={styles["tasks__add-btn"]}
            onClick={() => setIsModalOpen(true)}
            aria-label="Add task"
          >
            <i className="fa-solid fa-plus" />
          </button>
        </header>

        <ul className={styles["tasks__list"]}>
          {tasks.map((task) => (
            <li
              key={task.id}
              className={styles["tasks__item"]}
            >
              <input type="checkbox" />
              <span className={styles["tasks__name"]}>
                {task.title}
              </span>
              <span className={styles["tasks__badge"]}>
                DEFAULT
              </span>
            </li>
          ))}
        </ul>
      </section>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </>
  );
}
