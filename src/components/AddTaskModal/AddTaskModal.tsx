import { useEffect, useState, useCallback, useRef } from "react";
import styles from "./AddTaskModal.module.css";

export type TaskFormData = {
  title: string;
  status: "default" | "active";
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
  initialData?: Partial<TaskFormData>;
};

const EMPTY_FORM: TaskFormData = {
  title: "",
  status: "default",
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
  initialData,
}: Props) {
  const [form, setForm] = useState<TaskFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleRef = useRef<HTMLInputElement | null>(null);

  /* ===============================
     Open / close effects
  =============================== */

  useEffect(() => {
    if (!isOpen) return;

    setForm({ ...EMPTY_FORM, ...initialData });
    requestAnimationFrame(() => {
      titleRef.current?.focus();
    });
  }, [isOpen, initialData]);

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

  /* ===============================
     Form logic
  =============================== */

  const updateField = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setForm((prev) =>
        name in prev ? { ...prev, [name]: value } : prev
      );
    },
    []
  );

  const isDatesValid =
    !form.startDate ||
    !form.dueDate ||
    form.startDate <= form.dueDate;

  const canSubmit =
    form.title.trim().length > 0 &&
    isDatesValid &&
    !isSubmitting;

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
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
            {initialData ? "Edit Task" : "Add Task"}
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

        <form
          className={styles["modal__form"]}
          onSubmit={handleSubmit}
          noValidate
        >
          <label htmlFor="title">Title:</label>
          <input
            ref={titleRef}
            id="title"
            name="title"
            value={form.title}
            onChange={updateField}
            required
          />

          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={updateField}
          >
            <option value="default">Default</option>
            <option value="active">Active</option>
          </select>

          <label htmlFor="assignee">Assign to</label>
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
              <label htmlFor="startDate">Start Date:</label>
              <input
                id="startDate"
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={updateField}
              />
            </div>

            <div>
              <label htmlFor="dueDate">Due Date:</label>
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
              The end date cannot be earlier than the start date.
            </small>
          )}

          <input
            name="account"
            value={form.account}
            onChange={updateField}
            placeholder="Account"
          />

          <input
            name="deal"
            value={form.deal}
            onChange={updateField}
            placeholder="Deal"
          />

          <input
            name="contact"
            value={form.contact}
            onChange={updateField}
            placeholder="Contact"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={updateField}
            placeholder="Phone Number"
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
      </div>
    </div>
  );
}
