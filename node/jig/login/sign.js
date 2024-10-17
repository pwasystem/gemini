const crypto = require('crypto')

class SIGN {
	
	constructor(uid) {
		this.uid = this.check(uid);
	}
	
	check (uid) {
		let data = null;
		let token = null;
		if (uid) {
			data = `Logged`;
			token = this.token(uid);
		}
		return this.send(data,token);
	}
	
	signin (user,pwd) {
		let uid = null;
		let token = null;
		let data = `Login fail!`;
		if (user=='mail@mail.com'&&pwd=='pwd') {
			uid = 1;
			data = `Make Login!`;
			token = this.token(uid);
		}
		return this.send(data,token);
	}
	
	signup(user,pwd) {
		return this.send(`Signup ok!`,this.token('new'));
		
	}
	
	recover(user) {
		return this.send(`Mail send!`,null);
	}
	
	token(uid){
		return crypto.createHash(`md5`).update(uid.toString()).digest(`hex`);
	}
	
	send(data,token){
		return {
			data: data,
			token : token
		}
	}

}
module.exports = SIGN;