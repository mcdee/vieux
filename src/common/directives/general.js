angular.module('odl.directives.general', [])

.directive('stateIcon', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            stateValue: '@value'
        },
        template: '<span class="glyphicon glyphicon-{{stateIcon}}-sign"></span>',
        controller: function ($scope) {
            var value = $scope.stateValue;

            var icons = {1: 'ok', 0: 'exclamation'};
            var textStates = {'true': 1, 'false': 0};

            if (_.isString(value) && !value.match('^[0-9]$')) {
                value = textStates[value];
            }
            $scope.stateIcon = icons[value];
        }

    };
})

.directive('portState', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            stateValue: '@value'
        },
        template: '<span ng-style="{color: stateColor}">{{stateString}}</span>',
        controller: function ($scope) {
            var states = {0: 'DOWN', 1: 'UP'};
            var colors = {0: 'red', 1: 'green'};

            $scope.stateString = states[$scope.stateValue];
            $scope.stateColor = colors[$scope.stateValue];
        }
    };
})

.directive('buttonCancel', [function() {
    // Runs during compile
    return {
        restrict: 'E',
        replace: true,
        scope: {
            'btnLabel': '@label',
            'btnSize': '@size',
            'btnGlyph': '@glyph',
            'cancelFunc': '=function',
            'toState': '@toState',
            'toParams': '=toParams',
            'state': '=state'
        },
        template: '<button class="btn btn-{{size}} btn-danger" ng-click="doCancel()"><span class="glyphicon glyphicon-{{glyph}}"></span> {{label}}</button>',
        controller: ['$scope', '$state', function ($scope, $state) {
          $scope.label = $scope.btnLabel || 'Cancel';
          $scope.size = $scope.btnSize || 'md';
          $scope.glyph = $scope.btnGlyph || 'remove-circle';

          $scope.doCancel = function () {
            if (angular.isFunction($scope.cancelFunc)) {
              $scope.cancelFunc();
              return;
            }

            // This is ugly for now due to $state not being available unless passed
            if ($scope.state && $scope.toState) {
              var params = $scope.toParams || {};
              $scope.state.transitionTo($scope.toState, {});
              return;
            }
          };
        }]
    };
}])

.directive('buttonSubmit', [function(){
  // Runs during compile
  return {
    restrict: 'E',
    replace: true,
    scope: {
      'btnLabel': '@label',
      'btnSize': '@size',
      'btnGlyph': '@glyph',
      'submitFunc': '=function',
      'form': '=',
      'validator': '='
    },
    template: '<button class="btn btn-{{size}} btn-success" ng-click="doSubmit()" ng-disabled="submitDisabled"><span class="glyphicon glyphicon-{{glyph}}"></span> {{label}}</button>',
    controller: ['$scope', function ($scope) {
      $scope.label = $scope.btnLabel || 'Submit';
      $scope.size = $scope.btnSize || 'md';
      $scope.glyph = $scope.btnGlyph || 'ok-circle';

      $scope.submitDisabled = true;

      $scope.doSubmit = function () {
        if ($scope.submitFunc) {
          $scope.submitFunc();
        }
      };

      $scope.toggle = function (newVal) {
        $scope.submitDisabled = newVal ? false : true;
      };

      // Setup a watch for form.$valid if it's passed
      if (!$scope.validator && $scope.form) {
        $scope.$watch('form.$valid', function (newVal, oldVal) {
          $scope.toggle(newVal);
        });
      }

      // This overrules the form watch if set - use with cauthion!
      if ($scope.validator && angular.isFunction($scope.validator)) {
        $scope.$watch(
          function() {
            return $scope.validator();
          },
          function(newVal, oldVal) {
            $scope.toggle(newVal);
          }
        );
      }

      // Lastly if none of the above goes we'll just enable ourselves
      if (!$scope.form && !$scope.validator) {
        $scope.submitDisabled = false;
      }
    }]
  };
}]);