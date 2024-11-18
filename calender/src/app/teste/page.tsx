// src/App.tsx
import React, { useEffect, useState } from 'react';

// Defina o tipo de dado que você espera receber do backend
interface User {
  id: number;
  name: string;
  email: string;
}

const Page: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('')
  const [email, setEmail] = useState('') 
  // Função para buscar dados do backend (GET request)
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/teste'); // substitua pela URL do seu backend
      if (!response.ok) {
        throw new Error('Erro ao buscar dados');
      }
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Função para enviar dados para o backend (POST request)
  const createUser = async () => {
    try {
      const newUser = { name, email};
      const response = await fetch('http://localhost:5000/teste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        throw new Error('Erro ao enviar dados');
      }
      const createdUser: User = await response.json();
      setUsers((prevUsers) => [...prevUsers, createdUser]);
      setName('')
      setEmail('')
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Lista de Usuários</h1>
      <form onSubmit={(e)=>{
        e.preventDefault();
        createUser()
      }}>

        <div>
            <label >Nome:<input type="text" value={name} onChange={(e)=> setName(e.target.value)} required/></label>
            <label >Email:<input type='text' value={email} onChange={(e)=> setEmail(e.target.value)}></input></label>
        
        </div>
        <button  type='submit'>Enviar dados</button>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
