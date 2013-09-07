opendaylight.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('network', {
    templateUrl: 'partials/network.html',
    url: '/network'
  });

  $stateProvider.state('network.staticroutes', {
    url: '/staticroute',
    views: {
      '': {
        templateUrl: 'partials/staticroutes.html',
        controller: ['$scope', 'StaticRouteSvc', function ($scope, StaticRouteSvc) {
          $scope.data = StaticRouteSvc.routesUrl(null).getList();
        }]
      }
    }
  });

  $stateProvider.state('network.staticroutes.create', {
    url: '/create',
    views: {
      '@network': {
        templateUrl: 'partials/staticroutes.create.html',
        controller: ['$scope', 'StaticRouteSvc', function ($scope, StaticRouteSvc) {
          $scope.submit = function () {
            StaticRouteSvc.routeUrl(null, $scope.data.name).post('', $scope.data).then(
              function (data) {
                $scope.$state.go('network.staticroutes')
              }
            )
          }
        }]
      }
    }
  });

  $stateProvider.state('network.subnets', {
    url: '/subnet',
    views: {
      '': {
        templateUrl: 'partials/subnets.html',
        controller: ['$scope', 'SubnetSvc', function ($scope, SubnetSvc) {
          $scope.data = SubnetSvc.subnetsUrl(null).getList()
        }]
      }
    }
  });

  $stateProvider.state('network.subnets.create', {
    url: '/create',
    views: {
      '@network': {
        templateUrl: 'partials/subnets.create.html',
        controller: ['$scope', 'SubnetSvc', function ($scope, SubnetSvc) {
          $scope.submit = function () {
            SubnetSvc.subnetUrl(null, $scope.data.name).post('', $scope.data).then(
              function(data) {
                $scope.$state.go('network.subnets')
              }
            )
          }
        }]
      }
    }
  });

}])