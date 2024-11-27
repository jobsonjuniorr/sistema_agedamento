import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { format } from 'date-fns';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectionMysql from './db/db.js';
import verificarToken from './middlewares/verificarToken.js'; // Middleware para autenticação

dotenv.config(); // Carregar variáveis de ambiente

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

app.use(cors());
app.use(json());

// --- Rotas de Teste ---

// --- Rotas de Eventos ---
// Listar eventos
app.get('/events', verificarToken, async (req, res) => {
  try {
    const [rows] = await connectionMysql.query('SELECT * FROM eventos');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Erro ao buscar eventos:', err);
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
});

// Criar evento
app.post('/events', verificarToken, async (req, res) => {
  const { title, start, end } = req.body;
  const startFormatted = format(new Date(start), 'yyyy-MM-dd HH:mm:ss');
  const endFormatted = format(new Date(end), 'yyyy-MM-dd HH:mm:ss');

  try {
    const [result] = await connectionMysql.query(
      'INSERT INTO eventos (title, start, end) VALUES (?, ?, ?)',
      [title, startFormatted, endFormatted]
    );
    const newEvent = { id: result.insertId, title, start: startFormatted, end: endFormatted };
    res.status(201).json(newEvent);
  } catch (err) {
    console.error('Erro ao criar evento:', err);
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
});

// Atualizar evento
app.put('/events/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const { title, start, end } = req.body;

  try {
    const startFormatted = format(new Date(start), 'yyyy-MM-dd HH:mm:ss');
    const endFormatted = format(new Date(end), 'yyyy-MM-dd HH:mm:ss');

    await connectionMysql.query(
      'UPDATE eventos SET title = ?, start = ?, end = ? WHERE id = ?',
      [title, startFormatted, endFormatted, id]
    );

    res.status(200).json({ id, title, start, end });
  } catch (err) {
    console.error('Erro ao atualizar evento:', err);
    res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
});

// Excluir evento
app.delete('/events/:id', verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await connectionMysql.query('DELETE FROM eventos WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Erro ao excluir evento:', err);
    res.status(500).json({ error: 'Erro ao excluir evento' });
  }
});

// --- Rotas de Usuários (Login e Cadastro) ---
// Cadastro de usuário
app.post('/cadastro', async (req, res) => {
  const { name, email, password } = req.body;
  if(name =='' || email == '' || password ==''){
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
 
  try { 
   const [rows] = await connectionMysql.query('SELECT * FROM users WHERE email = ?',[email])
    if(rows.length > 0){
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }  

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await connectionMysql.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    return res.status(201).json({ id: result.insertId, name, email });
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// Login do usuário
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await connectionMysql.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Senha inválida' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ token });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro no login' });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
