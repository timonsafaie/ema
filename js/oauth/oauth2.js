/*
 * Copyright 2011 Google Inc. All Rights Reserved.

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

VERSION = "0.1"

/***********************************
 *
 * Helper Functions
 *
 ***********************************/

/**
  * Adding a printf like capabilities to javascript strings. Here the format specifiers uses
  * '{0-9+}' as format specifiers and replacement strings are provided as arguments to the
  * format function
  */
String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};

/**
  * Read the page url and return the params as an associative array
  * @return {Object} An associative array containing the url params
  */

function parseQueryString(queryString) {
  console.log(queryString);
  var params = {},
      regex = /([^&=]+)=([^&]*)/g, m;
  while (m = regex.exec(queryString)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  return params
}

/**
  * A helper function that loads the js file containing the code for the specified backend
  *
  * @param backend {String} the name of the desired oauth2 backend
  * @return {Object} the backend object
  */
var loadBackend = function(backendName){
  var head = document.querySelector('head');
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = backendName + '.js';
  head.appendChild(script);
};

var get_lib_path = function (){
  var lib_path = "";
  $('script').each(function(i, element) {
    var src = $(element).attr('src');
    var index  = src.indexOf("oauth2.js");
    if(index >= 0){
      lib_path = src.substring(0, index);
      return false;
    }
  });
  return lib_path;
};

/***********************************
 *
 * PRIVATE API - These shouldn't be accessed directly
 *
 ***********************************/
/**
  * A list of backends currently supported by the lib
  */
var BACKENDS = {"google": "GoogleOAuth2"}

/**
  * Constructor
  *
  * @param backend {String} name of the backend to be used
  * @param config {Object} Containing clientId, clientSecret and apiScope
  */

var BaseOAuth2 = function(backend, config) {
}

/**
  * A function that handles the oauth redirect by showing the appropriate error
  * message in case of error, otherwise saving the access tokens and other info
  * sent by the ouath backend and than calling the callback method to be called
  * provided by the user
  */
BaseOAuth2.onOAuthRedirect = function(hash) {
  var background_page = chrome.extension.getBackgroundPage();
  var oauth_config = background_page.oAuthConfig;
  var backend = background_page.oAuthBackend;
  backend.getAccessAndRefreshTokens(hash, background_page.callbackonAuthorize);
  window.close();
  chrome.tabs.getSelected(null, function (tab){
    chrome.tabs.remove(tab.id);
  });
}

/**
  * A setter function that sets the complete authorization url for the particular backend
  *
  * @param {String} Authrization Endpoint for the given backend
  */
BaseOAuth2.prototype.set_authorization_url = function(authorization_url) {
  var url = "{0}?client_id={1}&redirect_uri={2}&scope={3}";
  this.authorization_url = url.format(authorization_url, this.client_id,
							 this.redirect_uri,
							 this.api_scope);
};

/**
 * Opens up an authorization popup window. This starts the OAuth 2.0 flow.
 *
 * @param {Function} callback Method to call when the user finished auth.
 */
BaseOAuth2.prototype.openAuthorizationTab = function (callback, display_type) {
  // Store a reference to the callback so that the newly opened window can call
  // it later.

  if(display_type == "popup"){
    var width = 550;
    var height = 300;
    var left = (screen.width/2)-(width/2);
    var top = (screen.height/2)-(height/2);
    features = 'width='+width+', height='+height+', top='+top+', left='+left
    window.open(this.authorization_url, "SignIn", features);
  }
  else if(display_type == "newtab"){
    window.open(this.authorization_url);
  }
  else{
    var url = this.authorization_url;
    chrome.tabs.update(undefined, {url: url}, function (tab){});
  }
}


/**
 * Gets access and refresh (if provided by endpoint) tokens
 *
 * @param {String} the params returend from the oauth backend
 * @param {Function} callback function
 */
BaseOAuth2.prototype.getAccessAndRefreshTokens = function(hash, callback) {
  var that = this;
  var params = parseQueryString(hash);

  if("error" in params){
    //Some error during authorization. Call the callback method indicating to
    //the user that some error occured while authorization
    callback({"error": params["error"]});
  }
  else{
    //Authorization is successful
    for(key in params){
      that[key] = params[key];
    }
    //This param allows to find out when access token expires
    that.accessTokenDate =  new Date().valueOf();
    //OAuth is now complete. Call the callback method to allow user to get the
    //desired data using access tokens
    callback(that);
  }
}


/**
 * @return True iff the current access token has expired
 */
BaseOAuth2.prototype.isAccessTokenExpired = function() {
  var accessTokenDate = this.getAccessTokenDate();
  if(accessTokenDate)
    return (new Date().valueOf() - this['accessTokenDate']) >
              this['expiresIn'] * 1000;
  else
    return true;
};

/**
 * A listener that listens for messages sent from content scripts or other
 * modules. Currently if the incoming request is of type "get_lib_path", it
 * returns the path of the library w.r.t to the installation directory
 */

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {

    if (request.method == "get_lib_path"){
      var background_page = chrome.extension.getBackgroundPage();
      sendResponse({"lib_path" : background_page.lib_path});
    }
    else
      sendResponse({}); // snub them.
  });

/***********************************
 *
 * PUBLIC API
 *
 ***********************************/

/**
 * Initializes the appropariate OAuth2 backend from the background page. You
 * must call this before attempting to make any OAuth calls.
 *
 * @param backend {String} the name of the desired oauth2 backend
 * @param {Object} config Configuration parameters in a JavaScript object.
 *     The following parameters are recognized:
 *         "request_url" {String} OAuth request token URL.
 *         "consumer_key" {String} OAuth Client ID.
 *         "consumer_secret" {String} OAuth Client Secret.
 *         "scope" {String} OAuth access scope.
 *         "redirect_uri" {String} OAuth2 redirect uri
 *         "app_name" {String} Application Name
 *         "..." Other backend specific arguments
 * @return {Object} An initialized OAuth2 backend object.
 */

BaseOAuth2.initOAuth = function(backend, config){
  var background_page = chrome.extension.getBackgroundPage();
  background_page.oAuthConfig = config;
  background_page.lib_path = get_lib_path();
  var backend_cls =  window[BACKENDS[backend]];
  var oAuthBackend = new backend_cls(backend, config);
  background_page.oAuthBackend = oAuthBackend;
  return oAuthBackend;
}


/**
 * Starts an OAuth2 authorization flow for the current page.  If access token
 * exists, no redirect is needed and the supplied callback is called
 * immediately. If this method detects access tokens have expired, it fetches
 * the new refreshed access tokens. If no access token exists aan access token
 * is requested and the page is ultimately redirected.
 * @param {Function} callback The function to call once the flow has finished.
 *     This callback will be passed the oauth2 instance object.
 */

BaseOAuth2.prototype.authorize = function(callback, display_type) {
  var that = this;
  var background_page = chrome.extension.getBackgroundPage();
  background_page.callbackonAuthorize = callback;

  if (!that.getAccessToken()) {
    window.callbackonAuthorize = function (backend){
      if(callback)
	callback(backend);
    }
    // There's no access token yet. Start the authorizationCode flow
    that.openAuthorizationTab(callback, display_type);
  } else if (that.isAccessTokenExpired()) {
    // There's an existing access token but it's expired
  }
  else {
    callback(that);
  }
};

/**
 * The configurating object
 *
 * @returns {Object} Containing clientId, clientSecret and apiScope
 */
BaseOAuth2.prototype.getConfig = function() {
  return {
    client_id: this.client_id,
    client_secret: this.client_secret,
    redirect_uri: this.redirect_uri,
    api_scope: this.api_scope,
    response_type: this.response_type,
    authorization_url: this.authorization_url
  };
};

/**
  * A getter function that returns the authorization url for the particular backend
  *
  * @return {String} Complete Authorization URL with all the params
  */
BaseOAuth2.prototype.get_authorization_code = function() {
  return this.authorization_url;
}

/**
 * @returns A valid access token date.
 */
BaseOAuth2.prototype.getAccessTokenDate = function() {
  if(!this["accessTokenDate"])
    this["accessTokenDate"] = localStorage.getItem("accessTokenDate" +
						   encodeURI(this["api_scope"]));
  return this["accessTokenDate"];
};

/**
 * @returns A valid access token.
 */
BaseOAuth2.prototype.getAccessToken = function() {
  if(!this["accessToken"])
    this["accessToken"] = localStorage.getItem("accessToken" + encodeURI(this["api_scope"]))

  return this["accessToken"];
};

/**
 * Clears an access token, effectively "logging out" of the service.
 * @param {Bool} remove accesstokens from local storage as well
 */
BaseOAuth2.prototype.clearAccessToken = function(clearLocalStorage) {
  if(clearLocalStorage){
    localStorage.removeItem["accessToken" + encodeURI(this["api_scope"])];
    localStorage.removeItem["accessTokenDate" + encodeURI(this("api_scope"))];
  }
  delete this["accessToken"];
  delete this["accessTokenDate"];
};

/**
 * Stores an OAuth token for the configured scope along with the date.
 */
BaseOAuth2.prototype.saveAccessToken = function(){
  if(this["accessToken"]){
    localStorage["accessToken" + encodeURI(this["api_scope"])] = this["accessToken"];
    localStorage["accessTokenDate" + encodeURI(this["api_scope"])] =
                                         this["accessTokenDate"] || new Date().valueOf();
  }
  else
    throw "AccessTokenNotFound";
}

