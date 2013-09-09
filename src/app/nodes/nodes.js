angular.module('odl.nodes', [])

.controller('NodesCtrl', ['$scope', 'SwitchSvc', function($scope, SwitchSvc) {
  $scope.ncpData = {};

  // Fetch the nodes then fetch more info about each node
  SwitchSvc.nodesUrl().getList().then(function(npData) {
    $scope.npData = npData.nodeProperties;
  });
}])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('nodes', {
    url: '/nodes',
    templateUrl: 'nodes/index.tpl.html',
    controller: 'NodesCtrl'
  });

  $stateProvider.state('nodes.details', {
    url: '/{nodeType}/{nodeId}',
    views: {
      '': {
        templateUrl: 'nodes/details.tpl.html',
        controller: ['$scope', '$stateParams', 'SwitchSvc', function ($scope, $stateParams, SwitchSvc) {
          $scope.ncpData = SwitchSvc.nodeUrl(null, $stateParams.nodeType, $stateParams.nodeId).get();
        }]
      }
    }
  });
}]);