const fs = require('fs');

const systemInstruction = fileread('jig/posts/instructions.txt');
const roleUser = fileread('jig/posts/input.txt');
const roleModel = fileread('jig/posts/output.txt');

const history = [
			{
		role: "user",
		parts: [
			{text: roleUser},
		],
	},
	{
		role: "model",
		parts: [
			{text: roleModel},
		],
	},
];
//Controller
exports.run = async (data,func) => {
	var code = await func(data.input,systemInstruction,history);
	//your function
	return code;
}

//read files
function fileread(filename){            
   var contents = fs.readFileSync(filename);
   return contents.toString();
}  