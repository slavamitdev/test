function TaskManager(params) {
	this.fieldName = params.fieldName,
	this.formName = params.formName,
	this.formParams = [],
	this.arParams = {},
	this.storageObject = {},
	this.arStorageItems = [],
	this.dateMark = new Date().getTime()
};

TaskManager.prototype.init = function(event) {
	event = event || window.event;
	event.preventDefault();
	var actionType = this.getFormParams();
	if (actionType) {
		switch (actionType) {
			case 'new': this.createStorageObject(); break;
			case 'edit': this.editStorageObject(); break;
		}
	}
	else {
		$(this.fieldName).css('background-color','#f33');
		var thiss = this;
		setTimeout(
			function() {
				$(thiss.fieldName).css('background-color','#fff');
			},1000
		);
	}
	return false;
};

TaskManager.prototype.getFormParams = function() {
	this.formParams = $(this.formName).serializeArray();
	var actionType;
	var checkMark;
	for (var i = 0; i<this.formParams.length; i++) {
		this.arParams[(this.formParams[i].name == 'action_type'?'task_status':this.formParams[i].name)] = this.formParams[i].value;
		if (this.formParams[i].name == 'action_type') {
			actionType = this.formParams[i].value;
		}
		if (this.formParams[i].name == 'task_name') {
			checkMark = (this.formParams[i].value == '')?false:true;
		}
	};
	if (checkMark) {
		return actionType;
	}
	else {
		return false;
	}
	
};

TaskManager.prototype.createStorageObject = function() {
	var data = {};
	this.arParams['id'] = this.dateMark;
	data[this.dateMark] = this.arParams;
	localStorage.setItem('task_'+this.dateMark, JSON.stringify(data));
	location.reload();
	return false;
};

TaskManager.prototype.editStorageObject = function() {
	var data = {};
	data[this.arParams.id] = this.arParams;
	localStorage.setItem('task_'+this.arParams.id, JSON.stringify(data));
	location.reload();
	return false;
};

TaskManager.prototype.editStatus = function(id,status) {
	var arItem = JSON.parse(localStorage.getItem('task_'+id));
	if (status != 'default') {
		arItem[id].task_status = status;
		localStorage.setItem('task_'+id, JSON.stringify(arItem));
	}
	location.reload();
	return false;
};

TaskManager.prototype.getStorageObject = function() {
	this.storageObject = localStorage;
	for (items in this.storageObject) {
		var arItem = JSON.parse(localStorage.getItem(items));
		for (item in arItem) {
			this.arStorageItems.push(arItem[item]);
		}
	};
	this.createHtmlString();
	return false;
};

TaskManager.prototype.createHtmlString = function() {
	for (var i = 0; i<this.arStorageItems.length; i++) {
		var date = new Date(parseInt(this.arStorageItems[i].id));
		var dateToString = date.getDate()+'.'+(date.getMonth() + 1)+'.'+date.getFullYear();
		var string = '<div class="task-wrap bg_green1"><div class="task-innerwrap" data-id="'+this.arStorageItems[i].id+'"><h3 class="align1">'+this.arStorageItems[i].task_name+'</h3><p class="date f_grey1">'+dateToString+'</p><p>'+this.arStorageItems[i].task_description+'</p></div><div class="task-button-wrap"><span class="task-button edit" onclick="ShowForm(\'edit\','+this.arStorageItems[i].id+')">Редактировать</span><span class="task-button delete" onclick="taskManager.taskDelete('+this.arStorageItems[i].id+')">Удалить</span></div></div>';
		$('#'+this.arStorageItems[i].task_status+'-tasks').append(string);
	}
	return false;
};

TaskManager.prototype.taskDelete = function(id) {
	localStorage.removeItem('task_'+id);
	location.reload();
	return false;
};