import { useState } from "react";

function ErrorNotification({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="z-40 fixed top-4  bg-red-500 text-white px-4 py-2 rounded shadow-lg">
      <p>{message}</p>
      <button onClick={onClose} className="mt-2 underline text-white">Fechar</button>
    </div>
  );
}

export default ErrorNotification;
