import { NavLink } from 'react-router-dom';
import { Bell, CheckCircle2 } from 'lucide-react';
import { notifications } from '../../datas/notificationData.js';

function NotificationDropdown({ open, onClose }) {
  if (!open) {
    return null;
  }

  const unreadCount = notifications.filter((notification) => notification.unread).length;

  return (
    <div className="absolute right-0 top-full z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] rounded-3xl bg-white p-4 shadow-2xl shadow-orange-100 ring-1 ring-orange-100">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-[#F97316]">Thông báo</p>
          <h2 className="text-xl font-black text-slate-900">{unreadCount} thông báo mới</h2>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-3xl bg-orange-50 text-[#F97316]">
          <Bell className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-1">
        {notifications.map((notification) => (
          <NavLink
            key={notification.id}
            to={notification.path}
            onClick={onClose}
            className="flex gap-3 rounded-3xl bg-slate-50 p-4 transition hover:bg-orange-50"
          >
            <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${notification.unread ? 'bg-[#EF4444]' : 'bg-slate-300'}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-xs font-black uppercase text-[#F97316]">{notification.type}</p>
                <p className="shrink-0 text-xs font-bold text-slate-400">{notification.time}</p>
              </div>
              <h3 className="mt-1 font-black text-slate-900">{notification.title}</h3>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">{notification.message}</p>
            </div>
          </NavLink>
        ))}
      </div>

      <button type="button" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-green-50 py-3 font-black text-[#22C55E]">
        <CheckCircle2 className="h-5 w-5" />
        Đánh dấu đã đọc
      </button>
    </div>
  );
}

export default NotificationDropdown;
