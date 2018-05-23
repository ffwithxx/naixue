/**
 * Created by fengli on 17/6/22.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaTestController', HeyTeaTestController);

    /** @ngInject */
    HeyTeaTestController.$inject = ['$location', 'UtilService', 'MyService', '$sessionStorage','$timeout','$scope'];

    function HeyTeaTestController($location, UtilService, MyService, $sessionStorage,$timeout,$scope) {
        var vm = this;
        vm.myImage='';
        vm.myCroppedImage='';

             var handleFileSelect=function(evt) {
            var file=evt.currentTarget.files[0];
              var reader = new FileReader();
               reader.onload = function (evt) {
                   $timeout(function () {
                       vm.myImage=evt.target.result;
                       // vm.myCroppedImage=evt.target.result;
                   }, 2000);
                    // vm.$apply(function(vm){
                    //
                    //   });
                  };
                reader.readAsDataURL(file);
               };
        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);



    }
})();
// angular.module('vk', ['ngImgCrop'])
//      .controller('HeyTeaTestController', function($scope) {
//        $scope.myImage='';
//         $scope.myCroppedImage='';
//
//      var handleFileSelect=function(evt) {
//             var file=evt.currentTarget.files[0];
//               var reader = new FileReader();
//                reader.onload = function (evt) {
//                     $scope.$apply(function($scope){
//                           $scope.myImage=evt.target.result;
//                       });
//                   };
//                 reader.readAsDataURL(file);
//                };
//          angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
//      });
