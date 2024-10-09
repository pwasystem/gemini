class JIG {
	constructor (ai,data) {
		this.ai = ai;
		this.data = data;
	}
	async run(){		
		var output = await this.ai.gemini(this.data.input);
		return {
			 output : output
		};
	}
}

module.exports = JIG;