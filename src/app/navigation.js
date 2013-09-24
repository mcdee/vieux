angular.module('odl.navigation', [])



// This triggers data updates when clicking on a item
.controller('NavigationCtrl', function ($scope, $injector, SwitchSvc) {
  /*
   * Listen for the event:nagivation from the brd-anchor directive and act
   * accordingly.
   */
  $scope.svc = undefined;

  // The directive broadcasts event:navigation that we are listening to
  $scope.$on('event:navigation', function (event, data) {
    var stateToServices = {
      'node': 'SwitchSvc',
    };

    var svcName;
    if (stateToServices[data.state] !== undefined) {
      svcName = stateToServices[data.state]
    } else {
      svcName = _.str.capitalize(data.state.split('.')[0]) + 'Svc'
    }

    if (!$injector.has(svcName))
      return

    var svc = $injector.get(svcName);

    if (_.isFunction(svc.getAll)) {
      svc.getAll(null);
      $scope.svc = svc;
    }
  });

  // A watcher, if $scope.svc and $scope.svc.data then we return the data else null
  $scope.$watch(
    function () {
      return $scope.svc && $scope.svc.data ? $scope.svc.data : null
    },
    function(data) {
      if (data)
        $scope.menu = $scope.svc.itemsData(data)
    }
  )
})
