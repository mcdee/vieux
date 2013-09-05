opendaylight.controller('NodesCtrl', ['$scope', 'SwitchSvc', function($scope, SwitchSvc) {
  $scope.ncpData = {}

  // Fetch the nodes then fetch more info about each node
  SwitchSvc.nodesUrl().getList().then(function(npData) {
    $scope.npData = npData.nodeProperties;
  })
}]);

opendaylight.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('nodes', {
    url: '/nodes',
    templateUrl: 'partials/nodes.html',
    controller: 'NodesCtrl'
  });

  $stateProvider.state('nodes.details', {
    url: '/{nodeType}/{nodeId}',
    views: {
      '': {
        templateUrl: 'partials/nodes.details.html',
        controller: ['$scope', '$stateParams', 'SwitchSvc', function ($scope, $stateParams, SwitchSvc) {
          $scope.ncpData = SwitchSvc.nodeUrl(null, $stateParams.nodeType, $stateParams.nodeId).get()
        }]
      }
    }
  });
}])