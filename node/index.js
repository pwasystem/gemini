//import
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} = require("@google/generative-ai");

//app
const port = 80;
const app = express();

//html
app.get('/', (req, res) => sendFile(res,'html/index.html'));
app.get('/login', (req, res) => sendFile(res,'html/login.html'));
app.get('/:file', (req, res) => sendFile(res,'html/'+req.params.file));
app.get('/jig/:project', (req, res) => sendFile(res,'jig/'+req.params.project+'/index.html'));
app.get('/jig/:project/:file', (req, res) => sendFile(res,'jig/'+req.params.project+'/'+req.params.file));
app.get('/:project/:file', (req, res) => sendFile(res,'html/'+req.params.project+'/'+req.params.file));
app.get('/:project/img/:archive/:file', (req, res) => sendFile(res,'html/'+req.params.project+'/img/'+req.params.archive+'/'+req.params.file));
app.get('/jig/:project/in/:file', (req, res) => sendFile(res,'jig/'+req.params.project+'/template/input/'+req.params.file));
app.get('/jig/:project/out/:file', (req, res) => sendFile(res,'jig/'+req.params.project+'/template/output/'+req.params.file));

//send server files
function sendFile(res,file) {
	const filePath = path.join(__dirname, file);
	res.sendFile(filePath, err => {
		if (err) res.status(404).send('Arquivo não encontrado (404): ');
	});	
}

app.use(bodyParser.json()); //post to JSON
app.post('/ai/:file', async (req, res) =>{
	//require data
	const jig = req.params.file;
	console.log('AI Server Start: ' + jig);	
	//request
	const data = req.body;
	console.log('Server request!');
	console.log(data);
	//import model
	console.log('Start model creation');
	const aiModel = require('./jig/'+jig+'/index');
	//response
	var response;
	response = await aiModel.run(data,gemini);
	res.json(response);
	//log
	console.log('Server response!');
	//normalize data
	console.log(JSON.parse(response.replace(/ \\ /g," \\ ")));
});

//listen
app.listen(port, () => {
	console.log(`App on port: ${port} \n version 1.0.0`);
});

//AI Server
const genAI = new GoogleGenerativeAI('');
async function gemini(instructions,systemInstruction,history) {
	var code = await  genAI.getGenerativeModel({
		model : 'gemini-1.5-flash',
		systemInstruction: systemInstruction,
		safetySettings: [{
				category: HarmCategory.HARM_CATEGORY_HARASSMENT,
				threshold: HarmBlockThreshold.BLOCK_NONE,
			},{
				category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
				threshold: HarmBlockThreshold.BLOCK_NONE,
			},{
				category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
				threshold: HarmBlockThreshold.BLOCK_NONE,
			},{
				category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
				threshold: HarmBlockThreshold.BLOCK_NONE,
		}]
	}).startChat({		
		generationConfig : {
			temperature: 1,
			topP: 0.95,
			topK: 64,
			maxOutputTokens: 8192,
			responseMimeType: "application/json"
		},
		history : history
	}).sendMessage(instructions);
	return code.response.text();
}

//login
app.post('/login', (req, res) => {
	res.send(`{"token":"token_number"}`);
	//sendFile(res,'login.js')
});