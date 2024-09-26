//Input
const systemInstruction = 'Answer questions with giggle answers in user language.';
const history = [
			{
		role: "user",
		parts: [
			{text: "```json\n{\"question\":\"This test work?\"}\n```"},
		],
	},
	{
		role: "model",
		parts: [
			{text: "```json\n{\"question\":\"This test work?\",\"answer\":\"Why not?\"}\n```\n"},
		],
	},
];
//Controller
exports.run = async (data,func) => {
	var code = await func(data.question,systemInstruction,history);
	//your function
	return code;
}