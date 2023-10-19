'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '../')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/get_images.php', (req, res) => {
	const files = fs.readdirSync(path.join(__dirname, 'images')).filter(item => item !== '.gitignore');
	res.json(files);
});

app.listen(3000, () => console.log('Dev server listening on port 3000'));