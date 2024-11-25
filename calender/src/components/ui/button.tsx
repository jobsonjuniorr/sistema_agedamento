type ButtonProps = {
  children: React.ReactNode; // O conteúdo do botão
  onClick?: () => void; // Função opcional a ser chamada no clique
  className?: string; // Classes CSS adicionais (opcional)
};

export function Button({ children, onClick, className }: ButtonProps) {
  return (
    <div>
      <button
        className={`bg-button text-text p-1 md:p-2 2xl:text-2xl  2xl:p-3 2xl:w-40 w-24 md:w-28 rounded duration-200 hover:bg-buttonHover ${className || ''}`}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
}
