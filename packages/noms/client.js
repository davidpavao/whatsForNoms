  /*Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });*/

  /*
  // first, remove configuration entry in case service is already configured
  Accounts.loginServiceConfiguration.remove({
    service: "google"
  });
  Accounts.loginServiceConfiguration.insert({
    service: "google",
    clientId: "yourClientId",
    secret: "yourSecret"
  }); 
  */

  var nomsCtrls = angular.module('nomsCtrls', []);

  nomsCtrls.controller('PlaceList', ['$scope', '$meteor',
    function($scope, $meteor) {

      $scope.$meteorSubscribe('places');

      $scope.places = $meteor.collection(function() {
        return Places.find($scope.getReactively('query'), {
          sort: {
            createdAt: -1
          }
        })
      });

      $scope.$watch('filter', function() {
        if ($scope.filter)
          $scope.query = {
            text: new RegExp($scope.filter)
          };
        else
          $scope.query = {};
      });

      $scope.count = function() {
        return Places.find({
          checked: {
            $ne: true
          }
        }).count();
      };

      $scope.deletePlace = function(task) {
        $meteor.call('deleteTask', task._id);
      };

      // $scope.setChecked = function(task) {
      //   $meteor.call('setChecked', task._id, !task.checked);
      // };

    }
  ]);


  nomsCtrls.controller('PlaceEdit', ['$scope', function($scope) {
    $scope.places = $scope.$meteorCollection(Places);

    $scope.addPlace = function(newTask) {
      $meteor.call('addPlace', newTask);
    };

  }]);

  // Setup the application
  var nomsApp = angular.module('nomsApp', [
    'angular-meteor', 'ui.bootstrap', 'ui.router', 'nomsCtrls', 'ngSanitize'
  ]);

  // Configure router
  nomsApp.config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function($urlRouterProvider, $stateProvider, $locationProvider) {
      $stateProvider.

      state('places', {
        url: '/places',
        templateUrl: 'client/components/places/places.ng.html',
        controller: 'PlaceList'
      }).
      state('placeEdit', {
        url: '/places/{id}/edit',
        templateUrl: 'client/components/places/place-edit.ng.html',
        controller: 'PlaceEdit'
      });

      $urlRouterProvider.otherwise('/places');
    }
  ]);

  /*Meteor.methods({
    addPlace: function(name) {
      // Make sure the user is logged in before inserting a task
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      Places.insert({
        name: name,
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: Meteor.user().username
      });
    },
    deletePlace: function(placeId) {
        Places.remove(placeId);
      }
      // setChecked: function(taskId, setChecked) {
      //   Tasks.update(taskId, {
      //     $set: {
      //       checked: setChecked
      //     }
      //   });
      // }
  });*/