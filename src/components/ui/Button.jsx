import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick,
  href,
  type = 'button',
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-250 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff88] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#00ff88] to-[#00d4aa] text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] hover:-translate-y-0.5',
    secondary: 'bg-[#1a1a1a] text-white border border-[#333] hover:border-[#00ff88] hover:bg-[#00ff88]/5',
    outline: 'bg-transparent border-2 border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88]/10 hover:shadow-[0_0_20px_rgba(0,255,136,0.2)]',
    ghost: 'bg-transparent text-[#a0a0a0] hover:text-white hover:bg-white/5',
    orange: 'bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] text-white hover:shadow-[0_0_30px_rgba(255,107,53,0.4)] hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      href={href}
      type={href ? undefined : type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
