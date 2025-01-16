const express = require('express');
const { Firestore } = require('@google-cloud/firestore');
const db = new Firestore();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Rota para redirecionar o link
app.get('/redir/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await db.collection('links').doc(id).get();
    if (doc.exists) {
      res.redirect(doc.data().original);
    } else {
      res.status(404).send('Link não encontrado');
    }
  } catch (error) {
    res.status(500).send('Erro no servidor');
  }
});

// Rota para criar um link encurtado
app.post('/create', async (req, res) => {
  const { originalLink } = req.body;
  const id = Math.random().toString(36).substring(2, 8); // Gerar um ID aleatório

  try {
    await db.collection('links').doc(id).set({ original: originalLink });
    res.json({ shortLink: `${req.protocol}://${req.get('host')}/redir/${id}` });
  } catch (error) {
    res.status(500).send('Erro ao criar link');
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
