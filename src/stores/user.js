import { writable } from 'svelte/store';
//import { browser } from '$app/environment';
//import appConfig from '../../OCE/config.json';

const appConfig = {instance:'dev'};

/**
 * Store Framework
 */
const setup = {
    useSessionRequests: true,
    sessionID: null,
    agent: 'BitmapUserReport',
    APIVersion: 8118,
    BCSerial: 0,
    session: {
        oce: '',
    },
	profile: {
		oce: {
			id:''
		}
	},
	stats: {
		following:0,
		followers:0,
	},
	props:{}
};

/**
 * Store User Details
 * 
 */
function manageUser() {
    let store = setup;
    //if (process.browser) {
        if (localStorage.getItem(`${appConfig.instance}_user`)) {
            const storedUpdates = JSON.parse(localStorage.getItem(`${appConfig.instance}_user`));
            store = {
                ...setup,
                ...storedUpdates,
            }
        } else {
            store = setup;
        }
    //}

	const { subscribe, set, update } = writable(store);

	return {
        /**
         * Subscribe to updates
         */
        subscribe,
        /**
         * clearSession
         */
        clearSession: () => {
            console.info('[user][clearSession]');
            update((a) => {
                //clear tokens
                a.session = {
                    idcs: '',
                    oce: '',
                    facebook: '',
                };
                //clear OSN session id
                a.sessionID = null;
                return a;
            });
        },

        updateToken: (tokenObj) => {
            update((a) => {
                a.userToken = tokenObj;
                return a;
            })
        },

        /**
         * updateSession (OLD OCE/IDCS)
         */
        updateSession: (token, identityStore) => {
            console.info('[user][updateSession]');
            update((a) => {
                //console.log('update',a,data['idcs-auth-token'].split('|')[0])
			    window.localStorage.setItem(`session_${identityStore}`, JSON.stringify(token));
                a.session[identityStore] = token;
                return a;
            });
        },
        /**
         * updateProfileInfo
         */
        updateProfileInfo: (data, identityServer) => {
            console.info('[user][updateProfileInfo]', data, identityServer);
            update((a) => {
                a.profile[identityServer] = data;
                return a;
            });
        },
        /**
         * updateVal
         */
        updateVal: (key,val) => {
            console.info('[user][updateVal]', key, val);
            update((a) => {
                //console.log('update',a,data)
                if (typeof(a[key]) !== 'undefined') {
                    console.log('updating.........', a[key], val);
                    a[key] = val;
                }
                return a;
            });
        },
        /**
         * updateStats
         */
        updateStats: (stats) => {
            console.info('[user][updateStats]', stats);
            update((a) => {
                a.stats = stats;
                return a;
            });
        },
        /**
         * updateProperties
         */
        updateProps: (props) => {
            console.info('[user][updateProperties]', props);
            update((a) => {
                a.props = props;
                return a;
            });
        },
        /**
         * updateOCEVal
         */
        updateOCEVal: (key,val) => {
            console.info('[user][updateOCEVal]', key, val);
            update((a) => {
                //console.log('update',a,data)
                if (typeof(a.profile.oce[key]) !== 'undefined') {
                    console.log('updating.........', a.profile.oce[key], val);
                    a.profile.oce[key] = val;
                }
                return a;
            });
        },
        /**
         * updateConnectionID
         */
        updateConnectionInfo: (languageLocale, apiVersion, sessionId) => {
            console.log('[user][updateConnectionInfo]',languageLocale, apiVersion, sessionId)
            update((a) => {
                a.APIVersion = apiVersion;
                a.sessionID = sessionId;
                a.languageLocale = languageLocale;
                return a;
            });
        },
        /**
         * reset the state
         */
        reset: () => {
            //if (process.browser) {
                localStorage.setItem(`${appConfig.instance}_user`, setup);
            //}
            return set(setup);
        },
	};
}

const user = manageUser();
user.subscribe((val) => {
   // if (process.browser) {
        localStorage.setItem(`${appConfig.instance}_user`, JSON.stringify(val));
    //}
});

export { user };