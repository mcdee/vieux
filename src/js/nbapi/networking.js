opendaylight.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('network', {
    templateUrl: 'partials/network.html',
    url: '/network'
  });

  $stateProvider.state('network.staticroutes', {
    url: '/staticroute',
    views: {
      '': {
        templateUrl: 'partials/network.staticroutes.html',
        controller: ['$scope', 'StaticRouteSvc', function ($scope, StaticRouteSvc) {
          $scope.staticRoutes = StaticRouteSvc.routesUrl(null).getList();
        }]
      }
    }
  });

  $stateProvider.state('network.subnets', {
    url: '/subnet',
    views: {
      '': {
        templateUrl: 'partials/network.subnets.html',
        controller: ['$scope', 'SubnetSvc', function ($scope, SubnetSvc) {
          $scope.subnets = SubnetSvc.subnetsUrl(null).getList()
        }]
      }
    }
  });

}])