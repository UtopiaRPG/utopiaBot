const rp = require("request-promise-native");
var tough = require('tough-cookie');


class HttpController{
  constructor(config, browser=null) {
    this.loadConfig(config);
  }

  loadConfig(config) {
    this.config = {
      name: config.name || "utopiaBot",
      password: config.password,
      link: config.forum.link,
      message: config.message || "voici le token pour Discord : \n \n !UB token {token}",
      subject: config.messageTitle || "Token Discord"
    };
  }


  login(){
    console.log("login at ",this.config.link)
    return rp({
      url: `${this.config.link}/login`,
      method: 'POST',
      form: {
        username: this.config.name,
        password: this.config.password,
        autologin: 'on',
        login: 'Connexion',
        query: '',
        redirect: ''
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Upgrade-Insecure-Requests': 1,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate'
      },
      resolveWithFullResponse: true
    })
      .then(()=> console.log("err no err"))
      .catch(err=>{
        if(err.statusCode === 302){
          this.sid = err.response.headers['set-cookie'].filter(c =>c.indexOf('_sid=')>=0 && c.indexOf('deleted')<0)[0]
        }
      })

  }

  loadProfile(profileNumber){
    let logPromise = this.sid ? Promise.resolve() : this.login()
    return logPromise.then(()=>{
      const sidSplitted = this.sid.match(/[^=;]*/g);
      const cookiejar = rp.jar();
      cookiejar.setCookie(new tough.Cookie({key: sidSplitted[0],value:sidSplitted[2],domain: sidSplitted[10], httpOnly: true, maxAge: 31536000}), this.config.link)
      return rp({
        url: `${this.config.link}/u${profileNumber}`,
        jar: cookiejar
      })
    })
  }
}

module.exports = HttpController;