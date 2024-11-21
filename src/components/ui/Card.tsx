interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`
      w-full max-w-md p-8
      bg-white/10 backdrop-blur-xl
      rounded-2xl shadow-2xl
      border border-white/20
      ${className}
    `}>
      {children}
    </div>
  );
}