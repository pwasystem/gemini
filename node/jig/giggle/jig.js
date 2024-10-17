export default class Jig {		
	//run jig
	async run(ai,data){		
		var answer = await ai.gemini(data.question,`giggle`);
		return {
			question : data.question,
			answer : answer
		};
	}
}