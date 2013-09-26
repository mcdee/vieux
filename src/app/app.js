var noAuthRoutes = ['/login'];

// Make sure to include the `ui.router` module as a dependency
var vieux = angular.module('vieux', [
  'templates-app',
  'templates-common',
  'ngCookies',
  'restangular',
  'ui.router',
  'ui.select2',
  'vieux.nbapi',
  'vieux.auth',
  'vieux.navigation',
  'vieux.services',
  'vieux.filters',
  'vieux.directives.navigation',
  'vieux.directives.general',
  'vieux.directives.topology',
  'vieux.flow',
  'vieux.node',
  'vieux.networking',
  'vieux.topology'
])


.run(function ($rootScope, $state, $stateParams, $location, config, AuthService) {
  // Set the state and stateParams on the $rootScope to make it available anywhere
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

  // Make config always available
  $rootScope.config = config;

  // Authentication stuff. Taken partially from: http://arthur.gonigberg.com/2013/06/29/angularjs-role-based-auth/
  var isClean = function (route) {
    return _.find(noAuthRoutes,
      function (noAuthRoute) {
        return _.str.startsWith(route, noAuthRoute);
      }
    );
  };

  $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
    if (!isClean($location.url()) && !$rootScope.authed) {
      ev.preventDefault();
      $location.path('/login');
    }
  });

  $rootScope.$watch(
    function () {
      var authed = AuthService.isAuthed();
      return authed;
    },
    function (authed) {
      $rootScope.authed = authed;
      $rootScope.user = authed ? AuthService.getUser() : null;
    }
  );
})


// TODO: This should probably be changed to use broadcasts and present a user with a login form if auth is gone?
.config(function ($httpProvider) {
  var logsOutUserOn401 = ['$q', '$location', function ($q, $location) {
    var success = function (response) {
      return response;
    };

    var error = function (response) {
      if (response.status === 401) {
        //redirect them back to login page
        $location.path('/login');

        return $q.reject(response);
      }
      else {
        return $q.reject(response);
      }
    };

    return function (promise) {
      return promise.then(success, error);
    };
  }];

  $httpProvider.responseInterceptors.push(logsOutUserOn401);
  $httpProvider.defaults.withCredentials = true;
})

.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider
    .otherwise('/');

  $stateProvider.state('index', {
    url: '/',
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
});
