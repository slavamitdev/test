var taskManager = new TaskManager({
	formName: '[name=tasks_form]',
	fieldName: '[name=task_name]'
});

var ShowForm = function(type,params='') {
	ClearForm();
	$('.tasks-form-wrap').slideDown();
	$('[name=action_type]').val(type);
	if (type == 'edit') {
		var arItem = JSON.parse(localStorage.getItem('task_'+params));
		$('[name=task_name]').val(arItem[params]['task_name']);
		$('[name=task_description]').val(arItem[params]['task_description']);
		$('[name=tasks_form]').append('<input type="hidden" name="id" value="'+params+'" />');
		$('[name=tasks_form]').append('<input type="hidden" name="task_status" value="'+arItem[params]['task_status']+'" />');
	}
	return false;
};

var HideForm = function() {
	$('.tasks-form-wrap').slideUp();
	ClearForm();
	return false;
};

var ClearForm = function() {
	$('[name=tasks_form]').trigger('reset');
	$('[name=action_type]').val('');
	$('[name=id]').remove();
	$('[name=task_status]').remove();
	return false;
};

$(document).ready(function() {
	taskManager.getStorageObject();
	
	$('body').on('mouseenter','.task-innerwrap',function() {
		$(this).parent('.task-wrap').draggable();
		return false;
	});
	
	$('body').on('mouseup','.task-innerwrap',function(event) {
		event = event || window.event;
		var cursorPositionX = event.clientX;
		var taskId = $(this).data('id');
		var taskStatus = 'default';
		var blockParams = {
			'new':{
				'start': $('#new-tasks').offset().left,
				'end': $('#new-tasks').offset().left + $('#new-tasks').innerWidth()
			},
			'current':{
				'start': $('#current-tasks').offset().left,
				'end': $('#current-tasks').offset().left + $('#current-tasks').innerWidth()
			},
			'completed':{
				'start': $('#completed-tasks').offset().left,
				'end': $('#completed-tasks').offset().left + $('#completed-tasks').innerWidth()
			}
		};
		
		for (item in blockParams) {
			if (blockParams[item].start < cursorPositionX && cursorPositionX < blockParams[item].end) {
				taskStatus = item;
			}
		}
		taskManager.editStatus(taskId,taskStatus);
		return false;
	});
	return false;
});