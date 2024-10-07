//disable and enable form itens
main.disable = make => {
	if (make) view.innerHTML=`<p class='w3-center'><img src='jig/posts/load.gif'></p>`;
	input.disabled=make;
	button_1.disabled=make;
}
//process json data
main.callback = data => {
	input.placeholder = input.value;
	input.value = '';
	view.innerHTML=data.output;
}