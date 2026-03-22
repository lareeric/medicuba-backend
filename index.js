const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes      = require('./routes/auth');
const coursRoutes     = require('./routes/cours');
const versetRoutes    = require('./routes/versets');
const glossaireRoutes = require('./routes/glossaire');
const quizRoutes      = require('./routes/quiz');
const notesRoutes     = require('./routes/notes');
const favorisRoutes   = require('./routes/favoris');
const planningRoutes  = require('./routes/planning');

app.use('/api/auth',      authRoutes);
app.use('/api/cours',     coursRoutes);
app.use('/api/versets',   versetRoutes);
app.use('/api/glossaire', glossaireRoutes);
app.use('/api/quiz',      quizRoutes);
app.use('/api/notes',     notesRoutes);
app.use('/api/favoris',   favorisRoutes);
app.use('/api/planning',  planningRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'MediCuba API en ligne !' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});