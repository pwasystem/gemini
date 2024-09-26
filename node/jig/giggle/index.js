const fs = require('fs');

const systemInstruction = fileread('jig/giggle/instructions.txt');
const roleUser = fileread('jig/giggle/input.txt');
const roleModel = fileread('jig/giggle/output.txt');

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
	var code = await func(data.question,systemInstruction,history);
	//your function
	return code;
}

//read files
function fileread(filename){            
   var contents = fs.readFileSync(filename);
   return contents.toString();
}  