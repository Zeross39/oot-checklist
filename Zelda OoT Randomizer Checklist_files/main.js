//current lists
var checkedList = [];
var woh = [];
var startingItems = [];
var obtainedItems = {};

function songWarpTo(loc)
{
	var warpKnown = false;
	var warpSelect;
	$(".warpDestinationList").each(function (i, obj) {
		var sel = obj.value;
		if(sel && sel === loc)
		{
			warpKnown = true;
			warpSelect = obj;
		}
	});
	if(!warpKnown)
	{
		return false;
	}
	
	switch (warpSelect.id)
	{
		case "minuetWarpDestination": 
			return obtainedItems.minuet;
		case "boleroWarpDestination":
			return obtainedItems.bolero;
		case "serenadeWarpDestination":
			return obtainedItems.serenade;
		case "requiemWarpDestination": 
			return obtainedItems.requiem;
		case "nocturneWarpDestination": 
			return obtainedItems.nocturne;
		case "preludeWarpDestination": 
			return obtainedItems.prelude;
		default: 
			console.log("Cant find warp for "+loc+" / "+age);
			return false;
	}
}

function accessEntrance(loc, age)
{
	switch (loc)
	{
		case "forest": 
			return (obtainedItems.saria || songWarpTo("meadow")) && obtainedItems.hookshot;
		case "water":
			return (obtainedItems.iron && obtainedItems.hookshot) || obtainedItems.hookshot === 2;
		case "fire":
			return songWarpTo("crater") || obtainedItems.hookshot || obtainedItems.hover;
		case "spirit": 
			if (age === "child")
			{
				return songWarpTo("colossus");
			}
			else
			{
				return accessColossus() || $("#checkmark362").innerText !== "";
			}
		case "shadow": 
			return songWarpTo("graveyard") && obtainedItems.magic && obtainedItems.dins;
		case "botw": 
			return obtainedItems.storm;
		case "gtg": 
			return obtainedItems.gerudoCard && accessGerudoFortress();
		case "deku": 
			return true;
		case "dc": 
			return true;
		case "jabu": 
			if(age === "child")
			{
				return accessDomain() && obtainedItems.letter;
			}
			else
			{
				return false;
			}
		case "ice": 
			if(age === "child")
			{
				return false;
			}
			else
			{
				return accessFontain();
			}
		default: 
			console.log("Cant find access for "+loc+" / "+age);
			return false;
	}	
}

function accessDungeon(loc, age)
{
	var locationKnown = false;
	var trueLocation;
	$(".dungeonErSelection").each(function (i, obj) {
		var sel = obj.value;
		if(sel && sel === loc)
		{
			locationKnown = true;
			trueLocation = obj;
		}
	});
	if(!locationKnown)
	{
		return false;
	}
	
	switch (trueLocation.id)
	{
		case "dekuIs": 
			return accessEntrance("deku", age);
		case "waterIs":
			return accessEntrance("water", age);
		case "dcIs":
			return accessEntrance("dc", age);
		case "fireIs": 
			return accessEntrance("fire", age);
		case "jabuIs": 
			return accessEntrance("jabu", age);
		case "spiritIs": 
			return accessEntrance("spirit", age);
		case "forestIs": 
			return accessEntrance("forest", age);
		case "shadowIs": 
			return accessEntrance("shadow", age);
		case "botwIs": 
			return accessEntrance("botw", age);
		case "gtgIs": 
			return accessEntrance("gtg", age);
		case "iceIs": 
			return accessEntrance("ice", age);
		default: 
			console.log("Cant find dungon for "+loc+" / "+age);
			return false;
	}
}

function accessCrater()
{
	return songWarpTo("crater") || obtainedItems.hookshot || obtainedItems.hover;
}

function accessMeadowAdult()
{
	return obtainedItems.saria || songWarpTo("meadow");
}

function accessGerudoFortress()
{
	return true;
}

function accessWasteland()
{
	return (accessGerudoFortress() && obtainedItems.gerudoCard) || songWarpTo("wasteland");
}

function accessDomain()
{
	return (accessRiver() && obtainedItems.lullaby) || songWarpTo("domain");
}

function accessRiver()
{
	return (obtainedItems.bomb || obtainedItems.scale) || songWarpTo("river");
}

function accessColossus()
{
	return songWarpTo("colossus") || (accessWasteland() && obtainedItems.lens && obtainedItems.magic);
}

function accessFontain()
{
	return accessDomain() || songWarpTo("fontain");
}

function haveEmptyBottle()
{
	return obtainedItems.bottle || (obtainedItems.letter && accessDomain());
}

function refreshObtainedItemList()
{
	for(var i = 0; i < medallionList.length; i++)
	{
		obtainedItems[medallionList[i].Id] = HaveItem(medallionList[i].Id);
	}
	for(var i = 0; i < itemList.length; i++)
	{
		obtainedItems[itemList[i].Id] = HaveItem(itemList[i].Id);
	}
	for(var i = 0; i < startingItems.length; i++)
	{
		obtainedItems[startingItems[i]]++;
	}
	refreshList();
}

function HaveItem(item)
{
	var num = 0;
	var numberGot = 0;
	$(".linecheck").each(function (i, obj) {
		if(obj.children[0].innerText !== "")
		{
			if($("#item"+num).find("option:selected")[0].value === item)
			{
				numberGot++;
			}
		}
		num++;
	});
	return numberGot;
}

function HaveRequiredItem(checkId)
{
	return checkList.length >= checkId && checkList[checkId].Requirements();
}


function KeyUsed(loc)
{
	return 0;
}

function init()
{	
	DrawList();
	createWohList();
	createStartItemList();
	createErList();
	createWarpDestinationList();
	refreshObtainedItemList();
	
	$("[name='checkedFilter']").each(function (i, obj) {
	obj.addEventListener("change", changeFilterChecked);
	});
	
	$("[name='ageFilter']").each(function (i, obj) {
	obj.addEventListener("change", changeFilterAge);
	});
	
	$(".dungeonErSelection").each(function (i, obj) {
		obj.addEventListener("change", refreshList);
	});

	$("#filterLocationList")[0].addEventListener("change", changeFilterLocation);

	$("[name='item']").each(function (i, obj) {
		obj.addEventListener("change", refreshObtainedItemList);
	});
}

function addStartItem(selectedItem)
{
	if(selectedItem)
	{
		startingItems.push(selectedItem);
	}
	else
	{
		var select = $("#addStartItemList")[0];
		var val;
		for(var v of select.options)
		{
			if(v.selected)
			{
				val = v.value;
			}
		}
		startingItems.push(val);
		refreshObtainedItemList();
	}
	var listText = "";
	for(var v of startingItems)
	{
		var item = itemList.find(e => e.Id === v);
		if(!item)
		{
			item = medallionList.find(e => e.Id === v)
		}
		listText = listText + item.Label + ", ";
	}
	$("#startItemList")[0].innerHTML = listText;
}

function addWoh(selectedWoh)
{
	if(selectedWoh)
	{
		woh.push(selectedWoh);
	}
	else
	{
		var select = $("#addWohList")[0];
		var val;
		for(var v of select.options)
		{
			if(v.selected)
			{
				val = v.value;
			}
		}
		
		woh.push(val);
	}
	
	var listText = "";
	for(var v of woh)
	{
		listText = listText + locationList.find(e => e.Id === v).Label + ", ";
	}
	$("#wohList")[0].innerHTML = listText;
	refreshList();
}

function Conf()
{
}

function doBarren()
{
	var barren = $("#barrenLocationList").find("option:selected")[0].value;
	
	for(var i = 0; i < checkList.length; i++)
	{
		if(checkList[i].Location === barren)
		{
			addMark(i, true);
		}
	}
}

function toggleCheck(checkId)
{
	if(checkedList.indexOf(checkId) > -1)
	{
		checkedList = checkedList.filter(e => e !== checkId);
		removeMark(checkId);
	}
	else
	{
		checkedList.push(checkId);
		addMark(checkId, true);
	}
}

init();