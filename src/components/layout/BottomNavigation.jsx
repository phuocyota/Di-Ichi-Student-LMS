import { NavLink } from 'react-router-dom';
import { bottomNav } from '../../datas/lmsData.js';
import { iconMap } from '../icons/iconMap.jsx';

function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-orange-100 bg-white/95 px-2 py-2 shadow-[0_-10px_30px_rgba(249,115,22,0.12)] backdrop-blur-xl">
      <div className="mx-auto grid max-w-2xl grid-cols-5 gap-1">
        {bottomNav.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex min-w-0 flex-col items-center gap-1 rounded-3xl px-1 py-2 text-xs font-black transition sm:px-2 ${
                  isActive ? 'bg-[#FFF7ED] text-[#F97316]' : 'text-slate-500 hover:bg-orange-50'
                }`
              }
            >
              <Icon className="h-6 w-6" />
              <span className="w-full truncate text-center">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNavigation;
