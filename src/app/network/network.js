angular.module('odl.networking', [])

.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('network', {
    templateUrl: 'network/index.tpl.html',
    url: '/network'
  });

  $stateProvider.state('network.staticroutes', {
    url: '/staticroute',
    views: {
      '': {
        templateUrl: 'network/staticroutes.tpl.html',
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
        templateUrl: 'network/staticroutes.create.tpl.html',
        controller: ['$scope', 'StaticRouteSvc', function ($scope, StaticRouteSvc) {
          $scope.submit = function () {
            StaticRouteSvc.routeUrl(null, $scope.data.name).post('', $scope.data).then(
              function (data) {
                $scope.$state.go('network.staticroutes');
              }
            );
          };
        }]
      }
    }
  });

  $stateProvider.state('network.subnets', {
    url: '/subnet',
    views: {
      '': {
        templateUrl: 'network/subnets.tpl.html',
        controller: ['$scope', 'SubnetSvc', function ($scope, SubnetSvc) {
          $scope.data = SubnetSvc.subnetsUrl(null).getList();
        }]
      }
    }
  });

  $stateProvider.state('network.subnets.create', {
    url: '/create',
    views: {
      '@network': {
        templateUrl: 'network/subnets.create.tpl.html',
        controller: ['$scope', 'SubnetSvc', function ($scope, SubnetSvc) {
          $scope.submit = function () {
            SubnetSvc.subnetUrl(null, $scope.data.name).post('', $scope.data).then(
              function(data) {
                $scope.$state.go('network.subnets');
              }
            );
          };
        }]
      }
    }
  });

}]);