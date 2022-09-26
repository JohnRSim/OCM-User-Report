import Ajax from '../utils/ajax';
import OCEconfig from '../config/oce.json';

const api = new Ajax();
const contentServer = OCEconfig.contentServer;///pxysvc/proxy/oce';

class OCESocial {
    constructor(settings) {
        this.profilePhoto = null;
        if(settings) {
            let { profilePhoto } = settings;
            this.profilePhoto = profilePhoto || null;
        }
    }
	
    /**
     * updateProfilePicByID
     * updates user profile image
     */
	 updateProfilePicByID(userID, file, token, sessionID) {
        console.log('[updateProfilePicByID][me]', userID, file);

        const [promise, abort] = api.put(`${contentServer}/osn/social/api/v1/pictures/${userID}`, file, token, true, sessionID);
        return [promise, abort];
    }
	
    /**
     * createUserProperty
     * adds follower UserID to following
     */
	 createUserProperty(userID, prop, token, sessionID) {
        console.log(`[createUserProperty][${userID}]`);

        const data = prop;

        const [promise, abort] = api.post(`${contentServer}/osn/social/api/v1/people/${userID}/properties`, data, token, true, sessionID);
        return [promise, abort];
    }

    /**
     * getAllUserProperties
     * adds follower UserID to following
     */
    getAllUserProperties(userID, token) {
        console.log(`[getAllUserProperties][${userID}]`);

        const ms = Date.now();
        const [promise, abort] = api.get(`${contentServer}/osn/social/api/v1/people/${userID}/properties?cb=${ms}`, token);
        return [promise, abort];
    }

    /**
     * getProfilePic
     * returns profile info
     */
    getProfilePic(pictureID, token) {
        console.log('[getProfilePic][me]');
        const [promise, abort] = api.get(`${contentServer}/osn/social/api/v1/pictures/${pictureID}/profile`, token);
        return [promise, abort];
    }

    /**
     * getProfilePicByID
     * returns profile info
     */
    getProfilePicByID(userID) {
        console.log('[getProfilePic][me]', userID);
        let profileImg = '/profile_blank.png';
        if (typeof (this.profilePhoto[userID]) !== 'undefined') {
            profileImg = this.profilePhoto[userID].img
        }
        return profileImg;//`${contentServer}/osn/social/api/v1/pictures/${userID}/profile`;
    }

    /**
     * getConnectionInfo
     * get wagglid id to be able to access osn apis
     */
    getConnectionInfo(token, enableSession, sessionID) {
        console.log(`[getConnectionInfo]`);

        const data = (enableSession) ? {
            enterHive: true // keeps track of user session ootherwise sessionID
        } : '';

        const [promise, abort] = api.post(`${contentServer}/osn/social/api/v1/connections`, data, token, true, sessionID);
        return [promise, abort];
    }

    /**
     * getPeople
     */
    getPeople(sw, token) {
        sw = (sw) ? `,"startsWith":"${sw}"` : '';
        console.log('[getPeople]', sw);

        const ms = Date.now();
        const [promise, abort] = api.get(`${contentServer}/osn/social/api/v1/people?filter={"excludeHidden":true,"isEnabled":false,"isDisabled":false${sw}}&cb=${ms}`, token);
        return [promise, abort];
    }

    /**
     * getUserStats
     */
    getUserStats(userID, token) {
        console.log('[getUserStats]', userID);

        const ms = Date.now();
        const [promise, abort] = api.get(`${contentServer}/osn/social/api/v1/people/${userID}/statistics?filter={"excludeFavoritesCount":true,"excludeFlagsCount":true,"excludeSocialObjectsCount":true}&cb=${ms}`, token);
        return [promise, abort];
    }

    /**
     * getFollowers
     */
    getFollowers(userID, token) {
        console.log('[getFollowers]', userID);

        const ms = Date.now();
        const [promise, abort] = api.get(`${contentServer}/osn/social/api/v1/people/${userID}/followers?cb=${ms}`, token);
        return [promise, abort];
    }

    /**
     * getFollowingUsers
     */
    getFollowingUsers(userID, token) {
        console.log('[getFollowingUsers]', userID);

        const ms = Date.now();
        const [promise, abort] = api.get(`${contentServer}/osn/social/api/v1/people/${userID}/following?cb=${ms}`, token);
        return [promise, abort];
    }

    /**
     * addToFollowers
     * adds follower UserID to following
     */
    addToFollowers(followUserID, token, sessionID) {
        console.log(`[addToFollowers][${followUserID}]`);

        const data = '';

        const [promise, abort] = api.post(`${contentServer}/osn/social/api/v1/people/${followUserID}/followers`, data, token, true, sessionID);
        return [promise, abort];
    }

    /**
     * removeFollower
     * removes follower UserID to active users following list 
     */
    removeFollower(followUserID, token, sessionID) {
        console.log(`[removeFollower][${followUserID}]`);

        const data = '';

        const [promise, abort] = api.del(`${contentServer}/osn/social/api/v1/people/${followUserID}/followers`, data, token, true, sessionID);
        return [promise, abort];
    }
}

export default OCESocial;