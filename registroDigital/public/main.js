function searchPdf() {
  const searchInput = document.getElementById('searchInput');
  const pdfViewer = document.getElementById('pdfViewer');

  const filename = searchInput.value.trim(); // Obtiene el nombre de búsqueda

  // Usa una ruta relativa para buscar archivos por nombre
  fetch(`/search/${filename}`)
    .then(response => response.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        // Si se encontraron resultados, crea enlaces para cada archivo PDF
        const links = data.results.map(result => {
          // Genera enlaces con el nombre del archivo como texto y abre en una nueva ventana
          return `<a href="/pdf/${result}" target="_blank">${result}</a>`;
        });

        // Agrega los enlaces al visor de PDF
        pdfViewer.innerHTML = links.join('<br>');
      } else {
        // Si no se encontraron resultados, muestra un mensaje
        pdfViewer.innerHTML = 'No se encontraron archivos.';
      }
    })
    .catch(error => {
      console.error('Error de búsqueda:', error);
      pdfViewer.innerHTML = 'Error al buscar archivos.';
    });
}
