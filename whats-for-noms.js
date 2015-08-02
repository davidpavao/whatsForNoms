Tasks = new Mongo.Collection('tasks');

if (Meteor.isClient) {
  
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
  
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
 
  // This code only runs on the client
  angular.module('whats-for-noms',['angular-meteor']);
 
  angular.module('whats-for-noms').controller('NomsCtrl', ['$scope', '$meteor',
    function ($scope, $meteor) {
      
      $scope.$meteorSubscribe('tasks');
 
     $scope.tasks = $meteor.collection( function() {
        return Tasks.find($scope.getReactively('query'), { sort: { createdAt: -1 } })
      });
     
     $scope.addTask = function (newTask) {
        $meteor.call('addTask', newTask);
      };
 
      $scope.deleteTask = function (task) {
        $meteor.call('deleteTask', task._id);
      };
 
      $scope.setChecked = function (task) {
        $meteor.call('setChecked', task._id, !task.checked);
      };
      
      $scope.$watch('filter', function() {
        if ($scope.filter)
          $scope.query = {text: new RegExp($scope.filter)};
        else
          $scope.query = {};
      });
      
       $scope.count = function () {
        return Tasks.find({ checked: {$ne: true} }).count();
      };
 
  }]);
}

Meteor.methods({
  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTask: function (taskId) {
    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    Tasks.update(taskId, { $set: { checked: setChecked} });
  }
});

if (Meteor.isServer) {
  Meteor.publish('tasks', function () {
    return Tasks.find();
  });
}