const express = require('express');
const { Firestore } = require('@google-cloud/firestore');
const db = new Firestore();
const app = express();
const port = process.env.PORT || 3000;

app.post('/create', async (req, res) => {
    try {
        const { longUrl } = req.body;

        if (!longUrl) {
            return res.status(400).json({ error: "URL inválida" });
        }

        // Verifique se o longUrl é válido
        const isValidUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(longUrl);
        if (!isValidUrl) {
            return res.status(400).json({ error: "URL malformada" });
        }

        // Supondo que você esteja usando o Firestore para armazenar a URL
        const docRef = await firestore.collection('links').add({
            longUrl: longUrl,
            createdAt: new Date(),
        });

        const shortUrl = `https://enc-production-7eec.up.railway.app/redir/${docRef.id}`;

        res.status(201).json({ shortUrl });
    } catch (error) {
        console.error("Erro ao criar link:", error);
        res.status(500).json({ error: "Erro ao criar link", details: error.message });
    }
});


