(function() {
  'use strict';

  angular
    .module('app')
    .controller('SignupCtrl', SignupCtrl);

  SignupCtrl.$inject = ['$scope', 'Auth', '$state', '$window'];

  function SignupCtrl($scope, Auth, $state, $window) {
    $scope.user = {};
    $scope.errors = {};

    if (Auth.isLoggedIn()) {
      $state.go('main');
    }

    $scope.register = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password,
          phone: $scope.user.phone
        })
          .then(function() {
            //Account created, redirect to home
            $state.go('main');
          })
          .catch(function(err) {
            err = err.data;
            $scope.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
          });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    //El resto de las funciones

    $scope.status = {
      isopen: false
    };

    $scope.toggled = function(open) {
      $log.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
  }
})();
