import jwt from 'jsonwebtoken';

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acesso não autorizado, token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Erro ao verificar token:', err);
    res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
};

export default verificarToken;
