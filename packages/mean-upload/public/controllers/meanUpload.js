'use strict';

angular.module('mean.mean-upload').controller('MeanUploadController', ['$scope', 'Global', 'MeanUpload', 'Users',
  function($scope, Global, MeanUpload, Users) {
    $scope.global = Global;
    $scope.files = [];

    $scope.uploadFileCallback = function (file) {
      $scope.files.push(file);
    };

    $scope.uploadFinished = function(files) {
      console.log(files);
    };

    $scope.userUploadFinished = function (files) {
        //console.log(files);     
        Users.get({
            userId: $scope.global.user._id
        }, function (user) {
            var file = files[0];
            user.pictureurl = '/public/Uploads/' + file.name;
            user.$update(function () {
                $scope.global.user.pictureurl = user.pictureurl;
            });
        });
    };
  }
]);
