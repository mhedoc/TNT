function add_url(){    
    var add_name = document.getElementById('custom_name');
    var add_url = document.getElementById('custom_url');
    var additionals = new Array(new Array(),new Array());
    var add_hint = document.getElementById('add_hint');    
    add_hint.textContent = 'www.example.com or example.com';
    add_hint.style.color = 'green';    
    chrome.storage.sync.get({
        'additionals': ''
    }, function (items) {
        additionals = items.additionals;
        if(add_name.value !== "" && add_url.value !== ""){
            if(additionals[0].length !== 0){
                for(var i = 0; i < additionals[0].length; i++){
                    if(additionals[0][i] === add_name.value && additionals[1][i] === add_url.value){
                        add_hint.style.color = 'red';
                        add_hint.textContent = 'Existing!!';
                        return;
                    }
                }
                additionals[0].push(add_name.value);
                additionals[1].push(add_url.value);
                add_name.value = '';
                add_url.value = '';
            }else{
                additionals[0].push(add_name.value);
                additionals[1].push(add_url.value);
                add_name.value = '';
                add_url.value = '';
            }
        }else if(add_name.value === "" && add_url.value !== ""){
            if(additionals[0].length !== 0){
                for(var i = 0; i < additionals[0].length; i++){
                    if((additionals[0][i] === add_url.value.split('.').slice(1, 2)[0] && additionals[1][i] === add_url.value)
                            || (additionals[0][i] === add_url.value.split('.').slice(0, 1)[0] && additionals[1][i] === add_url.value)){
                        add_hint.style.color = 'red';
                        add_hint.textContent = 'Existing!!';
                        return;
                    }
                }
                if(add_url.value.split('www.').length === 2){
                    additionals[0].push(add_url.value.split('.').slice(1, 2)[0]);
                    additionals[1].push(add_url.value);
                    add_name.value = '';
                    add_url.value = '';
                }else{
                    additionals[0].push(add_url.value.split('.').slice(0, 1)[0]);
                    additionals[1].push(add_url.value);
                    add_name.value = '';
                    add_url.value = '';
                }
            }else{
                if(add_url.value.split('www.').length === 2){
                    additionals[0].push(add_url.value.split('.').slice(1, 2)[0]);
                    additionals[1].push(add_url.value);
                    add_name.value = '';
                    add_url.value = '';
                }else{
                    additionals[0].push(add_url.value.split('.').slice(0, 1)[0]);
                    additionals[1].push(add_url.value);
                    add_name.value = '';
                    add_url.value = '';
                }
            }                  
        }
        
        chrome.storage.sync.set({
            'additionals': additionals
        });
        restore_options(); 
    });
    
}

function save_options() {
    
	var domains = document.getElementById("googlecountry");        
	var domain = domains.options[domains.selectedIndex].value;
  	var tnt_choices = new Array();
  	var choices = document.getElementsByName("choice");
  	var hint = document.getElementById('hint');
	var address = "";
	var customaddress = document.getElementById("customaddress");
	var buffer = document.getElementsByName("tnt");
	var k = 0;
	var length = buffer.length;
	var expression = /^((www\.)?\w+\..+)?$/;
        hint.textContent = 'www.example.com or example.com'; 
	if(!expression.test(customaddress.value)){        	
		hint.textContent = 'Not valid!';
                hint.style.color = 'red';
	}else{
            hint.style.color = 'green';
        }
	
	for(var i = 0;i<choices.length;i++){
		if(choices[i].checked){
			address = choices[i].value;
		}
	}
		
	if(length > 0){
		for(var i = 0; i < length; i++){
			if(buffer[i].checked){
				tnt_choices[k++] = buffer[i].id;
			}
		}
	}
	
  	chrome.storage.sync.set({
		'tnt_choices': tnt_choices,
		'address': address,
		'domain': domain,
		'customaddress': customaddress.value
        });
}

function restore_options() {
    var additionals = new Array(new Array(),new Array());
    chrome.storage.sync.get({
        'tnt_choices': "",
        'address': 'google',
        'domain': 'com/ncr',
        'customaddress': '',
        'additionals': ''
    }, function (items) {
        var choices = document.getElementById(items.address);
        var domains = document.getElementById("googlecountry");
        var customaddress = document.getElementById("customaddress");
        var length = items.tnt_choices.length;
        var add_container = document.getElementById('additional');
        var table_box = document.getElementById('add_table');
        var th1 = document.createElement('th');
        var th2 = document.createElement('th');
        var tr = document.createElement('tr');
        var text1 = document.createTextNode('Name');
        var text2 = document.createTextNode('Url');
        additionals = items.additionals;
        
        while(table_box.hasChildNodes()){
            table_box.removeChild(table_box.firstChild);
        }        
        choices.checked = true;        
        domains.value = items.domain;        
        customaddress.value = items.customaddress;        
        if (length > 0) {
            for (var i = 0; i < length; i++) {
                var tnt_choice = document.getElementById(items.tnt_choices[i]);
                tnt_choice.checked = true;
            }
        }        
        th1.appendChild(text1);
        th2.appendChild(text2);
        tr.appendChild(th1);
        tr.appendChild(th2);
        table_box.appendChild(tr);
        length = additionals[0].length;
        if (length > 0) {
            for (var i = 0; i < length; i++) {
                var tr = document.createElement('tr');
                var text1 = document.createTextNode(additionals[0][i]);
                var text2 = document.createTextNode(additionals[1][i]);                   
                var delete_button = document.createElement('input');
                    delete_button.type = 'button';
                    delete_button.value = 'delete';
                    delete_button.id = additionals[0][i].trim() + ',' + additionals[1][i].trim();
                    delete_button.addEventListener('click', function(){deleteRow(this.id);},false);
                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                var td3 = document.createElement('td');
                td1.appendChild(text1);
                td2.appendChild(text2);
                td3.appendChild(delete_button);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                table_box.appendChild(tr);               
            }           
        }
        add_container.appendChild(table_box);
    });
}

function deleteRow(id){
    var additionals = new Array(new Array(),new Array());
    chrome.storage.sync.get({
        'additionals': additionals
    }, function(items){
        additionals = items.additionals;

        var apart = id.split(',');
        var name = apart[0];
        var url = apart[1];

        for(var i = 0; i < additionals[0].length; i++){
            if(additionals[0][i] === name && additionals[1][i] === url){
                
                additionals[0].splice(i,1);
                additionals[1].splice(i,1);

            }
        }
        chrome.storage.sync.set({
            'additionals': additionals
        });
        restore_options();
    });
}

function init_var(details){
    if(details.reason == "install"){
        var additionals = new Array(new Array(),new Array());
        chrome.storage.sync.set({
            'tnt_choices': "",
            'address': "google",
            'domain': "com/ncr",
            'customaddress': "",
            'additionals': additionals
        });
    }
}

function initialize(){
    var tnt_choices = document.getElementsByName("tnt");    
    chrome.runtime.onInstalled.addListener(init_var);
    restore_options();    
    document.getElementById('add_button').addEventListener('click',add_url,false);
    document.getElementById('googlecountry').addEventListener('change',save_options);
    document.getElementById('google').addEventListener('click',save_options,false);
    document.getElementById('custom').addEventListener('click',save_options,false);
    document.getElementById('tnt').addEventListener('click',save_options,false);
    document.getElementById('customaddress').addEventListener('keyup',save_options);    
    for(var i = 0; i < tnt_choices.length; i++){
        tnt_choices[i].addEventListener('click',save_options,false);
    }
}
document.addEventListener('DOMContentLoaded', initialize());