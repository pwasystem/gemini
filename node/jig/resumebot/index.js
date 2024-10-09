//Controller
exports.run = async (data,func,jig) => {
	var code = await func(data.input,jig);
	//your function
	return code;
}