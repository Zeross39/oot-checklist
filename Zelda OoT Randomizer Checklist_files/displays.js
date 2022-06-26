var filterChecked = "All";
var filterAge = "All";
var filterLocation = "All";

function changeFilterChecked(e)
{
	filterChecked = e.srcElement.value;
	refreshList();
}

function changeFilterAge(e)
{
	filterAge = e.srcElement.value;
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
		if (filterLocation !== "All" && checkList[i].Location !== filterLocation)
		{
			shouldDisplay = false;
		}
		if (filterChecked !== "All")
		{
			if (filterChecked === "Available" && !HaveRequiredItem(num))
			{
				shouldDisplay = false;
			}
			else
			{
				var expectChecked = filterChecked === "Checked";
				if (expectChecked !== (obj.children[0].innerText !== ""))
				{
					shouldDisplay = false;
				}
			}
		}
		if (filterAge !== "All")
		{
			if (checkList[i].Tags.indexOf(filterAge.toLowerCase()) === -1)
			{
				shouldDisplay = false;
			}
		}
		if (shouldDisplay)
		{
			if ($("#checkMark"+num)[0].innerText !== "")
			{
				obj.setAttribute("style", obtainedItemLook);
			}
			else
			{
				if (HaveRequiredItem(num))
				{
					obj.setAttribute("style", obtainableItemLook);
				}
				else
				{
					obj.setAttribute("style", visibleItemLook);
				}
			}
			if (woh.indexOf(checkList[num].Location) > -1)
			{
				$("#item"+num)[0].setAttribute("style", wohCheckLook);
			}
		}
		else
		{
			obj.setAttribute("style", hiddenItemLook);
		}
		num++;
	});
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
		if(i>0)
		{
			option = document.createElement("option");
			option.value = locationList[i].Id;
			option.text = locationList[i].Label;
			filterLocationList.appendChild(option);
		}
	}
}

function createErList()
{
	var erList = $(".dungeonErSelection");
 
	for (var i = 0; i < erList.length; i++)
	{
		for(var j = 0; j < dungeonList.length; j++)
		{
			var option = document.createElement("option");
			option.value = dungeonList[j].Id;
			option.text = dungeonList[j].Label;
			erList[i].appendChild(option);
		}
	}
}

function createWarpDestinationList()
{
	var warpDestination = $(".warpDestinationList");
 
	for (var i = 0; i < warpDestination.length; i++)
	{
		for(var j = 0; j < locationList.length; j++)
		{
			var option = document.createElement("option");
			option.value = locationList[j].Id;
			option.text = locationList[j].Label;
			warpDestination[i].appendChild(option);
		}
	}
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
	header.appendChild(current);
	
	current = document.createElement("th");
	current.textContent = "Name";
	header.appendChild(current);
	
	current = document.createElement("th");
	current.textContent = "Location";
	current.setAttribute("style", "width:20%");
	header.appendChild(current);
	
	current = document.createElement("th");
	current.textContent = "Item";
	current.setAttribute("style", "width:10%");
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
		var childAdultText = "";
		if (checkList[i].Tags.indexOf("child") > -1)
		{
			childAdultText += " <b>C</b>";
		}
		if (checkList[i].Tags.indexOf("adult") > -1)
		{
			childAdultText += " <b>A</b>";
		}
		current.innerHTML = checkList[i].Label + childAdultText;
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