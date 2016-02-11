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

/**
  * A list of constants to be used while google oauth2
  */

GOOGLE_OAUTH2_ENDPOINT = "https://accounts.google.com/o/oauth2/auth";
GOOGLE_OAUTH2_RESPONSE_TYPE = "token";
GOOGLE_OAUTH2_VALIDATION_ENDPOINT = "https://www.googleapis.com/oauth2/v1/tokeninfo";
GOOGLE_DEFAULT_AUTO_PROMPT = "force";

/**
  * Constructor
  *
  * @param backend {String} name of the backend to be used
  * @param config {Object} Containing clientId, clientSecret and apiScope
  */
var GoogleOAuth2 = function (backend, config){
  this.backend = backend;
  this.client_id = config["client_id"];
  this.api_scope = config["scope"];
  this.redirect_uri =  config["redirect_uri"] || chrome.extension.getURL("oauth2.html");
  this.response_type = GOOGLE_OAUTH2_RESPONSE_TYPE;
  this.auth_endpoint = GOOGLE_OAUTH2_URL;
  this.state = config["state"] || backend;
  this.approval_prompt = config["approval_promt"] &&
                         (config["approval_promt"] == "force" ||
			  config["approval_promt"] == "auto") ||
                         GOOGLE_DEFAULT_AUTO_PROMPT

  var url = "{0}?client_id={1}&redirect_uri={2}&response_type={3}\
             &scope={4}&state={5}&approval_prompt={6}";

  this.authorization_url = url.format(GOOGLE_OAUTH2_ENDPOINT,
				      this.client_id, this.redirect_uri, this.response_type,
				      this.api_scope, this.state, this.approval_prompt);

};

/*
 * Making objects of type GoogleOAuth2 inherit from object of type BaseOAuth2
 */
GoogleOAuth2.prototype = new BaseOAuth2();

GoogleOAuth2.prototype.set_authorization_url = function (authorization_url) {

  var url = "{0}?client_id={1}&redirect_uri={2}&response_type={4}&scope={3}";
  this.authorization_url = url.format(authorization_url, this.client_id,
				      this.redirect_uri, this.response_type,
				      this.api_scope);
};

/*
 * A Google specific method to validate access tokens. Also checks against the
 * confused deputy problem by verifying the audience field in the response with
 * the client_id
 *
 * @param callback {Function} to be called after hitting the google validation
 * endpoint. If the validation is unsuccessful callback receives an object with
 * a single attribute error. Otherwise it returns a JSON array that describes
 * the access tokens
 */

GoogleOAuth2.prototype.validateTokens = function (callback) {
  var that = this;
  var url = "{0}?access_token={1}".format(GOOGLE_OAUTH2_VALIDATION_ENDPOINT,
					  this.access_token);
  console.log("Validation " + url);
  $.ajax({
    url: url,
    dataType: 'json',
    error: function (jqXHR, textStatus, errorThrown){
      callback({"error": errorThrown});
    },
    success: function (data){
      console.log(data.audience +  " " + that.client_id);
      if(data.audience != that.client_id){
	callback({"error": "Token Validation Failed. Audience ID didn't matched \
                  the client_id"});
      }
      else{
	callback(data);
      }
    }
  });
};

/*
 * A Google specific method to access the api's after authentication.
 *
 * @param api_url {String} A api endpoint to be accessed
 * @param callback {Function} to be called after hitting the provided api
 * endpoint. The callback either recieves an error object or an array containing
 * all the responses from the api endpoint
 */

GoogleOAuth2.prototype.accessApi = function (api_url, callback, viaheader){
  var that = this;
  var url = viaheader? api_url: api_url + "?access_token=" + this.access_token;
  $.ajax({
    url: url,
    dataType:'json',
    beforeSend: function (jqXHR, settings){
      if(viaheader){
	  jqXHR.setRequestHeader("Authorization", "Bearer " + that.access_token);
      }
    },
    error: function (jqXHR, textStatus, errorThrown){
      callback({"error": errorThrown});
    },
    success: function (data){
	callback(data);
    }
  });
};