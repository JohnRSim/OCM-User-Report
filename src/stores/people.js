import { writable } from 'svelte/store';

const appConfig = {instance:'dev'};

/**
 * Store Framework
 */
const setup = {
	activePage: 'explorer', // [explorer,search]
	searchEnabled: false,
	searchString: '',
    searchResults: [1,2],
	filter: [],
	profileMap: [],
	availableProfiles:[],
	profilePhoto: {},
	profile: {},
	stats: {},
};

/**
 * Store People Details
 * 
 */
function managePeople() {
    let store = setup;
    //if (process.browser) {
        if (localStorage.getItem(`${appConfig.instance}_people`)) {
            const storedUpdates = JSON.parse(localStorage.getItem(`${appConfig.instance}_people`));
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
		 * 
		 */
		updateProfileImg: (userID, profileImgUrl) => {
            console.info('[people][updateProfileImg]', userID, profileImgUrl);
			update((a) => {
				a.profilePhoto[userID] = { img: profileImgUrl};
				return a;
			});
		},
        /**
         * 
         */
        updateProfileInfo: (profile) => {
            console.info('[people][updateProfileInfo]', profile);
            update((a) => {
				if ((typeof(profile) !== null) && (typeof(profile.id) !== null)) {
					//console.log('xxxxxxxx',profile.id);
					if (a.availableProfiles.indexOf(profile.id) === -1) {
						a.availableProfiles.push(profile.id);
					}
					a.profile[profile.id] = profile;
					const profileStub = {
						id: profile.id,
						name: profile.displayName,
						email: profile.name,
					}
					const checkProfileMap = a.profileMap.map((v) => v.id).indexOf(profile.id);

					if (checkProfileMap === -1) {
						a.profileMap.push(profileStub);
					}
				}
                return a;
            });
        },
        /**
         * updateStats
         */
        updateStats: (stats) => {
            console.info('[people][updateStats]', stats);
            update((a) => {
                a.stats = stats;
                return a;
            });
        },
        /**
         * updateVal
         */
        updateVal: (key,val) => {
            console.info('[people][updateVal]', key, val);
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
         * clearFilter
         */
        clearFilter:() => {
            console.info('[people][clearFilter]');
            update((a) => {
                a.searchEnabled = false;
                a.filter = [];
                a.searchString = '';
                return a;
            });
        },
		/**
		 * createBlankProfile
		 */
		createBlankProfile: (profileID) => {
            console.info('[people][createBlankProfile]', profileID);
			update((a) => {
				if (typeof(a.profile[profileID]) === 'undefined') {
					a.profile[profileID] = { 
						addressCity: '',
						addressCountry: '',
						addressLine1: '',
						addressLine2: '',
						addressState: '',
						addressZipCode: '',
						displayName: '',
						title: '',
						organization: '',
						expertise: '',
						biography: '',
						profileID: profileID,
					};
				}
				if (typeof(a.profilePhoto[profileID]) === 'undefined') {
					a.profilePhoto[profileID] = {
						img: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
					};
				}
				if (typeof(a.stats[profileID]) === 'undefined') {
					a.stats[profileID] = {
						followers: 0,
						following: 0,
						newConversations: 0,
					};
				}
				return a;
			});
		},
		/**
		 * reset the state
		 */
		reset: () => {
			//if (process.browser) {
                localStorage.setItem(`${appConfig.instance}_people`, setup);
			//}
			return set(setup);
		},
	};
}

const people = managePeople();
people.subscribe((val) => {
   // if (process.browser) {
        localStorage.setItem(`${appConfig.instance}_people`, JSON.stringify(val));
    //}
});

export { people };