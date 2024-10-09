//import
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

//app
const port = 80;
const app = express();
app.use(bodyParser.json()); //post to JSON

//GET
app.get('/', (req, res) => sendFile(res,'html/index.html'));
app.get('/:file', (req, res) => sendFile(res,'html/'+req.params.file));
app.get('/jig/:project', (req, res) => sendFile(res,'jig/'+req.params.project+'/index.html'));
app.get('/jig/:project/:file', (req, res) => sendFile(res,'jig/'+req.params.project+'/'+req.params.file));
app.get('/:project/:file', (req, res) => sendFile(res,'html/'+req.params.project+'/'+req.params.file));
app.get('/:project/img/:archive/:file', (req, res) => sendFile(res,'html/'+req.params.project+'/img/'+req.params.archive+'/'+req.params.file));

//POST
app.post('/ai/:file', async (req, res) =>{	
	const jig = req.params.file;
	const AI = require("./ai.js");
	const JIG = require('./jig/'+jig+'/jig.js');
	const ai = new AI('',jig);
	const model = new JIG(ai,req.body);
	const code = await model.run();
	res.json(code);
	
});

//listen
app.listen(port, () => {
	console.log(`App on port: ${port} \n version 1.0.0`);
});



//login
app.post('/signin', (req, res) => {
	console.log('signin');
	res.send(`{"data":"Make Login!","token":"token_number"}`);
});

//signup
app.post('/signup', (req, res) => {
	console.log('signup');
	res.send(`{"data":"Make Signup!","token":"token_number"}`);
});

//recover
app.post('/recover', (req, res) => {
	console.log('recover');
	res.send(`{"data":"Make recover!"}`);
});



//send server files
function sendFile(res,file) {
	const filePath = path.join(__dirname, file);
	res.sendFile(filePath, err => {
		if (err) res.status(404).send('Arquivo não encontrado (404): ');
	});	
}