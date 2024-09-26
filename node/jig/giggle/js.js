//disable and enable form itens
main.disable = make => {
	question.disabled=make;
	button_1.disabled=make;
	button_2.disabled=make;
}
//process json data
main.callback = data => {
	view.innerHTML=data.answer;
}