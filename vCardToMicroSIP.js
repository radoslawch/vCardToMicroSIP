var xmlContent = "";
function readvCard(){	
	let xml = document.getElementById("xml").files[0];
	if (xml) {
		let reader = new FileReader();
		reader.readAsText(xml, "UTF-8");
		reader.onload = function (evt) {
			xmlContent = evt.target.result;
			xmlContent = xmlContent.slice(0,-15); // remove \r\n</contacts>
		}
		reader.onerror = function (evt) {			
			document.getElementById("output").innerText += "error reading xml\r\n";
		}
	}
	else{
		xmlContent = "<?xml version=\"1.0\"?>\r\n<contacts>";		
	}

	let vcards = document.getElementById("vcard").files;
	for(let i = 0; i < vcards.length; i++){
		let vcard = vcards[i];
		if (vcard) {
			let reader = new FileReader();
			reader.readAsText(vcard, "UTF-8");
			reader.onload = function (evt) {
				parsevCard(evt.target.result);
				if(i == vcards.length - 1){
					xmlContent += "\r\n</contacts>";
					download('contacts.xml', xmlContent);
					document.getElementById("output").innerText += "ok\r\n";
				}			
			}
			reader.onerror = function (evt) {
				document.getElementById("output").innerText += "error reading xml\r\n";
			}
		}
	}
}

function parsevCard(vcard){
	let fn = vcard.match(/(FN:).*/g)[0].slice(3);
	console.log(fn);
	let numbers = vcard.match(/(TEL;.*:).*/g);
	for(let number of numbers){
		number = number.slice(vcard.match(/(TEL;.*:).*/g)[0].indexOf(":")+1);
		console.log(number);
		appendXml(fn, number);
	}	
}

function appendXml(fn, number){
	if(document.getElementById("presence").checked){
		xmlContent += "\r\n<contact number=\""+number+"\" name=\""+fn+"\" presence=\"1\"  directory=\"0\">\r\n</contact>";
	}else{
		xmlContent += "\r\n<contact number=\""+number+"\" name=\""+fn+"\" presence=\"0\"  directory=\"0\">\r\n</contact>";
	}	
}

//https://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}
