const express = require('express');
  const { exec } = require('child_process');
  const fs = require('fs');
  const path = require('path');
  const mysql = require('mysql');
  
  const app = express();
  const db = mysql.createConnection({ host: 'localhost', user: 'test', database: 'test' });
  
  // SQL injection
  app.get('/user', (req, res) => {
    const query = "SELECT * FROM users WHERE id = '" + req.query.id + "'";
    db.query(query, (err, rows) => res.json(rows));
  });
  
  // Command injection
  app.get('/ping', (req, res) => {
    exec('ping -c 1 ' + req.query.host, (err, stdout) => res.send(stdout));
  });
  
  // Reflected XSS
  app.get('/hello', (req, res) => {
    res.send('<h1>Hello ' + req.query.name + '</h1>');
  });
  
  // Path traversal
  app.get('/file', (req, res) => {
    const filePath = path.join(__dirname, 'files', req.query.name);
    res.send(fs.readFileSync(filePath, 'utf8'));
  });
  
  // Open redirect
  app.get('/redirect', (req, res) => {
    res.redirect(req.query.url);
  });
  
  app.listen(3000);
