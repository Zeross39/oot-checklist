//current lists
var checkedList = [];
var woh = [];
var startingItems = [];
var obtainedItems = {};

function accessForestTemple()
{
	return (obtainedItems.saria || obtainedItems.minuet) && obtainedItems.hookshot;
}

function accessWaterTemple()
{
	return (obtainedItems.iron && obtainedItems.hookshot) || obtainedItems.hookshot === 2;
}

function accessFireTemple()
{
	return obtainedItems.bolero || obtainedItems.hookshot || obtainedItems.hover;
}

function accessSpiritTempleChild()
{
	return obtainedItems.requiem;
}

function accessSpiritTempleAdult()
{
	return accessColossus() && obtainedItems.strength > 1;
}

function accessShadowTemple()
{
	return obtainedItems.nocturne && obtainedItems.magic && obtainedItems.dins;
}

function accessBotw()
{
	return obtainedItems.storm;
}

function accessGtg()
{
	return obtainedItems.gerudoCard && accessGerudoFortress();
}

function accessDeku()
{
	return true;
}

function accessDc()
{
	return true;
}

function accessJabu()
{
	return accessDomain() && obtainedItems.letter;
}

function accessMeadowAdult()
{
	return true;
}

function accessGerudoFortress()
{
	return true;
}

function accessWasteland()
{
	return accessGerudoFortress() && obtainedItems.gerudoCard;
}

function accessDomain()
{
	return accessRiver() && obtainedItems.lullaby;
}

function accessRiver()
{
	return obtainedItems.bomb || obtainedItems.scale;
}

function accessColossus()
{
	return obtainedItems.requiem || (accessWasteland() && obtainedItems.lens && obtainedItems.magic);
}

function accessFontain()
{
	return accessDomain();
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