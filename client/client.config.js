(function () {
  "use strict";
  angular
    .module('privlyChat')
    .config(theme);

  theme.$inject = ['$mdThemingProvider'];

  function theme($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .dark();
  }
})();