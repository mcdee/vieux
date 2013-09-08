angular.module('opendaylight').config(
  ['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
      .otherwise('/index');

    $stateProvider.state('index', {
        url: '/index',
        templateUrl: 'index.tpl.html'
    });

    $stateProvider.state('about', {
        url: '/about',
        templateUrl: 'about.tpl.html'
    });

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'login.tpl.html',
        controller: 'LoginController'
    });

    $stateProvider.state('logout', {
        url: '/logout',
        controller: 'LogoutController'
    });
}]);