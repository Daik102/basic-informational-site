import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Helper to get the current directory name in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer((req, res) => {
  if (req.url === '/.well-known/appspecific/com.chrome.devtools.json') {
    res.writeHead(204); // 204 means "No Content" - successfully processed, nothing to return
    res.end();
    return;
  }

  let fileName;
  let statusCode = 200;

  // 1. Simple Routing Logic based on URL path
  if (req.url === '/') {
    fileName = 'index.html';
  } else if (req.url === '/about') {
    fileName = 'about.html';
  } else if (req.url === '/contact-me') {
    fileName = 'contact-me.html';
  } else if (req.url === '/styles.css') {
    fileName = 'styles.css';
  } else {
    fileName = '404.html';
    statusCode = 404; // Set proper HTTP status for missing pages
  }

  // 2. Build the absolute file path to the HTML file in the 'public' folder
  
  const filePath = path.join(__dirname, 'public', fileName);

  const extname = path.extname(filePath);
  
  // 3. Set the correct Content-Type header dynamically
  let contentType = 'text/html';

  if (extname === '.css') {
    contentType = 'text/css';
  }

  res.writeHead(statusCode, { 'Content-Type': contentType });

  // 4. Stream the HTML file directly to the client's browser
  const fileStream = fs.createReadStream(filePath);

  // Handle errors gracefully (e.g., if an HTML file is missing)
  fileStream.on('error', (err) => {
    console.error('File stream error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
  });

  // Pipe the file read stream straight into the HTTP response writable stream
  fileStream.pipe(res);
});

// 5. Start the server on port 8080
server.listen(8080, () => {
  console.log('Server is running at http://localhost:8080');
});
