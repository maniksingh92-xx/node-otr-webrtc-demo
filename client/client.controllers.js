(function () {
  'use strict';
  angular
    .module('privlyChat')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', 'evtSrc', 'rtc', 'chat', '$http'];

  function MainCtrl($scope, evtSrc, rtc, chat, $http) {
    var vm = this;
    vm.name = "niko";

    vm.messages = [];

    evtSrc.initialize(document.location.origin + "/stream");
    rtc.createPeerConnection();

    $scope.$on('nick', chat.commandNick);
    $scope.$on('join', chat.commandJoin);
    $scope.$on('processText', chat.processText);


  }//END controller MainCtrl
})();