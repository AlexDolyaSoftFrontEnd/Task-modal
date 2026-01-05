import { useEffect, useState, useCallback, useRef } from "react";
import styles from "./AddTaskModal.module.css";

export type TaskFormData = {
  title: string;
  assignee: string;
  startDate: string;
  dueDate: string;
  account: string;
  deal: string;
  contact: string;
  phone: string;
  description: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
};

// Пустое состояние формы
const EMPTY_FORM: TaskFormData = {
  title: "",
  assignee: "user",
  startDate: "",
  dueDate: "",
  account: "",
  deal: "",
  contact: "",
  phone: "",
  description: "",
};

export default function AddTaskModal({
  isOpen,
  onClose,
  onSubmit,
}: Props) {
  // Централизованное состояние формы
  const [form, setForm] = useState<TaskFormData>(EMPTY_FORM);

  // Флаг защиты от повторной отправки
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ref для автофокуса на первом поле
  const titleRef = useRef<HTMLInputElement | null>(null);

  // Сброс формы и автофокус при открытии модалки
  useEffect(() => {
    if (!isOpen) return;

    setForm(EMPTY_FORM);
    requestAnimationFrame(() => {
      titleRef.current?.focus();
    });
  }, [isOpen]);

  // Закрытие по Esc и блокировка скролла body
  useEffect(() => {
    if (!isOpen) return;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Универсальный обработчик изменения полей формы
  const updateField = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;

      // Защита от несуществующих полей
      setForm((prev) =>
        name in prev ? { ...prev, [name]: value } : prev
      );
    },
    []
  );

  // Валидация дат: дата окончания не раньше даты начала
  const isDatesValid =
    !form.startDate ||
    !form.dueDate ||
    form.startDate <= form.dueDate;

  // Вычисляемое состояние доступности кнопки сохранения
  const canSubmit =
    form.title.trim().length > 0 &&
    isDatesValid &&
    !isSubmitting;

  // Безопасная отправка формы с защитой от двойного клика
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!canSubmit) return;

      try {
        setIsSubmitting(true);
        onSubmit(form);
        onClose();
      } finally {
        setIsSubmitting(false);
      }
    },
    [canSubmit, form, onSubmit, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className={styles.modal} role="presentation">
      {/* Закрытие модалки только по клику на overlay */}
      <div
        className={styles["modal__backdrop"]}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        aria-hidden="true"
      />

      <div
        className={styles["modal__panel"]}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-task-title"
      >
        <header>
          <h2
            id="add-task-title"
            className={styles["modal__title"]}
          >
            Add Task
          </h2>

          <button
            type="button"
            className={styles["modal__close"]}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </header>

        <main>
          <form
            className={styles["modal__form"]}
            onSubmit={handleSubmit}
            noValidate
          >
            <label htmlFor="title">Task title *</label>
            <input
              ref={titleRef}
              id="title"
              name="title"
              value={form.title}
              onChange={updateField}
              required
            />

            <label htmlFor="assignee">Assign to *</label>
            <select
              id="assignee"
              name="assignee"
              value={form.assignee}
              onChange={updateField}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>

            <div className={styles["modal__row"]}>
              <div>
                <label htmlFor="startDate">Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={updateField}
                />
              </div>

              <div>
                <label htmlFor="dueDate">Due Date</label>
                <input
                  id="dueDate"
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={updateField}
                />
              </div>
            </div>

            {!isDatesValid && (
              <small style={{ color: "#dc2626" }}>
                Дата окончания не может быть раньше даты начала
              </small>
            )}

            <input
              name="account"
              value={form.account}
              onChange={updateField}
              placeholder="Account (optional)"
            />

            <input
              name="deal"
              value={form.deal}
              onChange={updateField}
              placeholder="Deal (optional)"
            />

            <input
              name="contact"
              value={form.contact}
              onChange={updateField}
              placeholder="Contact (optional)"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={updateField}
              placeholder="Phone Number (optional)"
            />

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={updateField}
            />

            <footer>
              <button
                type="submit"
                className={styles["modal__submit"]}
                disabled={!canSubmit}
              >
                {isSubmitting ? "Сохранение…" : "Save"}
              </button>
            </footer>
          </form>
        </main>
      </div>
    </div>
  );
}
