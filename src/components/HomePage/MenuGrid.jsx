import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { iconMap } from '../icons/iconMap.jsx';
import { menuItems } from '../../datas/lmsData.js';

function MenuGrid() {
  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {menuItems.map((item, index) => {
        const Icon = iconMap[item.icon];
        return (
          <motion.div key={item.path} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
            <NavLink to={item.path} className="group flex h-full flex-col gap-4 rounded-3xl bg-white p-4 shadow-md shadow-orange-100 transition hover:-translate-y-1 hover:shadow-xl">
              <div className={`grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                <Icon className="h-8 w-8" />
              </div>
              <span className="text-lg font-black text-slate-900 group-hover:text-[#F97316]">{item.label}</span>
            </NavLink>
          </motion.div>
        );
      })}
    </section>
  );
}

export default MenuGrid;
