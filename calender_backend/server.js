import express, { json } from 'express';
import cors from 'cors';
import { format } from 'date-fns';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectionMysql from './db/db.js';

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

app.use(cors());
app.use(json());

// --- Rotas de Teste ---
let users = [];

app.get('/teste', (req, res) => {
  res.json(users);
});

app.post('/teste', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.json(newUser);
});

// --- Rotas de Eventos ---
app.get('/events', async (req, res) => {
  try {
    const [rows] = await connectionMysql.query('SELECT * FROM eventos');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Erro ao buscar eventos:', err);
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
});

app.post('/events', async (req, res) => {
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
// Rota para atualizar um evento
app.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const { title, start, end } = req.body;

  try {
    const startFormatted = format(new Date(start), 'yyyy-MM-dd HH:mm:ss');
    const endFormatted = format(new Date(end), 'yyyy-MM-dd HH:mm:ss');

    // Atualizar evento no banco
    await connectionMysql.query(
      'UPDATE eventos SET title = ?, start = ?, end = ? WHERE id = ?',
      [title, startFormatted, endFormatted, id]
    );

    // Retornar evento atualizado
    const updatedEvent = { id, title, start, end };
    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error("Erro ao atualizar evento:", err);
    res.status(500).json({ error: "Erro ao atualizar evento" });
  }
});
app.delete('/events/:id', async (req, res) => {
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

  try {
    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Inserir no banco de dados
    const [result] = await connectionMysql.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ id: result.insertId, name, email });
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// Login do usuário
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar o usuário no banco
    const [rows] = await connectionMysql.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar a senha
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Senha inválida' });
    }

    // Gerar token JWT
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
