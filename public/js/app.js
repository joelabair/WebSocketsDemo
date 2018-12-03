/* jshint ignore:start */
_.templateSettings = {
	interpolate: /\{\{(.+?)\}\}/g
};

$(function() {
	var socket = io();
	var user = sessionStorage.getItem('socket.id');

	socket.on('connect', function() {
		if (!user) {
			user = socket.id;
			sessionStorage.setItem('socket.id', user);
		}
		socket.emit('hello', user);
		$('#server-url').text(' ' + socket.io.uri + ' ');
	});

	var template = _.template($('#message-template').text());
	var $input = $('.message_write textarea');
	var $chat = $('.chat_area');

	var sendMessage = function() {
		var msg = $input.val();
		if (msg.trim()) {
			socket.emit('chat message', {
				u: user,
				m: msg
			});
			$input.val('');
		}
		return false;
	};

	var scrollDown = _.debounce(function() {
		$chat.animate({
			scrollTop: $chat.height()
		});
	}, 100);

	socket.on('greetings', function(user) {
		$('#user-name').text(' ' + user.name + ' ');
	});

	socket.on('chat message', function(msg) {
		$('ul', $chat).append(
			template({
			user: msg.u,
			color: msg.c,
			message: msg.m,
			timestamp: msg.t
		}));
		scrollDown();
	});

	$input.keydown(function(e) {
		var code = e.keyCode ? e.keyCode : e.which;
		if (code == 13 && e.ctrlKey) {
			sendMessage();
			e.preventDefault();
		}
	});

	$('.message_write a').click(sendMessage);
});
