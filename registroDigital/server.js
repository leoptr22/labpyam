const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('pdfFile'), (req, res) => {
  res.send('Archivo PDF cargado correctamente.');
});

app.get('/search/:filename', (req, res) => {
  const { filename } = req.params;
  const searchResults = [];

  fs.readdir('uploads/', (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error en el servidor.');
      return;
    }

    files.forEach(file => {
      if (file.toLowerCase().includes(filename.toLowerCase())) {
        searchResults.push(file);
      }
    });

    if (searchResults.length > 0) {
      res.json({ results: searchResults });
    } else {
      res.status(404).send('No se encontraron archivos.');
    }
  });
});

app.get('/pdf/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/pdf');
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.status(404).send('Archivo no encontrado.');
  }
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
