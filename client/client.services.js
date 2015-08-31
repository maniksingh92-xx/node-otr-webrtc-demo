(function () {
  'use strict';
  angular
    .module('privlyChat')
    .factory('evtSrc', evtSrc);

  angular
    .module('privlyChat')
    .factory('rtc', rtc);

  angular
    .module('privlyChat')
    .factory('chat', chat);

  evtSrc.$inject = ['$q', '$interval'];
  rtc.$inject = [];
  chat.$inject = ['$rootScope', '$http'];

  function evtSrc($q, $interval) {

    var source = {};

    return {
      initialize: initialize
    };

    function initialize (stream_url) {
      source.stream_url = stream_url;
      connectStream(stream_url)
        .then(onConnectionSuccess,onConnectionError,onConnectionNotify);

      function onConnectionSuccess(success) {
        console.log(success);
        addEventListeners();
      }//END onConnectionSuccess
      function onConnectionError(error) {
        console.log(error);
      }//END onConnectionError
      function onConnectionNotify(notify) {
        console.log(notify);
      }//END onConnectionNotify
    }//END initialize

    function connectStream(stream_url) {
      var deferred = $q.defer();
      source.stream = new EventSource(stream_url);
      $interval(attemptConnection, 2000, 20);
      return deferred.promise;

      function attemptConnection() {        
        if(source.stream.readyState == 0) {
          deferred.notify("Attempting EventSource connection to: " + stream_url);
          setTimeout(attemptConnection, 2000);
        } else if(source.stream.readyState == 1){
          source.connectedStream = true;
          deferred.resolve("Connected successfully to EventSource");
          $interval.cancel();
        } else if(source.stream.readyState == 2){
          deferred.reject("Connection to EventSource not ready");
          $interval.cancel();
        }    
      }//END attemptConnection      
    }//END connectStream

    function addEventListeners () {
      console.log("Adding event listeners");
      source.stream.addEventListener("message", eventMessage);

      function eventMessage(ev) {
        console.log(ev);
      }//END eventMessage
    }//END addEventListeners
  }//END factory evtSrc

  function rtc() {

    var datachannel;
    var pc = {};
    var pc_config = webrtcDetectedBrowser === 'firefox' ? {'iceServers':[{'url':'stun:23.21.150.121'}]} : {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};
    var pc_constraints = {
      'optional': [
        {'DtlsSrtpKeyAgreement': true},
        {'RtpDataChannels': true}
      ]
    };
    var sdpConstraints = {
      'mandatory' : {
        'OfferToReceiveAudio': false,
        'OfferToReceiveVideo': false
      }
    };

    var rtc = {
      pc_config : pc_config,
      pc_constraints: pc_constraints,
      sdpConstraints: sdpConstraints
    };

    return {
      rtc : rtc,
      createPeerConnection : createPeerConnection
    };

    function createPeerConnection() {
      try {
        pc = new RTCPeerConnection(pc_config, pc_constraints);
        console.log('Created RTCPeerConnnection with:\n' +
            ' config: \'' + JSON.stringify(pc_config) + '\';\n' +
            ' constraints: \'' + JSON.stringify(pc_constraints) + '\'.');
        pc.onicecandidate = function(e){
          console.log(e);
        };
        datachannel = pc.createDataChannel("sendDataChannel",{reliable: true});
      } catch (e) {
        console.log('Failed to create PeerConnection, exception: ' + e.message);
        alert('Cannot create RTCPeerConnection object.');
      }
    }//END createPeerConnection
  }//END factory rtc

  function chat($rootScope, $http) {
    return {
      commandNick : commandNick,
      processText : processText,
      commandJoin : commandJoin
    };

    function commandNick(event, args) {
      console.log("event is " + args.event);
      console.log("text is " + args.text);
    }//END evtNick

    function processText(event, args) {
      $rootScope.$broadcast('addTextToBox', {text: args.text});
    }//END evtProcessText

    function commandJoin(event, args) {

      var req = {
        method: 'POST',
        url: '/room',
        headers: {'Content-Type': 'application/json'},
        data: { room: args.text }
      }

      $http(req).
        then(function(response) {
          // this callback will be called asynchronously
          // when the response is available
        }, function(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    }//END commandJoin
  }//END factory chat
})();