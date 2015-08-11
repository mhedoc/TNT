chrome.storage.sync.get({
    'address': 'google',
    'tnt_choices': "",
    'domain': 'com/ncr',
    'customaddress': '',
    'additionals': ''
}, function (items) { 
    var merged = new Array(new Array(),new Array());
    merged = items.additionals;   
    var tnt_choices = items.tnt_choices;
    for(var i = 0; i < tnt_choices.length; i++){
        merged[0].push(tnt_choices[i].split('www.').slice(1).toString());
        merged[1].push(tnt_choices[i].toString());
    }
    for(var i = 0; i < merged[0].length; i++){  
        if(merged[0][i] > merged[0][i+1]){ 
            var buffer = merged[0][i];
            merged[0][i] = merged[0][i+1];
            merged[0][i+1] = buffer;
            buffer = merged[1][i];
            merged[1][i] = merged[1][i+1];
            merged[1][i+1] = buffer;
            (i<2)?i=-1:i-=2;
        }
    }
    var address = items.address;
    if (address === "google") {
        window.location.href = 'http://www.' + address + "." + items.domain;
    } else if (address === 'custom') {
        window.location.href = 'http://' + items.customaddress;
    }
    else {
        var down = document.createElement("div");
        var center_div = document.createElement("div");
        for (var i = 0; i < merged[0].length; i++) {
            var link = document.createElement("a");
            var img = document.createElement("span");
            var text = document.createTextNode(merged[0][i]);
            var canvas = document.createElement("canvas");
            
            var ctx = canvas.getContext("2d");
            ctx.canvas.className = "icon";
            ctx.font = "180px Courier New bold";
            ctx.fillText(merged[0][i].slice(0, 1).toUpperCase(), 80, 130);

            img.className = "img_container";
            img.appendChild(canvas);
            img.appendChild(text);

            link.setAttribute("href", "http://" + merged[1][i]);
            link.appendChild(img);

            center_div.className = "center_div";
            center_div.appendChild(link);
        }
        down.appendChild(center_div);
        down.className = "down";
        document.getElementById("body").appendChild(down);
    }
});
