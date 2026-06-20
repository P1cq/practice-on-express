import { useNotifications } from '../context/NotificationContext';

export default function ToastContainer() {
  const { toasts } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 left-4 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast-enter bg-sage-950 border border-white/10 rounded-2xl px-5 py-4 shadow-2xl"
        >
          <p className="text-sm font-semibold text-sage-100">{toast.title}</p>
          {toast.message?.content && (
            <p className="text-xs text-sage-400 mt-1 line-clamp-2">
              {toast.message.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
