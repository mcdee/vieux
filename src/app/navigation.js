angular.module('odl.navigation', [])



// This triggers data updates when clicking on a item
.controller('TopMenuController', function ($scope, $injector, SwitchSvc) {
  /*
   * Listen for the event:nagivation from the brd-anchor directive and act
   * accordingly.
   */

  $scope.$on('event:navigation', function (event, data) {
    console.log("Navigation: " + data.state)
    switch (data.state) {
      case "nodes":
        SwitchSvc.getNodes('default');
        break
      case "flows":
        FlowSvc.getItems('default')
        break
    }
  });
})

.controller('ItemsMenuCtrl', function ($scope, $injector) {
  // Handle a data event
  $scope.$on('event:data', function (event, data, key) {
    $scope.data = data;
    $scope.key = key;

    var menuItems = [];
    switch (key) {
      case "nodes":
        angular.forEach(data.nodeProperties, function(n) {
          menuItems.push({
            state: 'nodes.details',
            params: {
              nodeId: n.node.id,
              nodeType: n.node.type
            },
            label: n.properties.description.value !== 'None' ? n.properties.description.value : n.node.type + '/' + n.node.id
          });
        });

        break;
    }
    $scope.menuItems = menuItems;
  });

  /*
   * If we're changing section we should atleast unset the $scope.data
   * so that the Items menu is hidden again.
   */
  $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.name.split('.')[0] !== fromState.name.split('.')[0])
      $scope.data = null;
  });
});
