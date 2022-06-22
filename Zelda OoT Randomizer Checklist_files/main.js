//static conf list
var itemList = [];
var checkList = [];
var locationList = [];
var medallionList = [];
var obtainableItemLook = "border-bottom:1pt dotted black; background-Color:#ffcccb;";
var obtainedItemLook = "border-bottom:1pt dotted black; background-Color:beige;"
var visibleItemLook = "border-bottom:1pt dotted black;"
var hiddenItemLook = "display:none;"

//current lists
var checkedList = [];
var woh = [];
var startingItems = [];
var filterChecked = "All";
var filterLocation = "All";
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
	console.log(checkId);
	return checkList.length >= checkId && checkList[checkId].Requirements();
}

function changeFilterChecked(e)
{
	filterChecked = e.srcElement.value;
	refreshList();
}

function changeFilterLocation(e)
{
	filterLocation = $("#filterLocationList").find("option:selected")[0].value;
	refreshList();
}

function refreshList()
{
	var num = 0;
	$(".linecheck").each(function (i, obj) {
		var shouldDisplay = true;
		if(filterLocation !== "All" && checkList[i].Location !== filterLocation)
		{
			shouldDisplay = false;
		}
		if(filterChecked !== "All")
		{
			if(filterChecked === "Available" && !HaveRequiredItem(num))
			{
				shouldDisplay = false;
			}
			else
			{
				var expectChecked = filterChecked === "Checked";
				if(expectChecked !== (obj.children[0].innerText !== ""))
				{
					shouldDisplay = false;
				}
			}
		}
		if(shouldDisplay)
		{
			if($("#checkMark"+num)[0].innerText !== "")
			{
				obj.setAttribute("style", obtainedItemLook);
			}
			else
			{
				if(HaveRequiredItem(num))
				{
					obj.setAttribute("style", obtainableItemLook);
				}
				else
				{
					obj.setAttribute("style", visibleItemLook);
				}
			}
		}
		else
		{
			obj.setAttribute("style", hiddenItemLook);
		}
		num++;
	});
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
	refreshObtainedItemList();
	
	$("[name='checkedFilter']").each(function (i, obj) {
	obj.addEventListener("change", changeFilterChecked);
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

function createStartItemList()
{
	var select = $("#addStartItemList")[0];
 
	for (var i = 0; i < itemList.length; i++)
	{
		var option = document.createElement("option");
		option.value = itemList[i].Id;
		option.text = itemList[i].Label;
		select.appendChild(option);
	}
	
	for (var i = 1; i < medallionList.length; i++)
	{
		var option = document.createElement("option");
		option.value = medallionList[i].Id;
		option.text = medallionList[i].Label;
		select.appendChild(option);
	}
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
}

function createWohList()
{
	var selectWoh = $("#addWohList")[0];
	var barrenList = $("#barrenLocationList")[0];
	var filterLocationList = $("#filterLocationList")[0];
	var option = document.createElement("option");
	option.value = "All";
	option.text = "All";
	filterLocationList.appendChild(option);
 
	for (var i = 0; i < locationList.length; i++)
	{
		var option = document.createElement("option");
		option.value = locationList[i].Id;
		option.text = locationList[i].Label;
		selectWoh.appendChild(option);
		option = document.createElement("option");
		option.value = locationList[i].Id;
		option.text = locationList[i].Label;
		barrenList.appendChild(option);
		option = document.createElement("option");
		option.value = locationList[i].Id;
		option.text = locationList[i].Label;
		filterLocationList.appendChild(option);
	}
}

function Conf()
{
}

function DrawList()
{
	var list = $(".listTop");
	var table = document.createElement("table");
	table.setAttribute('id', 'checkList');
	table.setAttribute("style", "width:100%");
	var header = document.createElement("tr");
	header.setAttribute("style", visibleItemLook);
	
	var current = document.createElement("th");
	current.textContent = "";
	current.setAttribute("style", "width:1%");
	//current.setAttribute('onclick', 'sortTable(0)');
	header.appendChild(current);
	
	current = document.createElement("th");
	current.textContent = "Name";
	//current.setAttribute("style", "width:40%");
	//current.setAttribute('onclick', 'sortTable(0)');
	header.appendChild(current);
	
	current = document.createElement("th");
	current.textContent = "Location";
	current.setAttribute("style", "width:20%");
	//current.setAttribute('onclick', 'sortTable(1)');
	header.appendChild(current);
	
	current = document.createElement("th");
	current.textContent = "Item";
	current.setAttribute("style", "width:10%");
	//current.setAttribute('onclick', 'sortTable(1)');
	header.appendChild(current);
	
	current = document.createElement("th");
	current.textContent = "";
	header.appendChild(current);
	
	table.appendChild(header);
	
	var line;
	
	for (var i = 0; i < checkList.length; i++)
	{
		line = document.createElement("tr");
		line.setAttribute("style", visibleItemLook);
		line.setAttribute("id", "line"+i);
		line.setAttribute("class", "linecheck");
		
		current = document.createElement("td")
		current.setAttribute("id", "checkMark"+i);
		line.appendChild(current);

		current = document.createElement("td");
		current.textContent = checkList[i].Label;
		line.appendChild(current);
		current = document.createElement("td");
		current.textContent = locationList.find(e => e.Id === checkList[i].Location).Label;
		line.appendChild(current);
		current = document.createElement("td");

		var select = document.createElement("select");
		select.name = "item";
		select.id = "item"+ i;
		select.setAttribute("class", "itemSelection");
	 
		var listToUse;
		if (i < 8)
		{
			listToUse = medallionList;
		}
		else
		{
			listToUse = itemList;
		}

		for (const val of listToUse)
		{
			var option = document.createElement("option");
			option.value = val.Id;
			option.text = val.Label;
			select.appendChild(option);
		}
	 
	 
		current.appendChild(select);
		if(checkList[i].Tags.indexOf("shop") > -1)
		{
			var priceLabel = document.createElement("span");
			var price = document.createElement("input");
			price.id = "price"+i;
			price.setAttribute("style", "width:70px");
			priceLabel.innerHTML = "Price : ";
			priceLabel.appendChild(price);
			current.appendChild(priceLabel);
		}
		line.appendChild(current);
			
		current = document.createElement("td");
		var but = document.createElement("button");
		but.innerText = "Check";
		but.setAttribute("onclick", "toggleCheck("+checkList[i].Id+")");
		current.appendChild(but);
		
		line.appendChild(current);
		

		table.appendChild(line);
	}
	
	list[0].appendChild(table);
}

function Save ()
{
	var checked = [];
	
	var num = 0;
	$(".linecheck").each(function (i, obj) {
		var tds = obj.children;
		$("#item"+num).find("option:selected");
		checked.push({ checked: tds[0].innerText !== "", item: $("#item"+num).find("option:selected")[0].value});
		num++;
	});
	var myFile = new File([JSON.stringify(checked)+JSON.stringify(woh)+JSON.stringify(startingItems)], "save.txt", {type: "text/plain;charset=utf-8"});
	saveAs(myFile);
}

function Load()
{
	navigator.clipboard.readText().then(clipText =>
	loadInternal(clipText)
  );
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
	refreshObtainedItemList();
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

function addMark(checkId, refresh)
{
	$("#checkMark"+checkId)[0].innerText = "✓";
	if(refresh)
	{
		refreshObtainedItemList();
	}
}

function removeMark(checkId)
{
	$("#checkMark"+checkId)[0].innerText = "";
	refreshObtainedItemList();
}

// LISTS
medallionList = [
	{
		"Id": "",
		"Label": ""
	},
	{
		"Id": "dekuStone",
		"Label": "Kokiris Emerald"
	},
	{
		"Id": "dcStone",
		"Label": "Gorons Ruby"
	},
	{
		"Id": "jabuStone",
		"Label": "Zoras Sapphire"
	},
	{
		"Id": "forestMedallion",
		"Label": "Forest Medallion"
	},
	{
		"Id": "waterMedallion",
		"Label": "Water Medallion"
	},
	{
		"Id": "fireMedallion",
		"Label": "Fire Medallion"
	},
	{
		"Id": "spiritMedallion",
		"Label": "Spirit Medallion"
	},
	{
		"Id": "shadowMedallion",
		"Label": "Shadow Medallion"
	},
	{
		"Id": "lightMedallion",
		"Label": "Light Medallion"
	},
];

itemList = [
	{
		"Id": "",
		"Label": ""
	},
	{
		"Id": "uknownItem",
		"Label": "Item ?"
	},
	{
		"Id": "bigoron",
		"Label": "Biggoron Sword"
	},
	{
		"Id": "bolero",
		"Label": "Bolero of Fire"
	},
	{
		"Id": "bomb",
		"Label": "Bomb Bag"
	},
	{
		"Id": "bombchus",
		"Label": "Bombchus"
	},
	{
		"Id": "boomerang",
		"Label": "Boomerang"
	},
	{
		"Id": "bkForest",
		"Label": "Boss key forest"
	},
	{
		"Id": "bkFire",
		"Label": "Boss key fire"
	},
	{
		"Id": "bkWater",
		"Label": "Boss key water"
	},
	{
		"Id": "bkSpirit",
		"Label": "Boss key spirit"
	},
	{
		"Id": "bkShadow",
		"Label": "Boss key shadow"
	},
	{
		"Id": "bkGanon",
		"Label": "Boss key ganon"
	},
	{
		"Id": "bkUnknown",
		"Label": "Boss key ?"
	},
	{
		"Id": "bottle",
		"Label": "Bottle"
	},
	{
		"Id": "bow",
		"Label": "Bow"
	},
	{
		"Id": "claim",
		"Label": "Claim Check"
	},
	{
		"Id": "dins",
		"Label": "Dins Fire"
	},
	{
		"Id": "defense",
		"Label": "Double Defense"
	},
	{
		"Id": "epona",
		"Label": "Eponas Song"
	},
	{
		"Id": "farores",
		"Label": "Farores Wind"
	},
	{
		"Id": "fireArrow",
		"Label": "Fire arrow"
	},
	{
		"Id": "gerudoCard",
		"Label": "Gerudo card"
	},
	{
		"Id": "goron",
		"Label": "Goron Tunic"
	},
	{
		"Id": "hover",
		"Label": "Hover Boots"
	},
	{
		"Id": "iceArrow",
		"Label": "Ice Arrows"
	},
	{
		"Id": "iron",
		"Label": "Iron Boots"
	},
	{
		"Id": "kokiriSword",
		"Label": "Kokiri sword"
	},
	{
		"Id": "lens",
		"Label": "Lens of Truth"
	},
	{
		"Id": "lightArrow",
		"Label": "Light Arrows"
	},
	{
		"Id": "bean",
		"Label": "Magic Bean Pack"
	},
	{
		"Id": "magic",
		"Label": "Magic Meter"
	},
	{
		"Id": "hammer",
		"Label": "Megaton Hammer"
	},
	{
		"Id": "hookshot",
		"Label": "Hookshot"
	},
	{
		"Id": "minuet",
		"Label": "Minuet of Forest"
	},
	{
		"Id": "mirror",
		"Label": "Mirror Shield"
	},
	{
		"Id": "nayrus",
		"Label": "Nayrus Love"
	},
	{
		"Id": "nocturne",
		"Label": "Nocturne of Shadow"
	},
	{
		"Id": "ocarina",
		"Label": "Ocarina"
	},
	{
		"Id": "prelude",
		"Label": "Prelude of Light"
	},
	{
		"Id": "requiem",
		"Label": "Requiem of Spirit"
	},
	{
		"Id": "letter",
		"Label": "Rudos letter"
	},
	{
		"Id": "saria",
		"Label": "Sarias Song"
	},
	{
		"Id": "scale",
		"Label": "Scale"
	},
	{
		"Id": "serenade",
		"Label": "Serenade of Water"
	},
	{
		"Id": "skForest",
		"Label": "Small key forest"
	},
	{
		"Id": "skFire",
		"Label": "Small key fire"
	},
	{
		"Id": "skWater",
		"Label": "Small key water"
	},
	{
		"Id": "skSpirit",
		"Label": "Small key spirit"
	},
	{
		"Id": "skShadow",
		"Label": "Small key shadow"
	},
	{
		"Id": "skGtg",
		"Label": "Small key gtg"
	},
	{
		"Id": "skGanon",
		"Label": "Small key ganon"
	},
	{
		"Id": "skBotw",
		"Label": "Small key botw"
	},
	{
		"Id": "skUnknown",
		"Label": "Small key ?"
	},
	{
		"Id": "slingshot",
		"Label": "Slingshot"
	},
	{
		"Id": "time",
		"Label": "Song of Time"
	},
	{
		"Id": "agony",
		"Label": "Stone of Agony"
	},
	{
		"Id": "storm",
		"Label": "Song of Storms"
	},
	{
		"Id": "strength",
		"Label": "Strength"
	},
	{
		"Id": "sun",
		"Label": "Sun song"
	},
	{
		"Id": "wallet",
		"Label": "Wallet"
	},
	{
		"Id": "lullaby",
		"Label": "Zeldas Lullaby"
	},
	{
		"Id": "zora",
		"Label": "Zora Tunic"
	}
];

checkList = [
   {
      "Id":"0",
      "Label":"Queen Gohma",
      "Requirements":function ()
		{
			return HaveRequiredItem("235");
		},
      "Tags":[
         
      ],
      "Location":"deku"
   },
   {
      "Id":"1",
      "Label":"King Dodongo",
      "Requirements":function ()
		{
			return accessDc() && obtainedItems.bomb;
		},
      "Tags":[
         
      ],
      "Location":"dc"
   },
   {
      "Id":"2",
      "Label":"Barinade",
      "Requirements":function ()
		{
			return accessJabu() && obtainedItems.boomerang;
		},
      "Tags":[
         
      ],
      "Location":"jabu"
   },
   {
      "Id":"3",
      "Label":"Phantom Ganon",
      "Requirements":function ()
		{
			return HaveRequiredItem("296");
		},
      "Tags":[
         
      ],
      "Location":"forest"
   },
   {
      "Id":"4",
      "Label":"Volvagia",
      "Requirements":function ()
		{
			return HaveRequiredItem("316");
		},
      "Tags":[
         
      ],
      "Location":"fire"
   },
   {
      "Id":"5",
      "Label":"Morpha",
      "Requirements":function ()
		{
			return HaveRequiredItem("332");
		},
      "Tags":[
         
      ],
      "Location":"water"
   },
   {
      "Id":"6",
      "Label":"Bongo Bongo",
      "Requirements":function ()
		{
			return HaveRequiredItem("355");
		},
      "Tags":[
         
      ],
      "Location":"shadow"
   },
   {
      "Id":"7",
      "Label":"Twinrova",
      "Requirements":function ()
		{
			return HaveRequiredItem("380");
		},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"8",
      "Label":"Song from Impa",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "song"
      ],
      "Location":"market"
   },
   {
      "Id":"9",
      "Label":"Song from Malon",
      "Requirements":function ()
		{
			return obtainedItems.ocarina;
		},
      "Tags":[
         "song"
      ],
      "Location":"ranch"
   },
   {
      "Id":"10",
      "Label":"Song from Saria",
      "Requirements":function ()
		{
			return obtainedItems.ocarina;
		},
      "Tags":[
         "song"
      ],
      "Location":"meadow"
   },
   {
      "Id":"11",
      "Label":"Song from Royal Familys Tomb",
      "Requirements":function ()
		{
			return obtainedItems.lullaby;
		},
      "Tags":[
         "song"
      ],
      "Location":"kak"
   },
   {
      "Id":"12",
      "Label":"Song from Ocarina of Time",
      "Requirements":function ()
		{
			return obtainedItems.dekuStone && obtainedItems.dcStone && obtainedItems.jabuStone;
		},
      "Tags":[
         "song"
      ],
      "Location":"tot"
   },
   {
      "Id":"13",
      "Label":"Song from Windmill",
      "Requirements":function ()
		{
			return obtainedItems.ocarina;
		},
      "Tags":[
         "song"
      ],
      "Location":"kak"
   },
   {
      "Id":"14",
      "Label":"Sheik in Forest",
      "Requirements":function ()
		{
			return obtainedItems.saria || obtainedItems.minuet;
		},
      "Tags":[
         "song"
      ],
      "Location":"meadow"
   },
   {
      "Id":"15",
      "Label":"Sheik in Crater",
      "Requirements":function ()
		{
			return obtainedItems.bolero || obtainedItems.hover || obtainedItems.hookshot;
		},
      "Tags":[
         "song"
      ],
      "Location":"crater"
   },
   {
      "Id":"16",
      "Label":"Sheik in Ice Cavern",
      "Requirements":function ()
		{
			return HaveRequiredItem("384");
		},
      "Tags":[
         "song"
      ],
      "Location":"ice"
   },
   {
      "Id":"17",
      "Label":"Sheik at Colossus",
      "Requirements":function ()
		{
			return accessColossus();
		},
      "Tags":[
         "song"
      ],
      "Location":"colossus"
   },
   {
      "Id":"18",
      "Label":"Sheik in Kakariko",
      "Requirements":function ()
		{
			return obtainedItems.forestMedallion && obtainedItems.waterMedallion && obtainedItems.fireMedallion;
		},
      "Tags":[
         "song"
      ],
      "Location":"kak"
   },
   {
      "Id":"19",
      "Label":"Sheik at Temple",
      "Requirements":function ()
		{
			return obtainedItems.forestMedallion;
		},
      "Tags":[
         "song"
      ],
      "Location":"tot"
   },
   {
      "Id":"20",
      "Label":"KF Midos Top Left Chest",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"kokiri"
   },
   {
      "Id":"21",
      "Label":"KF Midos Top Right Chest",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"kokiri"
   },
   {
      "Id":"22",
      "Label":"KF Midos Bottom Left Chest",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"kokiri"
   },
   {
      "Id":"23",
      "Label":"KF Midos Bottom Right Chest",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"kokiri"
   },
   {
      "Id":"24",
      "Label":"KF Storms Grotto Chest",
      "Requirements":function ()
		{
			return obtainedItems.storm;
		},
      "Tags":[
         
      ],
      "Location":"kokiri"
   },
   {
      "Id":"25",
      "Label":"KF GS Know It All House",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "gs"
      ],
      "Location":"kokiri"
   },
   {
      "Id":"26",
      "Label":"KF GS Bean Patch",
      "Requirements":function ()
		{
			return haveEmptyBottle();
		},
      "Tags":[
         "gs"
      ],
      "Location":"kokiri"
   },
   {
      "Id":"27",
      "Label":"KF GS House of Twins",
      "Requirements":function ()
		{
			return obtainedItems.hookshot;
		},
      "Tags":[
         "gs"
      ],
      "Location":"kokiri"
   },
   {
      "Id":"28",
      "Label":"KF Shop Item 1",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"kokiri"
   },
   {
      "Id":"29",
      "Label":"KF Shop Item 2",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"kokiri"
   },
   {
      "Id":"30",
      "Label":"KF Shop Item 3",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"kokiri"
   },
   {
      "Id":"31",
      "Label":"KF Shop Item 4",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"kokiri"
   },
   {
      "Id":"32",
      "Label":"LW Ocarina Memory Game",
      "Requirements":function ()
		{
			return obtainedItems.ocarina;
		},
      "Tags":[
         
      ],
      "Location":"wood"
   },
   {
      "Id":"33",
      "Label":"LW Target in Woods",
      "Requirements":function ()
		{
			return obtainedItems.slingshot;
		},
      "Tags":[
         
      ],
      "Location":"wood"
   },
   {
      "Id":"34",
      "Label":"LW Near Shortcuts Grotto Chest",
      "Requirements":function ()
		{
			return obtainedItems.bomb;
		},
      "Tags":[
         
      ],
      "Location":"wood"
   },
   {
      "Id":"35",
      "Label":"Deku Theater Skull Mask",
      "Requirements":function ()
		{
			return false;
		},
      "Tags":[
         
      ],
      "Location":"wood"
   },
   {
      "Id":"36",
      "Label":"Deku Theater Mask of Truth",
      "Requirements":function ()
		{
			return false;
		},
      "Tags":[
         
      ],
      "Location":"wood"
   },
   {
      "Id":"37",
      "Label":"LW Skull Kid",
      "Requirements":function ()
		{
			return obtainedItems.saria;
		},
      "Tags":[
         
      ],
      "Location":"wood"
   },
   {
      "Id":"38",
      "Label":"LW Deku Scrub Near Bridge",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"wood"
   },
   {
      "Id":"39",
      "Label":"LW Deku Scrub Near Deku Theater Left",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"wood"
   },
   {
      "Id":"40",
      "Label":"LW Deku Scrub Near Deku Theater Right",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"wood"
   },
   {
      "Id":"41",
      "Label":"LW Deku Scrub Grotto Front",
      "Requirements":function ()
		{
			return obtainedItems.bomb;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"wood"
   },
   {
      "Id":"42",
      "Label":"LW Deku Scrub Grotto Rear",
      "Requirements":function ()
		{
			return obtainedItems.bomb;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"wood"
   },
   {
      "Id":"43",
      "Label":"LW GS Bean Patch Near Bridge",
      "Requirements":function ()
		{
			return haveEmptyBottle();
		},
      "Tags":[
         "gs"
      ],
      "Location":"wood"
   },
   {
      "Id":"44",
      "Label":"LW GS Bean Patch Near Theater",
      "Requirements":function ()
		{
			return haveEmptyBottle();
		},
      "Tags":[
         "gs"
      ],
      "Location":"wood"
   },
   {
      "Id":"45",
      "Label":"LW GS Above Theater",
      "Requirements":function ()
		{
			return obtainedItems.bean && accessMeadowAdult();
		},
      "Tags":[
         "gs"
      ],
      "Location":"wood"
   },
   {
      "Id":"46",
      "Label":"SFM Wolfos Grotto Chest",
      "Requirements":function ()
		{
			return obtainedItems.bomb;
		},
      "Tags":[
         
      ],
      "Location":"meadow"
   },
   {
      "Id":"47",
      "Label":"SFM Deku Scrub Grotto Front",
      "Requirements":function ()
		{
			return obtainedItems.storm;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"meadow"
   },
   {
      "Id":"48",
      "Label":"SFM Deku Scrub Grotto Rear",
      "Requirements":function ()
		{
			return obtainedItems.storm;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"meadow"
   },
   {
      "Id":"49",
      "Label":"SFM GS",
      "Requirements":function ()
		{
			return obtainedItems.hookshot && accessMeadowAdult();
		},
      "Tags":[
         "gs"
      ],
      "Location":"meadow"
   },
   {
      "Id":"50",
      "Label":"HF Near Market Grotto Chest",
      "Requirements":function ()
		{
			return obtainedItems.bomb;
		},
      "Tags":[
         
      ],
      "Location":"field"
   },
   {
      "Id":"51",
      "Label":"HF Tektite Grotto Freestanding PoH",
      "Requirements":function ()
		{
			return obtainedItems.bomb && (obtainedItems.scale || obtainedItems.iron);
		},
      "Tags":[
         
      ],
      "Location":"field"
   },
   {
      "Id":"52",
      "Label":"HF Southeast Grotto Chest",
      "Requirements":function ()
		{
			return obtainedItems.bomb
		},
      "Tags":[
         
      ],
      "Location":"field"
   },
   {
      "Id":"53",
      "Label":"HF Open Grotto Chest",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"field"
   },
   {
      "Id":"54",
      "Label":"HF Deku Scrub Grotto",
      "Requirements":function ()
		{
			return obtainedItems.bomb;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"field"
   },
   {
      "Id":"55",
      "Label":"HF GS Cow Grotto",
      "Requirements":function ()
		{
			return obtainedItems.bomb && (obtainedItems.fireArrow || obtainedItems.dins) && obtainedItems.magic;
		},
      "Tags":[
         "gs"
      ],
      "Location":"field"
   },
   {
      "Id":"56",
      "Label":"HF GS Near Kak Grotto",
      "Requirements":function ()
		{
			return obtainedItems.bomb && (obtainedItems.hookshot || obtainedItems.boomerang);
		},
      "Tags":[
         "gs"
      ],
      "Location":"field"
   },
   {
      "Id":"57",
      "Label":"Market Shooting Gallery Reward",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"market"
   },
   {
      "Id":"58",
      "Label":"Market Bombchu Bowling First Prize",
      "Requirements":function ()
		{
			return obtainedItems.bomb;
		},
      "Tags":[
         
      ],
      "Location":"market"
   },
   {
      "Id":"59",
      "Label":"Market Bombchu Bowling Second Prize",
      "Requirements":function ()
		{
			return obtainedItems.bomb;
		},
      "Tags":[
         
      ],
      "Location":"market"
   },
   {
      "Id":"60",
      "Label":"Market Lost Dog",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"market"
   },
   {
      "Id":"61",
      "Label":"Market Treasure Chest Game Reward",
      "Requirements":function ()
		{
			return obtainedItems.lens;
},
      "Tags":[
         
      ],
      "Location":"market"
   },
   {
      "Id":"62",
      "Label":"Market 10 Big Poes",
      "Requirements":function ()
		{
			return haveEmptyBottle();
		},
      "Tags":[
         
      ],
      "Location":"market"
   },
   {
      "Id":"63",
      "Label":"Market GS Guard House",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "gs"
      ],
      "Location":"market"
   },
   {
      "Id":"64",
      "Label":"Market Bazaar Item 1",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"market"
   },
   {
      "Id":"65",
      "Label":"Market Bazaar Item 2",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"market"
   },
   {
      "Id":"66",
      "Label":"Market Bazaar Item 3",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"market"
   },
   {
      "Id":"67",
      "Label":"Market Bazaar Item 4",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"market"
   },
   {
      "Id":"68",
      "Label":"Market Potion Shop Item 1",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"market"
   },
   {
      "Id":"69",
      "Label":"Market Potion Shop Item 2",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"market"
   },
   {
      "Id":"70",
      "Label":"Market Potion Shop Item 3",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"market"
   },
   {
      "Id":"71",
      "Label":"Market Potion Shop Item 4",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"market"
   },
   {
      "Id":"72",
      "Label":"Market Bombchu Shop Item 1",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"market"
   },
   {
      "Id":"73",
      "Label":"Market Bombchu Shop Item 2",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"market"
   },
   {
      "Id":"74",
      "Label":"Market Bombchu Shop Item 3",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"market"
   },
   {
      "Id":"75",
      "Label":"Market Bombchu Shop Item 4",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"market"
   },
   {
      "Id":"76",
      "Label":"ToT Light Arrows Cutscene",
      "Requirements":function ()
		{
			return obtainedItems.shadowMedallion && obtainedItems.spiritMedallion;
		},
      "Tags":[
         
      ],
      "Location":"tot"
   },
   {
      "Id":"77",
      "Label":"HC Great Fairy Reward",
      "Requirements":function ()
		{
			return obtainedItems.lullaby;
		},
      "Tags":[
         
      ],
      "Location":"market"
   },
   {
      "Id":"78",
      "Label":"HC GS Tree",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "gs"
      ],
      "Location":"market"
   },
   {
      "Id":"79",
      "Label":"HC GS Storms Grotto",
      "Requirements":function ()
		{
			return obtainedItems.storm && obtainedItems.boomerang;
		},
      "Tags":[
         "gs"
      ],
      "Location":"market"
   },
   {
      "Id":"80",
      "Label":"LLR Talons Chickens",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"ranch"
   },
   {
      "Id":"81",
      "Label":"LLR Freestanding PoH",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"ranch"
   },
   {
      "Id":"82",
      "Label":"LLR Deku Scrub Grotto Left",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"ranch"
   },
   {
      "Id":"83",
      "Label":"LLR Deku Scrub Grotto Center",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"ranch"
   },
   {
      "Id":"84",
      "Label":"LLR Deku Scrub Grotto Right",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"ranch"
   },
   {
      "Id":"85",
      "Label":"LLR GS House Window",
      "Requirements":function ()
		{
			return obtainedItems.boomerang
},
      "Tags":[
         "gs"
      ],
      "Location":"ranch"
   },
   {
      "Id":"86",
      "Label":"LLR GS Tree",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "gs"
      ],
      "Location":"ranch"
   },
   {
      "Id":"87",
      "Label":"LLR GS Rain Shed",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "gs"
      ],
      "Location":"ranch"
   },
   {
      "Id":"88",
      "Label":"LLR GS Back Wall",
      "Requirements":function ()
		{
			return obtainedItems.boomerang;
		},
      "Tags":[
         "gs"
      ],
      "Location":"ranch"
   },
   {
      "Id":"89",
      "Label":"Kak Anju as Child",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"90",
      "Label":"Kak Anju as Adult",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"91",
      "Label":"Kak Impas House Freestanding PoH",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"92",
      "Label":"Kak Windmill Freestanding PoH",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"93",
      "Label":"Kak Man on Roof",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"94",
      "Label":"Kak Open Grotto Chest",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"95",
      "Label":"Kak Redead Grotto Chest",
      "Requirements":function ()
		{
			return obtainedItems.bomb;
		},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"96",
      "Label":"Kak Shooting Gallery Reward",
      "Requirements":function ()
		{
			return obtainedItems.bow;
},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"97",
      "Label":"Kak 10 Gold Skulltula Reward",
      "Requirements":function ()
		{
			return false;
		},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"98",
      "Label":"Kak 20 Gold Skulltula Reward",
      "Requirements":function ()
		{
			return false;
		},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"99",
      "Label":"Kak 30 Gold Skulltula Reward",
      "Requirements":function ()
		{
			return false;
		},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"100",
      "Label":"Kak 40 Gold Skulltula Reward",
      "Requirements":function ()
		{
			return false;
		},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"101",
      "Label":"Kak 50 Gold Skulltula Reward",
      "Requirements":function ()
		{
			return false;
		},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"102",
      "Label":"Kak GS Tree",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "gs"
      ],
      "Location":"kak"
   },
   {
      "Id":"103",
      "Label":"Kak GS Guards House",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "gs"
      ],
      "Location":"kak"
   },
   {
      "Id":"104",
      "Label":"Kak GS Watchtower",
      "Requirements":function ()
		{
			return obtainedItems.slingshot && obtainedItems.boomerang;
		},
      "Tags":[
         "gs"
      ],
      "Location":"kak"
   },
   {
      "Id":"105",
      "Label":"Kak GS Skulltula House",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "gs"
      ],
      "Location":"kak"
   },
   {
      "Id":"106",
      "Label":"Kak GS House Under Construction",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "gs"
      ],
      "Location":"kak"
   },
   {
      "Id":"107",
      "Label":"Kak GS Above Impas House",
      "Requirements":function ()
		{
			return obtainedItems.hookshot;
		},
      "Tags":[
         "gs"
      ],
      "Location":"kak"
   },
   {
      "Id":"108",
      "Label":"Kak Bazaar Item 1",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"kak"
   },
   {
      "Id":"109",
      "Label":"Kak Bazaar Item 2",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"kak"
   },
   {
      "Id":"110",
      "Label":"Kak Bazaar Item 3",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"kak"
   },
   {
      "Id":"111",
      "Label":"Kak Bazaar Item 4",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"kak"
   },
   {
      "Id":"112",
      "Label":"Kak Potion Shop Item 1",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"kak"
   },
   {
      "Id":"113",
      "Label":"Kak Potion Shop Item 2",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"kak"
   },
   {
      "Id":"114",
      "Label":"Kak Potion Shop Item 3",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"kak"
   },
   {
      "Id":"115",
      "Label":"Kak Potion Shop Item 4",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "shop"
      ],
      "Location":"kak"
   },
   {
      "Id":"116",
      "Label":"Graveyard Shield Grave Chest",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"117",
      "Label":"Graveyard Heart Piece Grave Chest",
      "Requirements":function ()
		{
			return obtainedItems.sun;
		},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"118",
      "Label":"Graveyard Royal Familys Tomb Chest",
      "Requirements":function ()
		{
			return obtainedItems.lullaby && obtainedItems.magic && (obtainedItems.fireArrow || obtainedItems.dins);
		},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"119",
      "Label":"Graveyard Freestanding PoH",
      "Requirements":function ()
		{
			return obtainedItems.hookshot === 2 || obtainedItems.bean;
		},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"120",
      "Label":"Graveyard Dampe Gravedigging Tour",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"121",
      "Label":"Graveyard Hookshot Chest",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"122",
      "Label":"Graveyard Dampe Race Freestanding PoH",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"kak"
   },
   {
      "Id":"123",
      "Label":"Graveyard GS Bean Patch",
      "Requirements":function ()
		{
			return haveEmptyBottle();
		},
      "Tags":[
         "gs"
      ],
      "Location":"kak"
   },
   {
      "Id":"124",
      "Label":"Graveyard GS Wall",
      "Requirements":function ()
		{
			return obtainedItems.boomerang;
		},
      "Tags":[
         "gs"
      ],
      "Location":"kak"
   },
   {
      "Id":"125",
      "Label":"DMT Freestanding PoH",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"dmt"
   },
   {
      "Id":"126",
      "Label":"DMT Chest",
      "Requirements":function ()
		{
			return obtainedItems.bomb;
		},
      "Tags":[
         
      ],
      "Location":"dmt"
   },
   {
      "Id":"127",
      "Label":"DMT Storms Grotto Chest",
      "Requirements":function ()
		{
			return obtainedItems.storm;
		},
      "Tags":[
         
      ],
      "Location":"dmt"
   },
   {
      "Id":"128",
      "Label":"DMT Great Fairy Reward",
      "Requirements":function ()
		{
			return obtainedItems.lullaby && (obtainedItems.bomb || obtainedItems.hammer);
		},
      "Tags":[
         
      ],
      "Location":"dmt"
   },
   {
      "Id":"129",
      "Label":"DMT Biggoron",
      "Requirements":function ()
		{
			return obtainedItems.claim;
		},
      "Tags":[
         
      ],
      "Location":"dmt"
   },
   {
      "Id":"130",
      "Label":"DMT GS Near Kak",
      "Requirements":function ()
		{
			return obtainedItems.bomb || obtainedItems.hammer;
		},
      "Tags":[
         "gs"
      ],
      "Location":"dmt"
   },
   {
      "Id":"131",
      "Label":"DMT GS Bean Patch",
      "Requirements":function ()
		{
			return haveEmptyBottle() && (obtainedItems.bomb || obtainedItems.strength);
		},
      "Tags":[
         "gs"
      ],
      "Location":"dmt"
   },
   {
      "Id":"132",
      "Label":"DMT GS Above Dodongos Cavern",
      "Requirements":function ()
		{
			return obtainedItems.hammer;
		},
      "Tags":[
         "gs"
      ],
      "Location":"dmt"
   },
   {
      "Id":"133",
      "Label":"DMT GS Falling Rocks Path",
      "Requirements":function ()
		{
			return obtainedItems.hammer;
		},
      "Tags":[
         "gs"
      ],
      "Location":"dmt"
   },
   {
      "Id":"134",
      "Label":"GC Darunias Joy",
      "Requirements":function ()
		{
			return obtainedItems.saria && obtainedItems.lullaby;
		},
      "Tags":[
         
      ],
      "Location":"goron"
   },
   {
      "Id":"135",
      "Label":"GC Pot Freestanding PoH",
      "Requirements":function ()
		{
			return obtainedItems.bomb && obtainedItems.lullaby;
		},
      "Tags":[
         
      ],
      "Location":"goron"
   },
   {
      "Id":"136",
      "Label":"GC Rolling Goron as Child",
      "Requirements":function ()
		{
			return obtainedItems.bomb;
		},
      "Tags":[
         
      ],
      "Location":"goron"
   },
   {
      "Id":"137",
      "Label":"GC Rolling Goron as Adult",
      "Requirements":function ()
		{
			return obtainedItems.bomb || obtainedItems.bow;
		},
      "Tags":[
         
      ],
      "Location":"goron"
   },
   {
      "Id":"138",
      "Label":"GC Maze Left Chest",
      "Requirements":function ()
		{
			return obtainedItems.hammer;
		},
      "Tags":[
         
      ],
      "Location":"goron"
   },
   {
      "Id":"139",
      "Label":"GC Maze Right Chest",
      "Requirements":function ()
		{
			return obtainedItems.hammer || obtainedItems.bomb;
},
      "Tags":[
         
      ],
      "Location":"goron"
   },
   {
      "Id":"140",
      "Label":"GC Maze Center Chest",
      "Requirements":function ()
		{
			return obtainedItems.hammer || obtainedItems.bomb;
		},
      "Tags":[
         
      ],
      "Location":"goron"
   },
   {
      "Id":"141",
      "Label":"GC Deku Scrub Grotto Left",
      "Requirements":function ()
		{
			return obtainedItems.time && obtainedItems.hookshot;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"goron"
   },
   {
      "Id":"142",
      "Label":"GC Deku Scrub Grotto Center",
      "Requirements":function ()
		{
			return obtainedItems.time && obtainedItems.hookshot;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"goron"
   },
   {
      "Id":"143",
      "Label":"GC Deku Scrub Grotto Right",
      "Requirements":function ()
		{
			return obtainedItems.time && obtainedItems.hookshot;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"goron"
   },
   {
      "Id":"144",
      "Label":"GC GS Center Platform",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "gs"
      ],
      "Location":"goron"
   },
   {
      "Id":"145",
      "Label":"GC GS Boulder Maze",
      "Requirements":function ()
		{
			return obtainedItems.hammer || obtainedItems.bomb;
		},
      "Tags":[
         "gs"
      ],
      "Location":"goron"
   },
   {
      "Id":"146",
      "Label":"GC Shop Item 1",
      "Requirements":function ()
		{
			return obtainedItems.bomb || obtainedItems.lullaby;
		},
      "Tags":[
         "shop"
      ],
      "Location":"goron"
   },
   {
      "Id":"147",
      "Label":"GC Shop Item 2",
      "Requirements":function ()
		{
			return obtainedItems.bomb || obtainedItems.lullaby;
		},
      "Tags":[
         "shop"
      ],
      "Location":"goron"
   },
   {
      "Id":"148",
      "Label":"GC Shop Item 3",
      "Requirements":function ()
		{
			return obtainedItems.bomb || obtainedItems.lullaby;
		},
      "Tags":[
         "shop"
      ],
      "Location":"goron"
   },
   {
      "Id":"149",
      "Label":"GC Shop Item 4",
      "Requirements":function ()
		{
			return obtainedItems.bomb || obtainedItems.lullaby;
		},
      "Tags":[
         "shop"
      ],
      "Location":"goron"
   },
   {
      "Id":"150",
      "Label":"DMC Volcano Freestanding PoH",
      "Requirements":function ()
		{
			return obtainedItems.hover || obtainedItems.bean;
		},
      "Tags":[
         
      ],
      "Location":"crater"
   },
   {
      "Id":"151",
      "Label":"DMC Wall Freestanding PoH",
      "Requirements":function ()
		{
			return obtainedItems.hammer || obtainedItems.bomb;
		},
      "Tags":[
         
      ],
      "Location":"crater"
   },
   {
      "Id":"152",
      "Label":"DMC Upper Grotto Chest",
      "Requirements":function ()
		{
			return obtainedItems.hammer || obtainedItems.bomb;
		},
      "Tags":[
         
      ],
      "Location":"crater"
   },
   {
      "Id":"153",
      "Label":"DMC Great Fairy Reward",
      "Requirements":function ()
		{
			return obtainedItems.hammer && obtainedItems.lullaby;
		},
      "Tags":[
         
      ],
      "Location":"crater"
   },
   {
      "Id":"154",
      "Label":"DMC Deku Scrub",
      "Requirements":function ()
		{
			return HaveRequiredItem("158");
		},
      "Tags":[
         "scrub"
      ],
      "Location":"crater"
   },
   {
      "Id":"155",
      "Label":"DMC Deku Scrub Grotto Left",
      "Requirements":function ()
		{
			return obtainedItems.hammer;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"crater"
   },
   {
      "Id":"156",
      "Label":"DMC Deku Scrub Grotto Center",
      "Requirements":function ()
		{
			return obtainedItems.hammer;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"crater"
   },
   {
      "Id":"157",
      "Label":"DMC Deku Scrub Grotto Right",
      "Requirements":function ()
		{
			return obtainedItems.hammer;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"crater"
   },
   {
      "Id":"158",
      "Label":"DMC GS Crate",
      "Requirements":function ()
		{
			return obtainedItems.bomb;
		},
      "Tags":[
         "gs"
      ],
      "Location":"crater"
   },
   {
      "Id":"159",
      "Label":"DMC GS Bean Patch",
      "Requirements":function ()
		{
			return obtainedItems.bolero && haveEmptyBottle();
		},
      "Tags":[
         "gs"
      ],
      "Location":"crater"
   },
   {
      "Id":"160",
      "Label":"ZR Magic Bean Salesman",
      "Requirements":function ()
		{
			return accessRiver();
		},
      "Tags":[
         
      ],
      "Location":"river"
   },
   {
      "Id":"161",
      "Label":"ZR Open Grotto Chest",
      "Requirements":function ()
		{
			return accessRiver();
		},
      "Tags":[
         
      ],
      "Location":"river"
   },
   {
      "Id":"162",
      "Label":"ZR Frogs in the Rain",
      "Requirements":function ()
		{
			return accessRiver();
		},
      "Tags":[
         
      ],
      "Location":"river"
   },
   {
      "Id":"163",
      "Label":"ZR Frogs Ocarina Game",
      "Requirements":function ()
		{
			return accessRiver();
		},
      "Tags":[
         
      ],
      "Location":"river"
   },
   {
      "Id":"164",
      "Label":"ZR Near Open Grotto Freestanding PoH",
      "Requirements":function ()
		{
			return accessRiver();
		},
      "Tags":[
         
      ],
      "Location":"river"
   },
   {
      "Id":"165",
      "Label":"ZR Near Domain Freestanding PoH",
      "Requirements":function ()
		{
			return accessRiver();
		},
      "Tags":[
         
      ],
      "Location":"river"
   },
   {
      "Id":"166",
      "Label":"ZR Deku Scrub Grotto Front",
      "Requirements":function ()
		{
			return accessRiver() && obtainedItems.storm;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"river"
   },
   {
      "Id":"167",
      "Label":"ZR Deku Scrub Grotto Rear",
      "Requirements":function ()
		{
			return accessRiver() && obtainedItems.storm;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"river"
   },
   {
      "Id":"168",
      "Label":"ZR GS Tree",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "gs"
      ],
      "Location":"river"
   },
   {
      "Id":"169",
      "Label":"ZR GS Ladder",
      "Requirements":function ()
		{
			return accessRiver();
},
      "Tags":[
         "gs"
      ],
      "Location":"river"
   },
   {
      "Id":"170",
      "Label":"ZR GS Near Raised Grottos",
      "Requirements":function ()
		{
			return accessRiver() && obtainedItems.hookshot;
		},
      "Tags":[
         "gs"
      ],
      "Location":"river"
   },
   {
      "Id":"171",
      "Label":"ZR GS Above Bridge",
      "Requirements":function ()
		{
			return accessRiver() && obtainedItems.hookshot;
		},
      "Tags":[
         "gs"
      ],
      "Location":"river"
   },
   {
      "Id":"172",
      "Label":"ZD Diving Minigame",
      "Requirements":function ()
		{
			return accessDomain();
		},
      "Tags":[
         
      ],
      "Location":"domain"
   },
   {
      "Id":"173",
      "Label":"ZD Chest",
      "Requirements":function ()
		{
			return accessDomain();
		},
      "Tags":[
         
      ],
      "Location":"domain"
   },
   {
      "Id":"174",
      "Label":"ZD King Zora Thawed",
      "Requirements":function ()
		{
			return accessDomain() && haveEmptyBottle();
		},
      "Tags":[
         
      ],
      "Location":"domain"
   },
   {
      "Id":"175",
      "Label":"ZD GS Frozen Waterfall",
      "Requirements":function ()
		{
			return accessDomain() && obtainedItems.hookshot;
		},
      "Tags":[
         "gs"
      ],
      "Location":"domain"
   },
   {
      "Id":"176",
      "Label":"ZD Shop Item 1",
      "Requirements":function ()
		{
			return accessDomain();
		},
      "Tags":[
         "shop"
      ],
      "Location":"domain"
   },
   {
      "Id":"177",
      "Label":"ZD Shop Item 2",
      "Requirements":function ()
		{
			return accessDomain();
		},
      "Tags":[
         "shop"
      ],
      "Location":"domain"
   },
   {
      "Id":"178",
      "Label":"ZD Shop Item 3",
      "Requirements":function ()
		{
			return accessDomain();
		},
      "Tags":[
         "shop"
      ],
      "Location":"domain"
   },
   {
      "Id":"179",
      "Label":"ZD Shop Item 4",
      "Requirements":function ()
		{
			return accessDomain();
		},
      "Tags":[
         "shop"
      ],
      "Location":"domain"
   },
   {
      "Id":"180",
      "Label":"ZF Great Fairy Reward",
      "Requirements":function ()
		{
			return accessFontain() && obtainedItems.bomb && obtainedItems.lullaby;
		},
      "Tags":[
         
      ],
      "Location":"fontain"
   },
   {
      "Id":"181",
      "Label":"ZF Iceberg Freestanding PoH",
      "Requirements":function ()
		{
			return accessFontain();
		},
      "Tags":[
         
      ],
      "Location":"fontain"
   },
   {
      "Id":"182",
      "Label":"ZF Bottom Freestanding PoH",
      "Requirements":function ()
		{
			return accessFontain() && obtainedItems.iron;
		},
      "Tags":[
         
      ],
      "Location":"fontain"
   },
   {
      "Id":"183",
      "Label":"ZF GS Above the Log",
      "Requirements":function ()
		{
			return accessFontain() && obtainedItems.boomerang;
		},
      "Tags":[
         "gs"
      ],
      "Location":"fontain"
   },
   {
      "Id":"184",
      "Label":"ZF GS Tree",
      "Requirements":function ()
		{
			return accessFontain();
		},
      "Tags":[
         "gs"
      ],
      "Location":"fontain"
   },
   {
      "Id":"185",
      "Label":"ZF GS Hidden Cave",
      "Requirements":function ()
		{
			return accessFontain() && obtainedItems.strength >= 2;
		},
      "Tags":[
         "gs"
      ],
      "Location":"fontain"
   },
   {
      "Id":"186",
      "Label":"LH Underwater Item",
      "Requirements":function ()
		{
			return obtainedItems.scale;
		},
      "Tags":[
         
      ],
      "Location":"lake"
   },
   {
      "Id":"187",
      "Label":"LH Child Fishing",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"lake"
   },
   {
      "Id":"188",
      "Label":"LH Adult Fishing",
      "Requirements":function ()
		{
			return obtainedItems.hookshot;
		},
      "Tags":[
         
      ],
      "Location":"lake"
   },
   {
      "Id":"189",
      "Label":"LH Lab Dive",
      "Requirements":function ()
		{
			return obtainedItems.scale === 2;
		},
      "Tags":[
         
      ],
      "Location":"lake"
   },
   {
      "Id":"190",
      "Label":"LH Freestanding PoH",
      "Requirements":function ()
		{
			return obtainedItems.hookshot || obtainedItems.bean;
		},
      "Tags":[
         
      ],
      "Location":"lake"
   },
   {
      "Id":"191",
      "Label":"LH Sun",
      "Requirements":function ()
		{
			return obtainedItems.bow && checkedList.indexOf("5") > -1;
		},
      "Tags":[
         
      ],
      "Location":"lake"
   },
   {
      "Id":"192",
      "Label":"LH Deku Scrub Grotto Left",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"lake"
   },
   {
      "Id":"193",
      "Label":"LH Deku Scrub Grotto Center",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"lake"
   },
   {
      "Id":"194",
      "Label":"LH Deku Scrub Grotto Right",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"lake"
   },
   {
      "Id":"195",
      "Label":"LH GS Bean Patch",
      "Requirements":function ()
		{
			return haveEmptyBottle();
		},
      "Tags":[
         "gs"
      ],
      "Location":"lake"
   },
   {
      "Id":"196",
      "Label":"LH GS Lab Wall",
      "Requirements":function ()
		{
			return obtainedItems.boomerang;
		},
      "Tags":[
         "gs"
      ],
      "Location":"lake"
   },
   {
      "Id":"197",
      "Label":"LH GS Small Island",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "gs"
      ],
      "Location":"lake"
   },
   {
      "Id":"198",
      "Label":"LH GS Lab Crate",
      "Requirements":function ()
		{
			return obtainedItems.iron && obtainedItems.hookshot;
		},
      "Tags":[
         "gs"
      ],
      "Location":"lake"
   },
   {
      "Id":"199",
      "Label":"LH GS Tree",
      "Requirements":function ()
		{
			return obtainedItems.hookshot === 2;
		},
      "Tags":[
         "gs"
      ],
      "Location":"lake"
   },
   {
      "Id":"200",
      "Label":"GV Crate Freestanding PoH",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"valey"
   },
   {
      "Id":"201",
      "Label":"GV Waterfall Freestanding PoH",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"valey"
   },
   {
      "Id":"202",
      "Label":"GV Chest",
      "Requirements":function ()
		{
			return obtainedItems.hammer && accessGerudoFortress();
		},
      "Tags":[
         
      ],
      "Location":"valey"
   },
   {
      "Id":"203",
      "Label":"GV Deku Scrub Grotto Front",
      "Requirements":function ()
		{
			return accessGerudoFortress() && obtainedItems.storm;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"valey"
   },
   {
      "Id":"204",
      "Label":"GV Deku Scrub Grotto Rear",
      "Requirements":function ()
		{
			return accessGerudoFortress() && obtainedItems.storm;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"valey"
   },
   {
      "Id":"205",
      "Label":"GV GS Small Bridge",
      "Requirements":function ()
		{
			return obtainedItems.boomerang;
		},
      "Tags":[
         "gs"
      ],
      "Location":"valey"
   },
   {
      "Id":"206",
      "Label":"GV GS Bean Patch",
      "Requirements":function ()
		{
			return haveEmptyBottle();
		},
      "Tags":[
         "gs"
      ],
      "Location":"valey"
   },
   {
      "Id":"207",
      "Label":"GV GS Behind Tent",
      "Requirements":function ()
		{
			return accessGerudoFortress() && obtainedItems.hookshot;
		},
      "Tags":[
         "gs"
      ],
      "Location":"valey"
   },
   {
      "Id":"208",
      "Label":"GV GS Pillar",
      "Requirements":function ()
		{
			return accessGerudoFortress() && obtainedItems.hookshot;
		},
      "Tags":[
         "gs"
      ],
      "Location":"valey"
   },
   {
      "Id":"209",
      "Label":"GF Chest",
      "Requirements":function ()
		{
			return accessGerudoFortress() && (obtainedItems.hookshot || obtainedItems.hover);
		},
      "Tags":[
         
      ],
      "Location":"fortress"
   },
   {
      "Id":"210",
      "Label":"GF HBA 1000 Points",
      "Requirements":function ()
		{
			return accessGerudoFortress() && obtainedItems.epona && obtainedItems.gerudoCard;
		},
      "Tags":[
         
      ],
      "Location":"fortress"
   },
   {
      "Id":"211",
      "Label":"GF HBA 1500 Points",
      "Requirements":function ()
		{
			return accessGerudoFortress() && obtainedItems.epona && obtainedItems.gerudoCard;
		},
      "Tags":[
         
      ],
      "Location":"fortress"
   },
   {
      "Id":"212",
      "Label":"GF GS Top Floor",
      "Requirements":function ()
		{
			return accessGerudoFortress() && obtainedItems.hookshot;
		},
      "Tags":[
         "gs"
      ],
      "Location":"fortress"
   },
   {
      "Id":"213",
      "Label":"GF GS Archery Range",
      "Requirements":function ()
		{
			return accessGerudoFortress() && obtainedItems.gerudoCard;
		},
      "Tags":[
         "gs"
      ],
      "Location":"fortress"
   },
   {
      "Id":"214",
      "Label":"Wasteland Chest",
      "Requirements":function ()
		{
			return accessWasteland() && (obtainedItems.hover || obtainedItems.hookshot === 2);
		},
      "Tags":[
         
      ],
      "Location":"wasteland"
   },
   {
      "Id":"215",
      "Label":"Wasteland GS",
      "Requirements":function ()
		{
			return HaveRequiredItem("214") && obtainedItems.magic && (obtainedItems.dins || obtainedItems.fireArrow);
		},
      "Tags":[
         "gs"
      ],
      "Location":"wasteland"
   },
   {
      "Id":"216",
      "Label":"Colossus Great Fairy Reward",
      "Requirements":function ()
		{
			return accessColossus() && obtainedItems.lullaby && obtainedItems.bomb;
		},
      "Tags":[
         
      ],
      "Location":"colossus"
   },
   {
      "Id":"217",
      "Label":"Colossus Freestanding PoH",
      "Requirements":function ()
		{
			return accessColossus() && obtainedItems.bean;
		},
      "Tags":[
         
      ],
      "Location":"colossus"
   },
   {
      "Id":"218",
      "Label":"Colossus Deku Scrub Grotto Front",
      "Requirements":function ()
		{
			return accessColossus() && obtainedItems.strength >= 2;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"colossus"
   },
   {
      "Id":"219",
      "Label":"Colossus Deku Scrub Grotto Rear",
      "Requirements":function ()
		{
			return accessColossus() && obtainedItems.strength >= 2;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"colossus"
   },
   {
      "Id":"220",
      "Label":"Colossus GS Bean Patch",
      "Requirements":function ()
		{
			return accessColossus() && haveEmptyBottle();
		},
      "Tags":[
         "gs"
      ],
      "Location":"colossus"
   },
   {
      "Id":"221",
      "Label":"Colossus GS Tree",
      "Requirements":function ()
		{
			return accessColossus() && obtainedItems.hookshot;
		},
      "Tags":[
         "gs"
      ],
      "Location":"colossus"
   },
   {
      "Id":"222",
      "Label":"Colossus GS Hill",
      "Requirements":function ()
		{
			return accessColossus() && (obtainedItems.hookshot || obtainedItems.bean);
		},
      "Tags":[
         "gs"
      ],
      "Location":"colossus"
   },
   {
      "Id":"223",
      "Label":"OGC Great Fairy Reward",
      "Requirements":function ()
		{
			return obtainedItems.strength ===3 && obtainedItems.lullaby;
		},
      "Tags":[
         
      ],
      "Location":"outside"
   },
   {
      "Id":"224",
      "Label":"OGC GS",
      "Requirements":function ()
		{
			return obtainedItems.hookshot;
		},
      "Tags":[
         "gs"
      ],
      "Location":"outside"
   },
   {
      "Id":"225",
      "Label":"Deku Tree Map Chest",
      "Requirements":function ()
		{
			return accessDeku();
		},
      "Tags":[
         
      ],
      "Location":"deku"
   },
   {
      "Id":"226",
      "Label":"Deku Tree Slingshot Room Side Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("225");
		},
      "Tags":[
         
      ],
      "Location":"deku"
   },
   {
      "Id":"227",
      "Label":"Deku Tree Slingshot Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("225");
		},
      "Tags":[
         
      ],
      "Location":"deku"
   },
   {
      "Id":"228",
      "Label":"Deku Tree Compass Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("225");
		},
      "Tags":[
         
      ],
      "Location":"deku"
   },
   {
      "Id":"229",
      "Label":"Deku Tree Compass Room Side Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("225");
		},
      "Tags":[
         
      ],
      "Location":"deku"
   },
   {
      "Id":"230",
      "Label":"Deku Tree Basement Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("225");
		},
      "Tags":[
         
      ],
      "Location":"deku"
   },
   {
      "Id":"231",
      "Label":"Deku Tree GS Compass Room",
      "Requirements":function ()
		{
			return HaveRequiredItem("225");
		},
      "Tags":[
         "gs"
      ],
      "Location":"deku"
   },
   {
      "Id":"232",
      "Label":"Deku Tree GS Basement Vines",
      "Requirements":function ()
		{
			return HaveRequiredItem("225") && obtainedItems.slingshot || obtainedItems.boomerang;
		},
      "Tags":[
         "gs"
      ],
      "Location":"deku"
   },
   {
      "Id":"233",
      "Label":"Deku Tree GS Basement Gate",
      "Requirements":function ()
		{
			return HaveRequiredItem("225");
		},
      "Tags":[
         "gs"
      ],
      "Location":"deku"
   },
   {
      "Id":"234",
      "Label":"Deku Tree GS Basement Back Room",
      "Requirements":function ()
		{
			return HaveRequiredItem("225") && obtainedItems.slingshot && obtainedItems.bomb;
		},
      "Tags":[
         "gs"
      ],
      "Location":"deku"
   },
   {
      "Id":"235",
      "Label":"Deku Tree Queen Gohma Heart",
      "Requirements":function ()
		{
			return HaveRequiredItem("225") && obtainedItems.slingshot;
		},
      "Tags":[
         
      ],
      "Location":"deku"
   },
   {
      "Id":"236",
      "Label":"Dodongos Cavern Map Chest",
      "Requirements":function ()
		{
			return accessDc() && obtainedItems.bomb || obtainedItems.strength || obtainedItems.hammer;
		},
      "Tags":[
         
      ],
      "Location":"dc"
   },
   {
      "Id":"237",
      "Label":"Dodongos Cavern Compass Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("236");
		},
      "Tags":[
         
      ],
      "Location":"dc"
   },
   {
      "Id":"238",
      "Label":"Dodongos Cavern bomb Flower Platform Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("237");
		},
      "Tags":[
         
      ],
      "Location":"dc"
   },
   {
      "Id":"239",
      "Label":"Dodongos Cavern bomb Bag Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("237");
		},
      "Tags":[
         
      ],
      "Location":"dc"
   },
   {
      "Id":"240",
      "Label":"Dodongos Cavern End of Bridge Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("237");
},
      "Tags":[
         
      ],
      "Location":"dc"
   },
   {
      "Id":"241",
      "Label":"Dodongos Cavern Deku Scrub Side Room Near Dodongos",
      "Requirements":function ()
		{
			return HaveRequiredItem("237");
		},
      "Tags":[
         "scrub"
      ],
      "Location":"dc"
   },
   {
      "Id":"242",
      "Label":"Dodongos Cavern Deku Scrub Lobby",
      "Requirements":function ()
		{
			return HaveRequiredItem("237");
		},
      "Tags":[
         "scrub"
      ],
      "Location":"dc"
   },
   {
      "Id":"243",
      "Label":"Dodongos Cavern Deku Scrub Near bomb Bag Left",
      "Requirements":function ()
		{
			return HaveRequiredItem("237");
		},
      "Tags":[
         "scrub"
      ],
      "Location":"dc"
   },
   {
      "Id":"244",
      "Label":"Dodongos Cavern Deku Scrub Near bomb Bag Right",
      "Requirements":function ()
		{
			return HaveRequiredItem("237");
		},
      "Tags":[
         "scrub"
      ],
      "Location":"dc"
   },
   {
      "Id":"245",
      "Label":"Dodongos Cavern GS Side Room Near Lower Lizalfos",
      "Requirements":function ()
		{
			return HaveRequiredItem("237") && (obtainedItems.hookshot || obtainedItems.boomerang);
		},
      "Tags":[
         "gs"
      ],
      "Location":"dc"
   },
   {
      "Id":"246",
      "Label":"Dodongos Cavern GS Scarecrow",
      "Requirements":function ()
		{
			return HaveRequiredItem("237") && obtainedItems.hookshot;
		},
      "Tags":[
         "gs"
      ],
      "Location":"dc"
   },
   {
      "Id":"247",
      "Label":"Dodongos Cavern GS Alcove Above Stairs",
      "Requirements":function ()
		{
			return HaveRequiredItem("237");
		},
      "Tags":[
         "gs"
      ],
      "Location":"dc"
   },
   {
      "Id":"248",
      "Label":"Dodongos Cavern GS Vines Above Stairs",
      "Requirements":function ()
		{
			return HaveRequiredItem("237");
		},
      "Tags":[
         "gs"
      ],
      "Location":"dc"
   },
   {
      "Id":"249",
      "Label":"Dodongos Cavern GS Back Room",
      "Requirements":function ()
		{
			return HaveRequiredItem("237") && obtainedItems.bomb;
		},
      "Tags":[
         "gs"
      ],
      "Location":"dc"
   },
   {
      "Id":"250",
      "Label":"Dodongos Cavern Boss Room Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("249");
		},
      "Tags":[
         
      ],
      "Location":"dc"
   },
   {
      "Id":"251",
      "Label":"Dodongos Cavern King Dodongo Heart",
      "Requirements":function ()
		{
			return HaveRequiredItem("249");
		},
      "Tags":[
         
      ],
      "Location":"dc"
   },
   {
      "Id":"252",
      "Label":"Jabu Jabus Belly boomerang Chest",
      "Requirements":function ()
		{
			return accessJabu();
		},
      "Tags":[
         
      ],
      "Location":"jabu"
   },
   {
      "Id":"253",
      "Label":"Jabu Jabus Belly Map Chest",
      "Requirements":function ()
		{
			return accessJabu() && obtainedItems.boomerang;
		},
      "Tags":[
         
      ],
      "Location":"jabu"
   },
   {
      "Id":"254",
      "Label":"Jabu Jabus Belly Compass Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("253");
		},
      "Tags":[
         
      ],
      "Location":"jabu"
   },
   {
      "Id":"255",
      "Label":"Jabu Jabus Belly Deku Scrub",
      "Requirements":function ()
		{
			return HaveRequiredItem("253");
		},
      "Tags":[
         "scrub"
      ],
      "Location":"jabu"
   },
   {
      "Id":"256",
      "Label":"Jabu Jabus Belly GS Water Switch Room",
      "Requirements":function ()
		{
			return HaveRequiredItem("253");
		},
      "Tags":[
         "gs"
      ],
      "Location":"jabu"
   },
   {
      "Id":"257",
      "Label":"Jabu Jabus Belly GS Lobby Basement Lower",
      "Requirements":function ()
		{
			return HaveRequiredItem("253");
		},
      "Tags":[
         "gs"
      ],
      "Location":"jabu"
   },
   {
      "Id":"258",
      "Label":"Jabu Jabus Belly GS Lobby Basement Upper",
      "Requirements":function ()
		{
			return HaveRequiredItem("253");
		},
      "Tags":[
         "gs"
      ],
      "Location":"jabu"
   },
   {
      "Id":"259",
      "Label":"Jabu Jabus Belly GS Near Boss",
      "Requirements":function ()
		{
			return HaveRequiredItem("253");
		},
      "Tags":[
         "gs"
      ],
      "Location":"jabu"
   },
   {
      "Id":"260",
      "Label":"Jabu Jabus Belly Barinade Heart",
      "Requirements":function ()
		{
			return HaveRequiredItem("253");
		},
      "Tags":[
         
      ],
      "Location":"jabu"
   },
   {
      "Id":"261",
      "Label":"Bottom of the Well Front Left Fake Wall Chest",
      "Requirements":function ()
		{
			return accessBotw();
		},
      "Tags":[
         
      ],
      "Location":"botw"
   },
   {
      "Id":"262",
      "Label":"Bottom of the Well Front Center Bombable Chest",
      "Requirements":function ()
		{
			return accessBotw() && obtainedItems.bomb;
		},
      "Tags":[
         
      ],
      "Location":"botw"
   },
   {
      "Id":"263",
      "Label":"Bottom of the Well Back Left Bombable Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("262");
		},
      "Tags":[
         
      ],
      "Location":"botw"
   },
   {
      "Id":"264",
      "Label":"Bottom of the Well Underwater Left Chest",
      "Requirements":function ()
		{
			return accessBotw() && obtainedItems.lullaby;
		},
      "Tags":[
         
      ],
      "Location":"botw"
   },
   {
      "Id":"265",
      "Label":"Bottom of the Well Freestanding Key",
      "Requirements":function ()
		{
			return accessBotw();
},
      "Tags":[
         
      ],
      "Location":"botw"
   },
   {
      "Id":"266",
      "Label":"Bottom of the Well Compass Chest",
      "Requirements":function ()
		{
			return accessBotw();
		},
      "Tags":[
         
      ],
      "Location":"botw"
   },
   {
      "Id":"267",
      "Label":"Bottom of the Well Center Skulltula Chest",
      "Requirements":function ()
		{
			return accessBotw();
		},
      "Tags":[
         
      ],
      "Location":"botw"
   },
   {
      "Id":"268",
      "Label":"Bottom of the Well Right Bottom Fake Wall Chest",
      "Requirements":function ()
		{
			return accessBotw();
		},
      "Tags":[
         
      ],
      "Location":"botw"
   },
   {
      "Id":"269",
      "Label":"Bottom of the Well Fire Keese Chest",
      "Requirements":function ()
		{
			return accessBotw();
		},
      "Tags":[
         
      ],
      "Location":"botw"
   },
   {
      "Id":"270",
      "Label":"Bottom of the Well Like Like Chest",
      "Requirements":function ()
		{
			return accessBotw() && obtainedItems.skBotw;
		},
      "Tags":[
         
      ],
      "Location":"botw"
   },
   {
      "Id":"271",
      "Label":"Bottom of the Well Map Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("262");
		},
      "Tags":[
         
      ],
      "Location":"botw"
   },
   {
      "Id":"272",
      "Label":"Bottom of the Well Underwater Front Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("264");
		},
      "Tags":[
         
      ],
      "Location":"botw"
   },
   {
      "Id":"273",
      "Label":"Bottom of the Well Invisible Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("264");
		},
      "Tags":[
         
      ],
      "Location":"botw"
   },
   {
      "Id":"274",
      "Label":"Bottom of the Well Lens of Truth Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("264");
		},
      "Tags":[
         
      ],
      "Location":"botw"
   },
   {
      "Id":"275",
      "Label":"Bottom of the Well GS West Inner Room",
      "Requirements":function ()
		{
			return accessBotw() && obtainedItems.skBotw;
		},
      "Tags":[
         "gs"
      ],
      "Location":"botw"
   },
   {
      "Id":"276",
      "Label":"Bottom of the Well GS East Inner Room",
      "Requirements":function ()
		{
			return accessBotw() && obtainedItems.skBotw;
		},
      "Tags":[
         "gs"
      ],
      "Location":"botw"
   },
   {
      "Id":"277",
      "Label":"Bottom of the Well GS Like Like Cage",
      "Requirements":function ()
		{
			return accessBotw() && obtainedItems.skBotw;
		},
      "Tags":[
         "gs"
      ],
      "Location":"botw"
   },
   {
      "Id":"278",
      "Label":"Forest Temple First Room Chest",
      "Requirements":function ()
		{
			return accessForestTemple()
		},
      "Tags":[
         
      ],
      "Location":"forest"
   },
   {
      "Id":"279",
      "Label":"Forest Temple First Stalfos Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("278");
		},
      "Tags":[
         
      ],
      "Location":"forest"
   },
   {
      "Id":"280",
      "Label":"Forest Temple Raised Island Courtyard Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("278") && (obtainedItems.bow || obtainedItems.hover || obtainedItems.time);
		},
      "Tags":[
         
      ],
      "Location":"forest"
   },
   {
      "Id":"281",
      "Label":"Forest Temple Map Chest",
      "Requirements":function ()
		{
			return (HaveRequiredItem("280") && obtainedItems.hover) || HaveRequiredItem("285");
		},
      "Tags":[
         
      ],
      "Location":"forest"
   },
   {
      "Id":"282",
      "Label":"Forest Temple Well Chest",
      "Requirements":function ()
		{
			return (HaveRequiredItem("280") && obtainedItems.iron) || HaveRequiredItem("281");
		},
      "Tags":[
         
      ],
      "Location":"forest"
   },
   {
      "Id":"283",
      "Label":"Forest Temple Eye Switch Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("278") && obtainedItems.skForest && obtainedItems.bow && obtainedItems.strength;
		},
      "Tags":[
         
      ],
      "Location":"forest"
   },
   {
      "Id":"284",
      "Label":"Forest Temple Boss Key Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("278") && obtainedItems.skForest >= 2 && obtainedItems.bow && obtainedItems.strength;
		},
      "Tags":[
         
      ],
      "Location":"forest"
   },
   {
      "Id":"285",
      "Label":"Forest Temple Floormaster Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("284");
		},
      "Tags":[
         
      ],
      "Location":"forest"
   },
   {
      "Id":"286",
      "Label":"Forest Temple Red Poe Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("284") && obtainedItems.skForest >= 3;
		},
      "Tags":[
         
      ],
      "Location":"forest"
   },
   {
      "Id":"287",
      "Label":"Forest Temple Bow Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("278") && obtainedItems.skForest >= 3 && obtainedItems.strength;
		},
      "Tags":[
         
      ],
      "Location":"forest"
   },
   {
      "Id":"288",
      "Label":"Forest Temple Blue Poe Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("286");
},
      "Tags":[
         
      ],
      "Location":"forest"
   },
   {
      "Id":"289",
      "Label":"Forest Temple Falling Ceiling Room Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("286") && obtainedItems.skForest >= 5;
		},
      "Tags":[
         
      ],
      "Location":"forest"
   },
   {
      "Id":"290",
      "Label":"Forest Temple Basement Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("289");
		},
      "Tags":[
         
      ],
      "Location":"forest"
   },
   {
      "Id":"291",
      "Label":"Forest Temple GS First Room",
      "Requirements":function ()
		{
			return HaveRequiredItem("278");
		},
      "Tags":[
         "gs"
      ],
      "Location":"forest"
   },
   {
      "Id":"292",
      "Label":"Forest Temple GS Lobby",
      "Requirements":function ()
		{
			return HaveRequiredItem("278");
		},
      "Tags":[
         "gs"
      ],
      "Location":"forest"
   },
   {
      "Id":"293",
      "Label":"Forest Temple GS Raised Island Courtyard",
      "Requirements":function ()
		{
			return HaveRequiredItem("280");
		},
      "Tags":[
         "gs"
      ],
      "Location":"forest"
   },
   {
      "Id":"294",
      "Label":"Forest Temple GS Level Island Courtyard",
      "Requirements":function ()
		{
			return HaveRequiredItem("285");
		},
      "Tags":[
         "gs"
      ],
      "Location":"forest"
   },
   {
      "Id":"295",
      "Label":"Forest Temple GS Basement",
      "Requirements":function ()
		{
			return HaveRequiredItem("289");
		},
      "Tags":[
         "gs"
      ],
      "Location":"forest"
   },
   {
      "Id":"296",
      "Label":"Forest Temple Phantom Ganon Heart",
      "Requirements":function ()
		{
			return HaveRequiredItem("289");
		},
      "Tags":[
         
      ],
      "Location":"forest"
   },
   {
      "Id":"297",
      "Label":"Fire Temple Near Boss Chest",
      "Requirements":function ()
		{
			return accessFireTemple();
		},
      "Tags":[
         
      ],
      "Location":"fire"
   },
   {
      "Id":"298",
      "Label":"Fire Temple Flare Dancer Chest",
      "Requirements":function ()
		{
			return accessFireTemple() && obtainedItems.hammer && obtainedItems.skFire >= 1;
		},
      "Tags":[
         
      ],
      "Location":"fire"
   },
   {
      "Id":"299",
      "Label":"Fire Temple Boss Key Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("298");
		},
      "Tags":[
         
      ],
      "Location":"fire"
   },
   {
      "Id":"300",
      "Label":"Fire Temple Big Lava Room Lower Open Door Chest",
      "Requirements":function ()
		{
			return accessFireTemple() && obtainedItems.skFire >= 1;
		},
      "Tags":[
         
      ],
      "Location":"fire"
   },
   {
      "Id":"301",
      "Label":"Fire Temple Big Lava Room Blocked Door Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("300") && obtainedItems.bomb;
		},
      "Tags":[
         
      ],
      "Location":"fire"
   },
   {
      "Id":"302",
      "Label":"Fire Temple Boulder Maze Lower Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("300") && obtainedItems.skFire >= 3
		},
      "Tags":[
         
      ],
      "Location":"fire"
   },
   {
      "Id":"303",
      "Label":"Fire Temple Boulder Maze Side Room Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("302");
		},
      "Tags":[
         
      ],
      "Location":"fire"
   },
   {
      "Id":"304",
      "Label":"Fire Temple Map Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("302") && obtainedItems.skFire >= 4 && obtainedItems.bow;
		},
      "Tags":[
         
      ],
      "Location":"fire"
   },
   {
      "Id":"305",
      "Label":"Fire Temple Boulder Maze Shortcut Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("302") && obtainedItems.skFire >= 5 &&obtainedItems.bomb;
		},
      "Tags":[
         
      ],
      "Location":"fire"
   },
   {
      "Id":"306",
      "Label":"Fire Temple Boulder Maze Upper Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("302") && obtainedItems.skFire >= 5;
		},
      "Tags":[
         
      ],
      "Location":"fire"
   },
   {
      "Id":"307",
      "Label":"Fire Temple Scarecrow Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("306") && obtainedItems.hookshot;
		},
      "Tags":[
         
      ],
      "Location":"fire"
   },
   {
      "Id":"308",
      "Label":"Fire Temple Compass Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("306") && obtainedItems.skFire >= 6;
		},
      "Tags":[
         
      ],
      "Location":"fire"
   },
   {
      "Id":"309",
      "Label":"Fire Temple Megaton Hammer Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("308");
		},
      "Tags":[
         
      ],
      "Location":"fire"
   },
   {
      "Id":"310",
      "Label":"Fire Temple Highest Goron Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("308") && obtainedItems.time;
		},
      "Tags":[
         
      ],
      "Location":"fire"
   },
   {
      "Id":"311",
      "Label":"Fire Temple GS Boss Key Loop",
      "Requirements":function ()
		{
			return HaveRequiredItem("298");
		},
      "Tags":[
         "gs"
      ],
      "Location":"fire"
   },
   {
      "Id":"312",
      "Label":"Fire Temple GS Song of Time Room",
      "Requirements":function ()
		{
			return HaveRequiredItem("300") && obtainedItems.time;
		},
      "Tags":[
         "gs"
      ],
      "Location":"fire"
   },
   {
      "Id":"313",
      "Label":"Fire Temple GS Boulder Maze",
      "Requirements":function ()
		{
			return HaveRequiredItem("302") && obtainedItems.bomb;
		},
      "Tags":[
         "gs"
      ],
      "Location":"fire"
   },
   {
      "Id":"314",
      "Label":"Fire Temple GS Scarecrow Climb",
      "Requirements":function ()
		{
			return HaveRequiredItem("307");
		},
      "Tags":[
         "gs"
      ],
      "Location":"fire"
   },
   {
      "Id":"315",
      "Label":"Fire Temple GS Scarecrow Top",
      "Requirements":function ()
		{
			return HaveRequiredItem("307");
		},
      "Tags":[
         "gs"
      ],
      "Location":"fire"
   },
   {
      "Id":"316",
      "Label":"Fire Temple Volvagia Heart",
      "Requirements":function ()
		{
			return accessFireTemple() && obtainedItems.hammer && obtainedItems.bkFire && (obtainedItems.hover || obtainedItems.skFire >= 6);
		},
      "Tags":[
         
      ],
      "Location":"fire"
   },
   {
      "Id":"317",
      "Label":"Water Temple Compass Chest",
      "Requirements":function ()
		{
			return accessWaterTemple();
},
      "Tags":[
         
      ],
      "Location":"water"
   },
   {
      "Id":"318",
      "Label":"Water Temple Map Chest",
      "Requirements":function ()
		{
			return accessWaterTemple() && obtainedItems.lullaby;
		},
      "Tags":[
         
      ],
      "Location":"water"
   },
   {
      "Id":"319",
      "Label":"Water Temple Cracked Wall Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("318") && obtainedItems.bomb;
		},
      "Tags":[
         
      ],
      "Location":"water"
   },
   {
      "Id":"320",
      "Label":"Water Temple Torches Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("318") &&  obtainedItems.bow;
		},
      "Tags":[
         
      ],
      "Location":"water"
   },
   {
      "Id":"321",
      "Label":"Water Temple Boss Key Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("318") && obtainedItems.skWater >= 2;
		},
      "Tags":[
         
      ],
      "Location":"water"
   },
   {
      "Id":"322",
      "Label":"Water Temple Central Pillar Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("318") && (obtainedItems.skWater >= 1 || obtainedItems.bow || (obtainedItems.magic && obtainedItems.dins));
		},
      "Tags":[
         
      ],
      "Location":"water"
   },
   {
      "Id":"323",
      "Label":"Water Temple Central Bow Target Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("320") && obtainedItems.hookshot === 2;
},
      "Tags":[
         
      ],
      "Location":"water"
   },
   {
      "Id":"324",
      "Label":"Water Temple Longshot Chest",
      "Requirements":function ()
		{
			return accessWaterTemple() && obtainedItems.skWater >= 2;
		},
      "Tags":[
         
      ],
      "Location":"water"
   },
   {
      "Id":"325",
      "Label":"Water Temple River Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("324") && obtainedItems.time;
		},
      "Tags":[
         
      ],
      "Location":"water"
   },
   {
      "Id":"326",
      "Label":"Water Temple Dragon Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("318");
		},
      "Tags":[
         
      ],
      "Location":"water"
   },
   {
      "Id":"327",
      "Label":"Water Temple GS Behind Gate",
      "Requirements":function ()
		{
			return HaveRequiredItem("318");
		},
      "Tags":[
         "gs"
      ],
      "Location":"water"
   },
   {
      "Id":"328",
      "Label":"Water Temple GS Near Boss Key Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("321");
		},
      "Tags":[
         "gs"
      ],
      "Location":"water"
   },
   {
      "Id":"329",
      "Label":"Water Temple GS Central Pillar",
      "Requirements":function ()
		{
			return HaveRequiredItem("322") && obtainedItems.hookshot === 2;
		},
      "Tags":[
         "gs"
      ],
      "Location":"water"
   },
   {
      "Id":"330",
      "Label":"Water Temple GS Falling Platform Room",
      "Requirements":function ()
		{
			return accessWaterTemple() && obtainedItems.skWater >= 1 && obtainedItems.hookshot === 2;
		},
      "Tags":[
         "gs"
      ],
      "Location":"water"
   },
   {
      "Id":"331",
      "Label":"Water Temple GS River",
      "Requirements":function ()
		{
			return HaveRequiredItem("325");
		},
      "Tags":[
         "gs"
      ],
      "Location":"water"
   },
   {
      "Id":"332",
      "Label":"Water Temple Morpha Heart",
      "Requirements":function ()
		{
			return accessWaterTemple() && obtainedItems.hookshot === 2 && obtainedItems.bkWater;
		},
      "Tags":[
         
      ],
      "Location":"water"
   },
   {
      "Id":"333",
      "Label":"Shadow Temple Map Chest",
      "Requirements":function ()
		{
			return accessShadowTemple();
		},
      "Tags":[
         
      ],
      "Location":"shadow"
   },
   {
      "Id":"334",
      "Label":"Shadow Temple Hover Boots Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("333");
},
      "Tags":[
         
      ],
      "Location":"shadow"
   },
   {
      "Id":"335",
      "Label":"Shadow Temple Compass Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("333") && obtainedItems.hover && obtainedItems.lens;
		},
      "Tags":[
         
      ],
      "Location":"shadow"
   },
   {
      "Id":"336",
      "Label":"Shadow Temple Early Silver Rupee Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("335");
},
      "Tags":[
         
      ],
      "Location":"shadow"
   },
   {
      "Id":"337",
      "Label":"Shadow Temple Invisible Blades Visible Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("335") && obtainedItems.bomb && obtainedItems.skShadow >= 1;
		},
      "Tags":[
         
      ],
      "Location":"shadow"
   },
   {
      "Id":"338",
      "Label":"Shadow Temple Invisible Blades Invisible Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("337");
		},
      "Tags":[
         
      ],
      "Location":"shadow"
   },
   {
      "Id":"339",
      "Label":"Shadow Temple Falling Spikes Lower Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("337");
		},
      "Tags":[
         
      ],
      "Location":"shadow"
   },
   {
      "Id":"340",
      "Label":"Shadow Temple Falling Spikes Upper Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("337");
		},
      "Tags":[
         
      ],
      "Location":"shadow"
   },
   {
      "Id":"341",
      "Label":"Shadow Temple Falling Spikes Switch Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("337");
		},
      "Tags":[
         
      ],
      "Location":"shadow"
   },
   {
      "Id":"342",
      "Label":"Shadow Temple Invisible Spikes Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("337") && obtainedItems.skShadow >= 2;
		},
      "Tags":[
         
      ],
      "Location":"shadow"
   },
   {
      "Id":"343",
      "Label":"Shadow Temple Freestanding Key",
      "Requirements":function ()
		{
			return HaveRequiredItem("342");
		},
      "Tags":[
         
      ],
      "Location":"shadow"
   },
   {
      "Id":"344",
      "Label":"Shadow Temple Wind Hint Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("342") && obtainedItems.skShadow >= 3 && obtainedItems.hookshot;
		},
      "Tags":[
         
      ],
      "Location":"shadow"
   },
   {
      "Id":"345",
      "Label":"Shadow Temple After Wind Enemy Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("344");
		},
      "Tags":[
         
      ],
      "Location":"shadow"
   },
   {
      "Id":"346",
      "Label":"Shadow Temple After Wind Hidden Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("344");
		},
      "Tags":[
         
      ],
      "Location":"shadow"
   },
   {
      "Id":"347",
      "Label":"Shadow Temple Spike Walls Left Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("344") && obtainedItems.skShadow >= 4 && obtainedItems.lullaby;
		},
      "Tags":[
         
      ],
      "Location":"shadow"
   },
   {
      "Id":"348",
      "Label":"Shadow Temple Boss Key Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("347");
		},
      "Tags":[
         
      ],
      "Location":"shadow"
   },
   {
      "Id":"349",
      "Label":"Shadow Temple Invisible Floormaster Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("347");
},
      "Tags":[
         
      ],
      "Location":"shadow"
   },
   {
      "Id":"350",
      "Label":"Shadow Temple GS Like Like Room",
      "Requirements":function ()
		{
			return HaveRequiredItem("335");
		},
      "Tags":[
         "gs"
      ],
      "Location":"shadow"
   },
   {
      "Id":"351",
      "Label":"Shadow Temple GS Falling Spikes Room",
      "Requirements":function ()
		{
			return HaveRequiredItem("339");
		},
      "Tags":[
         "gs"
      ],
      "Location":"shadow"
   },
   {
      "Id":"352",
      "Label":"Shadow Temple GS Single Giant Pot",
      "Requirements":function ()
		{
			return HaveRequiredItem("343");
		},
      "Tags":[
         "gs"
      ],
      "Location":"shadow"
   },
   {
      "Id":"353",
      "Label":"Shadow Temple GS Near Ship",
      "Requirements":function ()
		{
			return HaveRequiredItem("344") && obtainedItems.skShadow >= 4 && obtainedItems.hookshot === 2;
		},
      "Tags":[
         "gs"
      ],
      "Location":"shadow"
   },
   {
      "Id":"354",
      "Label":"Shadow Temple GS Triple Giant Pot",
      "Requirements":function ()
		{
			return HaveRequiredItem("347");
		},
      "Tags":[
         "gs"
      ],
      "Location":"shadow"
   },
   {
      "Id":"355",
      "Label":"Shadow Temple Bongo Bongo Heart",
      "Requirements":function ()
		{
			return HaveRequiredItem("347") && obtainedItems.skShadow >= 4 && obtainedItems.bkShadow;
		},
      "Tags":[
         
      ],
      "Location":"shadow"
   },
   {
      "Id":"356",
      "Label":"Spirit Temple Child Bridge Chest",
      "Requirements":function ()
		{
			return accessSpiritTempleChild() && obtainedItems.boomerang || obtainedItems.slingshot;
		},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"357",
      "Label":"Spirit Temple Child Early Torches Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("356");
		},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"358",
      "Label":"Spirit Temple Child Climb North Chest",
      "Requirements":function ()
		{
			return accessSpiritTempleChild() && obtainedItems.skSpirit >= 1;
		},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"359",
      "Label":"Spirit Temple Child Climb East Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("358");
		},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"360",
      "Label":"Spirit Temple Map Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("358");
},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"361",
      "Label":"Spirit Temple Sun Block Room Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("358");
},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"362",
      "Label":"Spirit Temple Silver Gauntlets Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("358") && obtainedItems.skSpirit >= 2;
		},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"363",
      "Label":"Spirit Temple Compass Chest",
      "Requirements":function ()
		{
			return accessSpiritTempleAdult() && obtainedItems.lullaby;
		},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"364",
      "Label":"Spirit Temple Early Adult Right Chest",
      "Requirements":function ()
		{
			return accessSpiritTempleAdult();
		},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"365",
      "Label":"Spirit Temple First Mirror Left Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("364") && obtainedItems.skSpirit >= 1;
		},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"366",
      "Label":"Spirit Temple First Mirror Right Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("365");
	},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"367",
      "Label":"Spirit Temple Statue Room Northeast Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("365") && obtainedItems.lullaby && obtainedItems.hookshot;
		},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"368",
      "Label":"Spirit Temple Statue Room Hand Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("367");
		},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"369",
      "Label":"Spirit Temple Near Four Armos Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("365") && obtainedItems.skSpirit >= 2 && obtainedItems.mirror;
		},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"370",
      "Label":"Spirit Temple Hallway Right Invisible Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("365") && obtainedItems.skSpirit >= 2;
		},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"371",
      "Label":"Spirit Temple Hallway Left Invisible Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("370");
},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"372",
      "Label":"Spirit Temple Mirror Shield Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("370");
		},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"373",
      "Label":"Spirit Temple Boss Key Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("370") && obtainedItems.skSpirit >= 3 && obtainedItems.hookshot && obtainedItems.bow && obtainedItems.lullaby;
		},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"374",
      "Label":"Spirit Temple Topmost Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("370") && obtainedItems.skSpirit >= 3 && obtainedItems.mirror;
		},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"375",
      "Label":"Spirit Temple GS Metal Fence",
      "Requirements":function ()
		{
			return HaveRequiredItem("356");
		},
      "Tags":[
         "gs"
      ],
      "Location":"spirit"
   },
   {
      "Id":"376",
      "Label":"Spirit Temple GS Sun on Floor Room",
      "Requirements":function ()
		{
			return HaveRequiredItem("358");
		},
      "Tags":[
         "gs"
      ],
      "Location":"spirit"
   },
   {
      "Id":"377",
      "Label":"Spirit Temple GS Hall After Sun Block Room",
      "Requirements":function ()
		{
			return HaveRequiredItem("358");
		},
      "Tags":[
         "gs"
      ],
      "Location":"spirit"
   },
   {
      "Id":"378",
      "Label":"Spirit Temple GS Lobby",
      "Requirements":function ()
		{
			return HaveRequiredItem("365") && obtainedItems.hookshot === 2;
		},
      "Tags":[
         "gs"
      ],
      "Location":"spirit"
   },
   {
      "Id":"379",
      "Label":"Spirit Temple GS Boulder Room",
      "Requirements":function ()
		{
			return accessSpiritTempleAdult() && obtainedItems.time;
		},
      "Tags":[
         "gs"
      ],
      "Location":"spirit"
   },
   {
      "Id":"380",
      "Label":"Spirit Temple Twinrova Heart",
      "Requirements":function ()
		{
			return HaveRequiredItem("374");
		},
      "Tags":[
         
      ],
      "Location":"spirit"
   },
   {
      "Id":"381",
      "Label":"Ice Cavern Map Chest",
      "Requirements":function ()
		{
			return accessFontain() && haveEmptyBottle();
		},
      "Tags":[
         
      ],
      "Location":"ice"
   },
   {
      "Id":"382",
      "Label":"Ice Cavern Compass Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("381");
		},
      "Tags":[
         
      ],
      "Location":"ice"
   },
   {
      "Id":"383",
      "Label":"Ice Cavern Freestanding PoH",
      "Requirements":function ()
		{
			return HaveRequiredItem("381");
		},
      "Tags":[
         
      ],
      "Location":"ice"
   },
   {
      "Id":"384",
      "Label":"Ice Cavern Iron Boots Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("381");
		},
      "Tags":[
         
      ],
      "Location":"ice"
   },
   {
      "Id":"385",
      "Label":"Ice Cavern GS Spinning Scythe Room",
      "Requirements":function ()
		{
			return HaveRequiredItem("381") && obtainedItems.hookshot;
		},
      "Tags":[
         "gs"
      ],
      "Location":"ice"
   },
   {
      "Id":"386",
      "Label":"Ice Cavern GS Heart Piece Room",
      "Requirements":function ()
		{
			return HaveRequiredItem("385");
		},
      "Tags":[
         "gs"
      ],
      "Location":"ice"
   },
   {
      "Id":"387",
      "Label":"Ice Cavern GS Push Block Room",
      "Requirements":function ()
		{
			return HaveRequiredItem("385");
		},
      "Tags":[
         "gs"
      ],
      "Location":"ice"
   },
   {
      "Id":"388",
      "Label":"Gerudo Training Ground Lobby Left Chest",
      "Requirements":function ()
		{
			return accessGtg() && obtainedItems.bow;
},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"389",
      "Label":"Gerudo Training Ground Lobby Right Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("388");
},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"390",
      "Label":"Gerudo Training Ground Stalfos Chest",
      "Requirements":function ()
		{
			return accessGtg();
		},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"391",
      "Label":"Gerudo Training Ground Before Heavy Block Chest",
      "Requirements":function ()
		{
			return accessGtg() && obtainedItems.hookshot;
		},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"392",
      "Label":"Gerudo Training Ground Heavy Block First Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("391") && obtainedItems.strength >= 2;
		},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"393",
      "Label":"Gerudo Training Ground Heavy Block Second Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("392");
		},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"394",
      "Label":"Gerudo Training Ground Heavy Block Third Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("392");
		},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"395",
      "Label":"Gerudo Training Ground Heavy Block Fourth Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("392");
		},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"396",
      "Label":"Gerudo Training Ground Eye Statue Chest",
      "Requirements":function ()
		{
			return obtainedItems.bow && (HaveRequiredItem("391") || HaveRequiredItem("399"));
		},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"397",
      "Label":"Gerudo Training Ground Near Scarecrow Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("396") && obtainedItems.hookshot
		},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"398",
      "Label":"Gerudo Training Ground Hammer Room Clear Chest",
      "Requirements":function ()
		{
			return accessGtg() && (obtainedItems.hookshot === 2 || obtainedItems.hover);
},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"399",
      "Label":"Gerudo Training Ground Hammer Room Switch Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("398") && obtainedItems.hammer;
		},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"400",
      "Label":"Gerudo Training Ground Freestanding Key",
      "Requirements":function ()
		{
			return accessGtg() && obtainedItems.skGtg >= 2
},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"401",
      "Label":"Gerudo Training Ground Maze Right Central Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("400");
},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"402",
      "Label":"Gerudo Training Ground Maze Right Side Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("400");
},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"403",
      "Label":"Gerudo Training Ground Underwater Silver Rupee Chest",
      "Requirements":function ()
		{
			return accessGtg() && obtainedItems.time && obtainedItems.iron && obtainedItems.hover;
		},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"404",
      "Label":"Gerudo Training Ground Beamos Chest",
      "Requirements":function ()
		{
			return accessGtg() && obtainedItems.bomb;
		},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"405",
      "Label":"Gerudo Training Ground Hidden Ceiling Chest",
      "Requirements":function ()
		{
			return accessGtg() && obtainedItems.skGtg >= 1;
		},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"406",
      "Label":"Gerudo Training Ground Maze Path First Chest",
      "Requirements":function ()
		{
			return accessGtg() && obtainedItems.skGtg >= 2
},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"407",
      "Label":"Gerudo Training Ground Maze Path Second Chest",
      "Requirements":function ()
		{
			return accessGtg() && obtainedItems.skGtg >= 4
},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"408",
      "Label":"Gerudo Training Ground Maze Path Third Chest",
      "Requirements":function ()
		{
			return accessGtg() && obtainedItems.skGtg >= 5
},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"409",
      "Label":"Gerudo Training Ground Maze Path Final Chest",
      "Requirements":function ()
		{
			return accessGtg() && obtainedItems.skGtg >= 7
},
      "Tags":[
         
      ],
      "Location":"gtg"
   },
   {
      "Id":"410",
      "Label":"Ganons Castle Forest Trial Chest",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"ganon"
   },
   {
      "Id":"411",
      "Label":"Ganons Castle Water Trial Left Chest",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"ganon"
   },
   {
      "Id":"412",
      "Label":"Ganons Castle Water Trial Right Chest",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"ganon"
   },
   {
      "Id":"413",
      "Label":"Ganons Castle Shadow Trial Front Chest",
      "Requirements":function ()
		{
			return obtainedItems.hookshot;
		},
      "Tags":[
         
      ],
      "Location":"ganon"
   },
   {
      "Id":"414",
      "Label":"Ganons Castle Shadow Trial Golden Gauntlets Chest",
      "Requirements":function ()
		{
			return obtainedItems.hookshot && obtainedItems.fireArrow && obtainedItems.magic;
		},
      "Tags":[
         
      ],
      "Location":"ganon"
   },
   {
      "Id":"415",
      "Label":"Ganons Castle Light Trial First Left Chest",
      "Requirements":function ()
		{
			return obtainedItems.strength === 3;
		},
      "Tags":[
         
      ],
      "Location":"ganon"
   },
   {
      "Id":"416",
      "Label":"Ganons Castle Light Trial Second Left Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("415");
},
      "Tags":[
         
      ],
      "Location":"ganon"
   },
   {
      "Id":"417",
      "Label":"Ganons Castle Light Trial Third Left Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("415");
},
      "Tags":[
         
      ],
      "Location":"ganon"
   },
   {
      "Id":"418",
      "Label":"Ganons Castle Light Trial First Right Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("415");
},
      "Tags":[
         
      ],
      "Location":"ganon"
   },
   {
      "Id":"419",
      "Label":"Ganons Castle Light Trial Second Right Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("415");
},
      "Tags":[
         
      ],
      "Location":"ganon"
   },
   {
      "Id":"420",
      "Label":"Ganons Castle Light Trial Third Right Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("415");
},
      "Tags":[
         
      ],
      "Location":"ganon"
   },
   {
      "Id":"421",
      "Label":"Ganons Castle Light Trial Invisible Enemies Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("415");
},
      "Tags":[
         
      ],
      "Location":"ganon"
   },
   {
      "Id":"422",
      "Label":"Ganons Castle Light Trial lullaby Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("415") && obtainedItems.skGanon >= 1 && obtainedItems.lullaby;
},
      "Tags":[
         
      ],
      "Location":"ganon"
   },
   {
      "Id":"423",
      "Label":"Ganons Castle Spirit Trial Crystal Switch Chest",
      "Requirements":function ()
		{
			return obtainedItems.hookshot;
},
      "Tags":[
         
      ],
      "Location":"ganon"
   },
   {
      "Id":"424",
      "Label":"Ganons Castle Spirit Trial Invisible Chest",
      "Requirements":function ()
		{
			return HaveRequiredItem("423");
},
      "Tags":[
         
      ],
      "Location":"ganon"
   },
   {
      "Id":"425",
      "Label":"Ganons Castle Deku Scrub Left",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"ganon"
   },
   {
      "Id":"426",
      "Label":"Ganons Castle Deku Scrub Center-Left",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"ganon"
   },
   {
      "Id":"427",
      "Label":"Ganons Castle Deku Scrub Center-Right",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"ganon"
   },
   {
      "Id":"428",
      "Label":"Ganons Castle Deku Scrub Right",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         "scrub"
      ],
      "Location":"ganon"
   },
   {
      "Id":"429",
      "Label":"Ganons Tower Boss Key Chest",
      "Requirements":function ()
		{
			return true;
		},
      "Tags":[
         
      ],
      "Location":"ganon"
   }
];

locationList = [
	{
		"Id": "deku",
		"Label": "Deku tree"
	},
	{
		"Id": "dc",
		"Label": "Dodongos Cavern"
	},
	{
		"Id": "jabu",
		"Label": "Jabu Jabus Belly"
	},
	{
		"Id": "forest",
		"Label": "Forest Temple"
	},
	{
		"Id": "water",
		"Label": "Water Temple"
	},
	{
		"Id": "fire",
		"Label": "Fire Temple"
	},
	{
		"Id": "shadow",
		"Label": "Shadow Temple"
	},
	{
		"Id": "spirit",
		"Label": "Spirit Temple"
	},
	{
		"Id": "botw",
		"Label": "Bottom of the Well"
	},
	{
		"Id": "ice",
		"Label": "Ice Cavern"
	},
	{
		"Id": "gtg",
		"Label": "Gerudo Training Ground"
	},
	{
		"Id": "ganon",
		"Label": "Ganons castle"
	},
	{
		"Id": "outside",
		"Label": "Outside Gannons castle"
	},
	{
		"Id": "kokiri",
		"Label": "Kokiri forest"
	},
	{
		"Id": "wood",
		"Label": "Lost wood"
	},
	{
		"Id": "meadow",
		"Label": "Forest meadow"
	},
	{
		"Id": "field",
		"Label": "Hyrule fields"
	},
	{
		"Id": "tot",
		"Label": "Temple of time"
	},
	{
		"Id": "market",
		"Label": "Market"
	},
	{
		"Id": "ranch",
		"Label": "Lon lon ranch"
	},
	{
		"Id": "kak",
		"Label": "Kakariko"
	},
	{
		"Id": "dmt",
		"Label": "Death montain trail"
	},
	{
		"Id": "goron",
		"Label": "Goron city"
	},
	{
		"Id": "crater",
		"Label": "Death montain crater"
	},
	{
		"Id": "river",
		"Label": "Zora river"
	},
	{
		"Id": "domain",
		"Label": "Zora domain"
	},
	{
		"Id": "fontain",
		"Label": "Zora fontain"
	},
	{
		"Id": "lake",
		"Label": "Lake hylia"
	},
	{
		"Id": "valey",
		"Label": "Gerudos valey"
	},
	{
		"Id": "fortress",
		"Label": "Gerudos fortress"
	},
	{
		"Id": "wasteland",
		"Label": "Wasteland"
	},
	{
		"Id": "colossus",
		"Label": "Colossus"
	}
];


init();