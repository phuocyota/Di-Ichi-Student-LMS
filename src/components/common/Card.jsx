import { motion } from 'framer-motion';

function Card({ children, className = '' }) {
  return (
    <motion.section
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`rounded-3xl bg-white p-5 shadow-lg shadow-orange-100 ${className}`}
    >
      {children}
    </motion.section>
  );
}

export default Card;
