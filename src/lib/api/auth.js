import Ajax from '../utils/ajax';
import idcs from '../config/idcs.json';

class Auth {

  constructor(settings) {
    this.api = new Ajax(settings);
  }


  /**
  * login
  * login to idcs
  * @param {*} username 
  * @param {*} password 
  */
  login(username, password, scope) {
    console.log('[IDCS][Login]')

    //
    const postData = {
      grant_type: 'password',
      scope: scope || idcs.oauthScopeUrl,
      username: username,
      password: password
    };

    //
    const config = {
      auth: {
        username: idcs.clientId,
        password: idcs.clientSecret
      },
      data: postData
    };

    const [promise, abort] = this.api.post(`${idcs.idcsUrl}/oauth2/v1/token`, config);

    return [promise, abort];
  }

  /**
  * logout
  * logout idcs
  */
  logout() {
    console.log('[IDCS][logout]')

    const [promise, abort] = this.api.get(`${idcs.idcsUrl}/oauth2/v1/userlogout`);

    return [promise, abort];
  }
}

export default Auth;
