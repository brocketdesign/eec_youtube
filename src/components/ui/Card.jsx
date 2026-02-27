import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  glow = false,
  onClick,
  ...props 
}) => {
  return (
    <motion.div
      className={`
        bg-[#1a1a1a] rounded-xl border border-white/5 p-6
        ${hover ? 'hover:border-[#00ff88]/20 hover:-translate-y-1' : ''}
        ${glow ? 'hover:shadow-[0_0_30px_rgba(0,255,136,0.15)]' : ''}
        transition-all duration-300
        ${className}
      `}
      onClick={onClick}
      whileHover={hover ? { y: -4 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const FlipCard = ({ 
  front, 
  back, 
  className = '',
  frontClassName = '',
  backClassName = '',
}) => {
  return (
    <div className={`flip-card group cursor-pointer ${className}`}>
      <div className="flip-card-inner">
        <div className={`flip-card-front bg-[#1a1a1a] rounded-xl border border-white/5 p-6 flex flex-col items-center justify-center text-center ${frontClassName}`}>
          {front}
        </div>
        <div className={`flip-card-back bg-gradient-to-br from-[#1a1a1a] to-[#222] rounded-xl border border-[#00ff88]/30 p-6 flex flex-col items-center justify-center text-center ${backClassName}`}>
          {back}
        </div>
      </div>
    </div>
  );
};

export default Card;
