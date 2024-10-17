import { DatabaseSync } from 'node:sqlite';

export class CRUD {
	
	constructor ( db ){
		try {
			this.db = new DatabaseSync(db);
			this.reply(`${db} Start!`);
		} catch {
			this.reply(`${db} Fail!`);
		}
	}
	
	sql ( query ) {
		this.reply(this.db.exec(query)?query:'Query Fail!');
	}
	
	create ( data ) {
		const values = data.fields.map(x=>'?');
		const sql = this.db.prepare(`INSERT INTO ${data.table} (${data.fields.join()}) VALUES (${values.toString()})`);
		for(let i=0;i<data.values.length;i++)sql.run(...data.values[i]);
		this.reply('Data has created');
	}
	
	read ( data ) {
		const where = data.where ? `WHERE ${data.where}`:'';
		const order = data.order ? `ORDER BY ${data.order}`:'';
		const query = `SELECT ${data.fields.join()} FROM ${data.table} ${where} ${order}`;
		const sql = this.db.prepare(query);
		this.reply(sql.all());
	}
	
	update ( data ) {
		const set = data.fields.map(x=>`${x} = ?`);
		const query = `UPDATE ${data.table} SET ${set.join()} WHERE id = ?`;
		const sql = this.db.prepare(query);		
		for(let i=0;i<data.values.length;i++)sql.run(...data.values[i]);
		this.reply(query);
	}
	
	delete ( data ) {
		const query = `DELETE FROM ${data.table} WHERE id = ${data.id}`;
		this.sql(query);
	}
	
	reply ( data ) {
		this.answer = data;
		this.log();
		return this.answer;
	}
	
	log () {
		console.log(this.answer);
	}

}

const crud = new CRUD('db.sqlite');
/*
crud.sql(`CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT,
	password TEXT
) STRICT`);

crud.create({
	table : 'users',
	fields : ['username','password'],
	values : [
		['user1','pass1'],
		['user2','pass2'],
	]
});

crud.update({
	table : 'users',
	fields : ['username','password'],
	values : [
		['username 1','password 1',1],
		['username 2','password 2',2],
	]
});


crud.delete({
	table : 'users',
	id : 1
});

crud.read({
	table : 'users',
	fields : ['id','username','password'],
	where : 'id >= 0',
	order : 'id'
});
*/