export default class Jig {	
	//run jig
	async run(ai,data){		
		var output = await ai.gemini(data.input,`posts`);
		return {
			 output : output
		};
	}
}