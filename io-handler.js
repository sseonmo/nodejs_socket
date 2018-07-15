// io-handler.js

const { EventEmitter } = require('events');
const url = require('url');

const eventEmitter = new EventEmitter();

const routes = {
	chat: /category\/(\d+)\/item\/(\d+)\/chat/,
};

const ee = new EventEmitter();
const namespacesCreated = {}; // will store the existing namespaces

module.exports = (io) => {
	io.sockets.on('connection', (socket) => {
		const { ns } = url.parse(socket.handshake.url, true).query;
		let matched = false;

		console.log("@ns@");
		console.log(ns);
		console.log("@ns@");


		if (!ns) { // if there is not a ns in query disconnect the socket
			socket.disconnect();
			return { err: 'ns not provided' };
		}

		Object.keys(routes).forEach((name) => {
			console.log(name);
			const matches = ns.match(routes[name]);

			if (matches) {
				matched = true;
				if (!namespacesCreated[ns]) { // check if the namespace was already created
					namespacesCreated[ns] = true;
					console.log(namespacesCreated);
					io.of(ns).on('connection', (nsp) => {
						const evt = `dynamic.group.${name}`; // emit an event four our group of namespaces

						console.log("evt ,",evt);
					// //	console.log("nsp ,",nsp);
					// 	console.log("matches ,",matches);
					// 	console.log("matches type,",toString.call(matches));
					// 	console.log("matches ,",matches.length);
					// 	console.log("matches ,",matches.slice(1, matches.length));

						ee.emit(evt, nsp, ...matches.slice(1, matches.length));
					});
				}
			}
		});


		if (!matched) { // if there was no match disconnect the socket
			socket.disconnect();
		}
	});

	return ee; // we can return the EventEmitter to be used in our server.js file
};

ee.on('dynamic.group.chat', (socket, categoryId, itemId) => {
	// implement your chat logic
});