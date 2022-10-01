<svelte:options tag="ocm-user-report" />

<script>
	//svelte
	import { onMount } from 'svelte';
	//conf
	import OCMConf from './lib/config/oce.json';

	//assets
	
	//api
	import Auth from './lib/api/auth.js';
	import OCERemoteJSON from './lib/api/oce_remoteJSON.js';
	import OCESocial from './lib/api/oce_social.js';

	//stores
	import { user as sUser } from './stores/user.js';
	import { people as sPeople } from './stores/people.js';
    import { each, prop_dev } from 'svelte/internal';

	const social = new OCESocial();
	const IDCS = new Auth();
	const OSN = new OCERemoteJSON();

	//globals
	let isMounted = false;
	let userFieldActive = false;
	let passFieldActive = false;
	let flip = false;
	let loginError = false;
	let loggedIn = false;

	let userProfilePhotos = {};

	//auth
	let username = '';
	let password = '';

	onMount(() => {
		isMounted = true;
		//getProfilePic();
		login();
	});

	/**
	 * login
	 **/
	 function login() {
		//get OCE session token
		const [promise, abort] = IDCS.login(username, password);

		promise.then((oce) => {
			console.log('[OCE][Auth][Logged In][Token]',oce);

			//check if IDCS errored - 
			if (typeof(oce.error) !== 'undefined') {
				console.error('IDCS OCE Auth Error: ', oce.error);
				loginError = true;
				//loginError();
				return;
			}

			//update session store
			sUser.updateSession(oce.access_token,'oce');

			//set sessionID if null set to active login to reuse throughout journey
			let sessionID = ($sUser.sessionID)? $sUser.sessionID: Date.now();

			//get conversation connection info
			const [promise, abort] = social.getConnectionInfo($sUser.session.oce, $sUser.useSessionRequests, sessionID);

			promise.then((connection) => {
				console.log('[connection]',connection);
				
				//set sessionID
				sessionID = ($sUser.useSessionRequests) ? connection.apiRandomID : sessionID;

				sUser.updateConnectionInfo(connection.languageLocale, connection.apiVersion, sessionID);
				//sUser.updateOCEVal('id',connection.id);]
				
				//store user profile info
				sUser.updateProfileInfo(connection.user, 'oce');

				loggedIn = true;
				//flip to show social widget
				flip = true;
			});
		}).catch((err) => {
			console.error('IDCS OCE Auth Error: ', err);
			loginError = true;
		});
	}
</script>


<!-- Wrapper -->
<section class="bitmapbytes-userReport">
	<!-- Widget -->
	<article>
		<!-- Container -->
		WIP3
		<!-- xContainer -->
	</article>
	<!-- xWidget -->
</section>
<!-- xWrapper -->

	
<style>
	
</style>
