/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
		this.receivedEvent('deviceready');
		if (this.mvpnAvailable()) {
			this.bindTestButtons();
			this.testFetch();
			this.loadiFrame();
		}
	},

	mvpnAvailable: function() {
		try {
			let tmp = mvpn;
			tmp = mvpnFetch;
			console.log('MVPN SDK detected.');
			return true;
		} catch (e) {
			console.error('No MVPN SDK');
			let nomvpn = document.querySelectorAll('.nomvpn');
			let waiting = document.querySelectorAll('.waiting');
			waiting.forEach((val, _k, _p) => { val.setAttribute('style', 'display:none;'); });
			nomvpn.forEach((val, _k, _p) => { val.setAttribute('style', 'display:block;'); });
			return false;
		}
	},

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        let parentElement = document.getElementById(id);
        let listeningElement = parentElement.querySelector('.listening');
        let receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
	},

	bindTestButtons: function() {
		let parentElement = document.getElementById('testBrowser');
		let status = parentElement.querySelector('#buttonStatus');
		let waiting = status.querySelector('.waiting');
		let success = status.querySelector('.success');
		let error = status.querySelector('.error');
		let fail = status.querySelector('.fail');

		let loadCitrixButton = document.getElementById('loadCitrix');
		let loadFacebookButton = document.getElementById('loadFacebook');
		let loadHttpTestWebButton = document.getElementById('loadHttpTestWeb');
		let loadHttpsTestWebButton = document.getElementById('loadHttpsTestWeb');

		loadCitrixButton.addEventListener('click', loadCitrix);
		loadFacebookButton.addEventListener('click', loadFacebook);
		loadHttpTestWebButton.addEventListener('click', loadHttpTestWeb);
		loadHttpsTestWebButton.addEventListener('click', loadHttpsTestWeb);

		waiting.setAttribute('style', 'display:none;');
		success.setAttribute('style', 'display:block;');
	},

	testFetch: function() {
		let parentElement = document.getElementById('testFetch');
		let status = parentElement.querySelector('#fetching');
		let waiting = status.querySelector('.waiting');
		let success = status.querySelector('.success');
		let error = status.querySelector('.error');
		let fail = status.querySelector('.fail');

		mvpnFetch('https://www.googleapis.com/customsearch/v1')
			.then(response => {
				console.log('received response from testweb');
				return response.json();
			})
			.catch(err => {
				console.log('error getting json from response: ' + err);
				waiting.setAttribute('style', 'display:none;');
				error.setAttribute('style', 'display:block;');
			})
			.then(json => {
				console.log('received json: ' + json);
				let res = success;
				waiting.setAttribute('style', 'display:none;');
				res.setAttribute('style', 'display:block;');
			})
	},

	loadiFrame: function() {
		let parentElement = document.getElementById('testBase');
		let status = parentElement.querySelector('#baseWebView');
		let waiting = status.querySelector('.waiting');
		let success = status.querySelector('.success');
		let error = status.querySelector('.error');
		let fail = status.querySelector('.fail');

		let iframe = document.createElement('iframe');
		iframe.src = 'http://testweb.cemmobile.ctx';
		iframe.height = '25%'
		iframe.width = '90%'
		parentElement.appendChild(iframe);
	},
};

const expectedJson = {
	"error": {
	 "errors": [
	  {
	   "domain": "global",
	   "reason": "required",
	   "message": "Required parameter: q",
	   "locationType": "parameter",
	   "location": "q"
	  }
	 ],
	 "code": 400,
	 "message": "Required parameter: q"
	}
};

const loadCitrix = function() { loadInAppBrowser('https://www.citrix.com'); }
const loadFacebook = function() { loadInAppBrowser('https://facebook.com'); }
const loadHttpTestWeb = function() { loadInAppBrowser('http://testweb.cemmobile.ctx'); }
const loadHttpsTestWeb = function() { loadInAppBrowser('https://testweb.cemmobile.ctx'); }

const target = '_blank';
const options = '';

function loadInAppBrowser(url) {
	console.log('click! loading ' + url);

	if (mvpn) {
		let ref = mvpn.InAppBrowser.open(url, target, options);
		ref.addEventListener('loadstart', event => { console.log('Load started: ' + event); });
		ref.addEventListener('loadstop', event => { console.log('Load stopped: ' + event); });
		ref.addEventListener('loaderror', event => { console.log('Load error: ' + event); });
		ref.addEventListener('exit', _ignored => { console.log('Browser closed'); });
	} else {
		console.log('cordova-cemapp plugin not installed.');
	}
}

app.initialize();