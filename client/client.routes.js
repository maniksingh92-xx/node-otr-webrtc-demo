function () {
  angular
    .module('privlyChat')
    .config(config);

  config.$inject = ['$routeProvider'];

  //START config
  function config($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: '/client/index.html',
      controller: 'clientController',
      controllerAs: 'vm'
    })
  }//END config
}();