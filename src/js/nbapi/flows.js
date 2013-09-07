opendaylight.controller('FlowCtrl', ['$scope', '$http', 'FlowSvc', 'SwitchSvc', function ($scope, $http, FlowSvc, SwitchSvc) {
  // The current flow
  $scope.flow = {installInHw: true};

  // These are the available actions
  $scope.actionOptions = {
    'DROP': {},
    'LOOPBACK': {}
  }

  $scope.actionActive = []

  $scope.nodes = SwitchSvc.nodesUrl().getList();

  // The current select nodes properties
  $scope.selectNode = function() {
    // Split the nodeString which contains nodeType and nodeId, this is used
    // in $scope.submit() to construct the URL for the PUT
    var node  = $scope.nodeString.split('/');

    $scope.flow.node = {type: node[0], id: node[1]};

    // Set nodeConnectorProperties for the selected node
    delete $scope.flow.ingressPort;
    $scope.ncpData = SwitchSvc.nodeUrl(null, $scope.flow.node.type, $scope.flow.node.id).get();
  }

  $scope.submit = function () {
    FlowSvc.staticFlowUrl(null, $scope.flow.node.type, $scope.flow.node.id, $scope.flow.name)
      .customPUT($scope.flow)
      .then(function (data) {
        $scope.$state.go('flows.list')
      })
  }
}])


// Flow composition view controller
opendaylight.controller('FlowCompositionCtrl', ['$scope', function ($scope) {
  $scope.$watch('actionActive', function(newValue, oldValue, scope) {
    $scope.flow.actions = newValue
  });
}])


opendaylight.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('flows', {
    url: '/flows',
    templateUrl: 'partials/flows.html',
    //template: '<ui-view></ui-view>',
    abstract: true
  })

  // List all flows - independant of node.
  $stateProvider.state('flows.list', {
    url: '/list',
    views: {
      '': {
        templateUrl: 'partials/flows.list.html',
        controller: ['$scope', 'FlowSvc', function ($scope, FlowSvc) {
          FlowSvc.flowsUrl().getList().then(function (data) {
            $scope.flows = data.flowConfig;
          })
        }]
      }
    }
  });

  $stateProvider.state('flows.create', {
    url: '/create',
    views: {
      '': {
        templateUrl: 'partials/flows.create.html',
        controller: 'FlowCtrl'
      },
      'composer@flows.create': {
        templateUrl: 'partials/flows.composer.html',
        controller: 'FlowCompositionCtrl'
      },
    }
  })

  // List the flows on a node
  $stateProvider.state('flows.node', {
    url: '/{nodeType}/{nodeId}',
    views: {
      '': {
        templateUrl: 'partials/flows.node.html',
        controller: ['$scope', 'FlowSvc', function ($scope, FlowSvc) {
          FlowSvc.nodeFlowsUrl('default', $scope.$stateParams.nodeType, $scope.$stateParams.nodeId).getList().then(
            function (data) {
              $scope.flows = data.flowConfig;
            }
          )
        }]
      }
    }
  });

  // Show details
  $stateProvider.state('flows.details', {
    url: '/{nodeType}/{nodeId}/{flowName}',
    views: {
      '': {
        templateUrl: 'partials/flows.details.html',
        controller: ['$scope', 'FlowSvc', function ($scope, FlowSvc) {
          FlowSvc.staticFlowUrl(null, $scope.$stateParams.nodeType, $scope.$stateParams.nodeId, $scope.$stateParams.flowName).get().then(
            function (data) {
              $scope.flow = data;
            }
          )
        }]
      }
    }
  });

  // Edit state which uses the '' view in flows.details
  $stateProvider.state('flows.details.edit', {
    url: '/edit',
    views: {
      '@flows.details': {
        templateUrl: 'partials/flows.edit.html',
        controller: ['$scope', 'FlowSvc', function ($scope, FlowSvc) {
        }]
      }
    }
  });
}])
