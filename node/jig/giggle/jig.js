class JIG {
	constructor (ai,data) {
		this.ai = ai;
		this.data = data;
	}
	async run(){		
		var answer = await this.ai.gemini(this.data.question);
		return {
			question : this.data.question,
			answer : answer
		};
	}
}

module.exports = JIG;