const fs = require('fs');
const {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} = require("@google/generative-ai");

class AI {

	constructor (key,jig) {
		this.key = key;
		this.jig = jig;
	}

	async gemini(instructions) {
		const key = this.key;
		const jig = this.jig;
		const history = [];
		//load system instructions and history
		await fs.readdir(`jig/${jig}/input`, (err, files) => {
			if (err) console.log(err);
			files.forEach(file => {
				history.push({
					role: "user",
					parts: [
						{text: fs.readFileSync(`jig/${jig}/input/${file}`).toString()},
					],
				},
				{
					role: "model",
					parts: [
						{text: fs.readFileSync(`jig/${jig}/output/${file}`).toString()},
					],
				});
			});
		});		
		const genAI = new GoogleGenerativeAI(key);
		var code = await genAI.getGenerativeModel({
			model : 'gemini-1.5-flash',
			systemInstruction: fs.readFileSync(`jig/${jig}/instructions.txt`).toString(),
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
				responseMimeType: "text/plain"
			},
			history : history //here
		}).sendMessage(instructions);
		const response = code.response.text();
		const log = {
			jig : jig.toUpperCase(),
			start : new Date().toString(),
			instructions : instructions,
			response : response
		};
		console.log(log);
		return response;
	}

}

module.exports = AI;