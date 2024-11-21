interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  loading?: boolean;
}

export function Button({ 
  variant = 'primary', 
  children, 
  loading = false,
  ...props 
}: ButtonProps) {
  const baseClasses = `
    px-4 py-2 rounded-lg font-medium
    transition-all duration-200 ease-in-out
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center
  `;
  
  const variants = {
    primary: `
      bg-indigo-600 text-white
      hover:bg-indigo-700 active:bg-indigo-800
      border border-transparent
    `,
    secondary: `
      bg-white/5 text-white
      hover:bg-white/10 active:bg-white/20
      border border-white/10
    `,
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : null}
      {children}
    </button>
  );
}