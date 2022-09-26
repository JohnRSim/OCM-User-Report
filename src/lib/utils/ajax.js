import qs from 'qs';
//import { user as sUser } from '../../../stores/user.js';

class Ajax {
	constructor(settings) {
		this.agent = 'atlas';
		this.APIVersion = 8118;
		this.languageLocale = 'en';
		this.BCSerial = 0;
		if(settings) {
			let {agent, APIVersion, languageLocale, BCSerial} = settings;

			if (agent) {
				this.agent = agent;
			}
			if (APIVersion) {
				this.APIVersion = APIVersion;
			}
			if (languageLocale) {
				this.languageLocale = languageLocale;
			}
			if (BCSerial) {
				this.BCSerial = BCSerial;
			}
		}	
	}



	//fetch req func
	send({ method, path, data, token, includeCred, sessionID }) {
		const fetch = window.fetch;//process.browser ? window.fetch : require('node-fetch').default;
		const controller = new AbortController();
		const { signal } = controller; // get signal

		const opts = {
			method,
			headers: {},
			//cache: 'no-store',//'no-cache','reload',
			signal
		};

		if ((data) && (data !== '')) {
			console.log('[AJAX][hasData]', data, typeof (data));
			if (typeof (data.type) !== 'undefined') {
				opts.body = data;
			} else if (data instanceof FormData) {
				opts.headers['Content-Type'] = 'multipart/form-data';
			} else {
				if (path.indexOf('data') === -1) {
					console.log('[AJAX][hasData][NoPath]');
					if (data.auth) {
						console.log('[AJAX][hasData][NoPath][Auth]');
						if (data.auth !== 'passThrough') {
							const auth = `${data.auth.username}:${data.auth.password}`;
							opts.headers['Authorization'] = `Basic ${btoa(auth)}`;
						}
						opts.mode = 'cors';
						if (data.auth.type === 'passThrough') {
							opts.headers['Content-Type'] = 'application/json';
							opts.body = JSON.stringify(data.data);
						} else if (data.auth.type === 'multipart') {
							opts.headers['Content-Type'] = 'multipart/form-data';
						} else {
							opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
							opts.body = qs.stringify(data.data);
						}
					} else {
						console.log('[AJAX][hasData][NoPath][NoAuth]');
						opts.headers['Content-Type'] = 'application/json';
						opts.headers['X-Requested-With'] = 'XMLHttpRequest';
						opts.body = JSON.stringify(data);
					}
				} else {
					console.log('[AJAX][hasData][PAth]');
					opts.body = data;
				}
			}

			if (typeof (data.repositoryId) !== 'undefined') {
				opts.headers['Content-Type'] = 'application/json';
				opts.headers['X-Requested-With'] = 'XMLHttpRequest';
				opts.body = JSON.stringify(data);
			}

		} else {
			console.log('[AJAX][NoData]');
			//opts.headers['Content-Type'] = 'text/plain';
			//opts.mode = 'same-origin';
			//opts.mode = 'cors';
		}

		if (token) {
			console.log('[AJAX][hasToken]');
			//opts.headers['Content-Type'] = 'application/json';
			opts.headers['Authorization'] = `Bearer ${token}`;
			//opts.mode = 'cors';
			//opts.credentials = 'omit';
			opts.credentials = 'same-origin';

		}

		if (sessionID) {
			//opts.mode = 'cors';
			opts.credentials = 'same-origin';
			opts.headers = {};
			opts.headers['Authorization'] = `Bearer ${token}`;

			if (typeof (data.type) !== 'undefined') {
				opts.headers['Content-Type'] = data.type;
			} else {
				opts.headers['Content-Type'] = 'application/json';
			}
			//check sessionID if it is waggle or client
			const d = new Date(sessionID);
			if (isNaN(d.getTime())) {
				opts.headers['X-Waggle-RandomID'] = sessionID;
			} else {
				opts.headers['X-Waggle-ClientID'] = sessionID;
				//opts.headers['X-Waggle-RandomID'] = '';
			}
			opts.headers['X-Requested-With'] = 'XMLHttpRequest';
			opts.headers['X-Waggle-Agent'] = this.agent;
			opts.headers['X-Waggle-APIVersion'] = this.APIVersion;
			opts.headers['X-Waggle-ForceLanguage'] = this.languageLocale;
			if (path.toString().includes('/osn/bc')) {
				opts.headers['X-Waggle-BCSerial'] = this.BCSerial;
			}
		}
		if (includeCred) {
			opts.credentials = 'include';
		}

		console.log('[AJAX]', path, opts);

		const promise = fetch(`${path}`, opts)
			.then(r => r.text())
			.then(json => {
				try {
					return JSON.parse(json);
				} catch (err) {
					return json;
				}
			});


		/*
		//download progress 
		if (typeof(promise.headers) !== 'undefined') {
			const total = Number(promise.headers.get('content-length'));
			let loaded = 0;
			for (const {length} of req.body.getReader()) {
				loaded += length;
				const progress = ((loaded / total) * 100).toFixed(2); // toFixed(2) means two digits after floating point
				console.log(`${progress}%`); // or yourDiv.textContent = `${progress}%`;
			}
		}*/

		return [
			promise,
			controller.abort.bind(controller)
		];
	}

	/**
	 * get
	 * @param {*} path 
	 * @param {*} token 
	 */
	get(path, token) {
		return this.send({ method: 'GET', path, token });
	}

	/**
	 * del
	 * @param {*} path 
	 * @param {*} token 
	 */
	del(path, data, token, includeCred, sessionID) {
		return this.send({ method: 'DELETE', path, data, token, includeCred, sessionID });
	}

	/**
	 * post
	 * @param {*} path 
	 * @param {*} data 
	 * @param {*} token 
	 */
	post(path, data, token, includeCred, sessionID) {
		return this.send({ method: 'POST', path, data, token, includeCred, sessionID });
	}

	/**
	 * put
	 * @param {*} path 
	 * @param {*} data 
	 * @param {*} token 
	 */
	put(path, data, token, includeCred, sessionID) {
		return this.send({ method: 'PUT', path, data, token, includeCred, sessionID });
	}

	/**
	 * patch
	 * @param {*} path 
	 * @param {*} data 
	 * @param {*} token 
	 */
	patch(path, data, token, includeCred, sessionID) {
		return this.send({ method: 'PATCH', path, data, token, includeCred, sessionID });
	}
}
export default Ajax;


