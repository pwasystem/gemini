//disable and enable form itens
main.disable = make => {
	submit_signin.disabled=make;
	submit_signup.disabled=make;
	submit_recover.disabled=make;
}
//process json data
main.callback = data => {
	console.log(data);
}