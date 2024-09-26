//disable and enable form itens
main.disable = make => {
	if (make) view.innerHTML=`<p class='w3-center'><img src='jig/giggle/load.gif'></p>`;
	question.disabled=make;
	button_1.disabled=make;
	button_2.disabled=make;
}
//process json data
main.callback = data => {
	question.placeholder = question.value;
	question.value = '';
	view.innerHTML=data.answer;
}