angular.module('odl.nodes', [])

.controller('NodesCtrl', function($scope, SwitchSvc) {
  $scope.ncpData = {};

  // Fetch the nodes then fetch more info about each node
  SwitchSvc.nodesUrl().getList().then(function(npData) {
    $scope.npData = npData.nodeProperties;
  });
})

.config(function ($stateProvider) {
  $stateProvider.state('nodes', {
    url: '/nodes',
    templateUrl: 'nodes/index.tpl.html',
    views: {
      'menu@': {
        controller: function ($scope) {
        }
      }
    }
  });

  $stateProvider.state('nodes.details', {
    url: '/{nodeType}/{nodeId}',
    views: {
      '': {
        templateUrl: 'nodes/details.tpl.html',
        controller: function ($scope, $stateParams, SwitchSvc) {
          $scope.ncpData = SwitchSvc.nodeUrl(null, $stateParams.nodeType, $stateParams.nodeId).get();
        }
      }
    }
  });
});
