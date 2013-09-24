angular.module('odl.node', [])

.controller('nodeCtrl', function($scope, SwitchSvc) {
  $scope.ncpData = {};

  // Fetch the node then fetch more info about each node
  SwitchSvc.nodeUrl().getList().then(function(npData) {
    $scope.npData = npData.nodeProperties;
  });
})

.config(function ($stateProvider) {
  $stateProvider.state('node', {
    url: '/node',
    views: {
      '': {
        templateUrl: 'node/index.tpl.html',
        controller: function ($scope, SwitchSvc) {
          $scope.$watch(function () { return SwitchSvc.items; }, function (data) {
            $scope.data = data
          });
        }
      }
    }
  });

  $stateProvider.state('node.details', {
    url: '/{nodeType}/{nodeId}',
    views: {
      '': {
        templateUrl: 'node/details.tpl.html',
        controller: function ($scope, $stateParams, SwitchSvc) {
          $scope.ncpData = SwitchSvc.nodeUrl(null, $stateParams.nodeType, $stateParams.nodeId).get();
        }
      }
    }
  });
});
