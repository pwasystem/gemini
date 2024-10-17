//import
import express from 'express';
import path from 'path'
import bodyParser from 'body-parser';
import fs from 'fs';

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
	const { default: Ai } = await import('./ai.js');
	const ai = new Ai('AIzaSyCT1F5nI3Kdg78fPL0ZJGv6AbSTAteWTZY');
	const { default: Jig } = await import(`./jig/${req.params.file}/jig.js`);
	const jig = new Jig();
	const code = await jig.run(ai,req.body);
	res.json(code);
});

//listen
app.listen(port, () => {
	console.log(`App on port: ${port} \n version 1.0.0`);
});

//login
app.post('/signin', async (req, res) => {
	const SIGN = require(`./jig/login/sign.js`);
	const sign = new SIGN(`uid`);
	const data = await sign.signin(req.body.username_signin,req.body.password_signin);
	res.send(data);
});

//signup
app.post('/signup', async (req, res) => {
	const SIGN = require(`./jig/login/sign.js`);
	const sign = new SIGN(null);
	const data = await sign.signup(req.body.username_signup,req.body.password_signup);
	res.send(data);
});

//recover
app.post('/recover', (req, res) => {
	console.log('recover');
	res.send(`{"data":"Make recover!"}`);
});


//send server files
function sendFile(res,file) {
	const filePath = path.join(path.resolve(), file);
	res.sendFile(filePath, err => {
		if (err) res.status(404).send('Arquivo não encontrado (404): ');
	});	
}