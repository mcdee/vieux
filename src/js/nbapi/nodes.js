
opendaylight.factory('NodeSvc', ['Restangular', function (Restangular) {
    var svc = {
        'rest': Restangular
    };

    svc.getNodes = function (container) {
        return Restangular.all('switch/' + (container || 'default') + '/nodes').getList();
    }

    svc.getNode = function(container, type, id) {
        return Restangular.one('switch', (container || 'default')).one('node', type).one(id).get()
    }

    return svc
}]);

opendaylight.controller('NodesCtrl', ['$scope', 'NodeSvc', function($scope, NodeSvc) {
    $scope.ncpData = {}

    // Fetch the nodes then fetch more info about each node
    NodeSvc.getNodes().then(function(npData) {
        $scope.npData = npData.nodeProperties;

        angular.forEach(npData.nodeProperties, function (np) {
            NodeSvc.getNode('default', np.node['@type'], np.node['@id']).then(
                function(ncp, test) {
                    $scope.ncpData[np.node['@id']] = ncp.nodeConnectorProperties
                }
            )


        })
        //$scope.properties = data;
    });
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
                controller: ['$scope', '$stateParams', function ($scope, $stateParams) {
                }]
            }
        }
    });
}])