import { useNotifications } from '../context/NotificationContext';

export default function ToastContainer() {
  const { toasts } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast-enter note-card px-5 py-4 shadow-xl shadow-black/10"
        >
          <p className="text-sm font-semibold text-ink-900">{toast.title}</p>
          {toast.message?.content && (
            <p className="text-xs text-ink-500 mt-1 line-clamp-2">
              {toast.message.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
