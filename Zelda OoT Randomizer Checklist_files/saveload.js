function Save ()
{
	var checked = [];
	
	var num = 0;
	$(".linecheck").each(function (i, obj) {
		var tds = obj.children;
		var item = $("#item"+num).find("option:selected")[0];
		var price = $("#price"+num)[0];
		checked.push({ checked: tds[0].innerText !== "", item: item.value, price: price?price.value:""});
		num++;
	});
	var erSave = 
	{
		deku: $("#dekuIs")[0].value,
		dc: $("#dcIs")[0].value,
		jabu: $("#jabuIs")[0].value,
		forest: $("#forestIs")[0].value,
		water: $("#waterIs")[0].value,
		fire: $("#fireIs")[0].value,
		spirit: $("#spiritIs")[0].value,
		shadow: $("#shadowIs")[0].value,
		gtg: $("#gtgIs")[0].value,
		ice: $("#iceIs")[0].value,
		botw: $("#botwIs")[0].value
	};
	var warpSave = 
	{
		minuet: $("#minuetWarpDestination")[0].value,
		bolero: $("#boleroWarpDestination")[0].value,
		serenade: $("#serenadeWarpDestination")[0].value,
		requiem: $("#requiemWarpDestination")[0].value,
		nocturne: $("#nocturneWarpDestination")[0].value,
		prelude: $("#preludeWarpDestination")[0].value
	};
	var myFile = new File([JSON.stringify(checked)+JSON.stringify(woh)+JSON.stringify(startingItems)+JSON.stringify(erSave)+JSON.stringify(warpSave)], "save.txt", {type: "text/plain;charset=utf-8"});
	saveAs(myFile);
}

function loadInternal(text)
{
	var begin = text.indexOf("[");
	var end = text.indexOf("]");
	var length = end+1 - begin;
	var checkedText = text.substr(begin, length);
	var checked = JSON.parse(checkedText);
	for(var i=0;i<checked.length; i++)
	{
		var id = "#item"+i;
		var elem = $(id);
		elem.children("option").each(function (j, obj){
			if(obj.value === checked[i].item)
			{
				obj.selected = true;
			}
		});
		if(checked[i].price)
		{
			$("#price"+i)[0].value = checked[i].price;
		}
		if(checked[i].checked)
		{
			addMark(i, false);
		}
	}
	var remainingText = text.substr(end+1);
	begin = remainingText.indexOf("[");
	end = remainingText.indexOf("]");
	length = end+1 - begin;
	wohTxt = remainingText.substr(begin, length);
	wohJson = JSON.parse(wohTxt);
	for(var i=0;i<wohJson.length; i++)
	{
		addWoh(wohJson[i]);
	}
	remainingText = remainingText.substr(end+1);
	begin = remainingText.indexOf("[");
	end = remainingText.indexOf("]");
	length = end+1 - begin;
	startItemTxt = remainingText.substr(begin, length);
	startItemJson = JSON.parse(startItemTxt);
	for(var i=0;i<startItemJson.length; i++)
	{
		addStartItem(startItemJson[i]);
	}
	remainingText = remainingText.substr(end+1);
	begin = remainingText.indexOf("{");
	end = remainingText.indexOf("}");
	length = end+1 - begin;
	erTxt = remainingText.substr(begin, length);
	erJson = JSON.parse(erTxt);
	$("#dekuIs")[0].value = erJson.deku;
	$("#dcIs")[0].value = erJson.dc;
	$("#jabuIs")[0].value = erJson.jabu;
	$("#forestIs")[0].value = erJson.forest;
	$("#waterIs")[0].value = erJson.water;
	$("#fireIs")[0].value = erJson.fire;
	$("#spiritIs")[0].value = erJson.spirit;
	$("#shadowIs")[0].value = erJson.shadow;
	$("#gtgIs")[0].value = erJson.gtg;
	$("#iceIs")[0].value = erJson.ice;
	$("#botwIs")[0].value = erJson.botw;
	
	remainingText = remainingText.substr(end+1);
	begin = remainingText.indexOf("{");
	end = remainingText.indexOf("}");
	length = end+1 - begin;
	warpTxt = remainingText.substr(begin, length);
	warpJson = JSON.parse(warpTxt);
	$("#minuetWarpDestination")[0].value = warpJson.minuet;
	$("#boleroWarpDestination")[0].value = warpJson.bolero;
	$("#serenadeWarpDestination")[0].value = warpJson.serenade;
	$("#requiemWarpDestination")[0].value = warpJson.requiem;
	$("#nocturneWarpDestination")[0].value = warpJson.nocturne;
	$("#preludeWarpDestination")[0].value = warpJson.prelude;
	
	refreshObtainedItemList();
}

function Load()
{
	navigator.clipboard.readText().then(clipText =>
	loadInternal(clipText)
  );
}