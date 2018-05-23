/**
 * Created by ganyang on 16/11/11.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .factory('UtilService', UtilService);

    UtilService.$inject = ['$timeout', 'SessionStorageService'];

    function UtilService($timeout, SessionStorageService) {
        return {
            showToast: showToast,
            getGeolocation: getGeolocation

        };


        function showToast(scope, msg, callback) {
            //延迟1s提示,并在2s后消失
            $timeout(function () {
                scope.toastMsg = msg;
                scope.showToast = true;
                $timeout(function () {
                    scope.showToast = false;
                    if (callback) {
                        callback(scope);
                    }
                }, 2000);
            }, 500);
        }

        function getGeolocation(callback) {
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (r) {
              if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                  SessionStorageService.setOneSessionStorage("lat", r.point.lat);
                  SessionStorageService.setOneSessionStorage("lng", r.point.lng);
                  if (callback) {
                      callback()
                  }
                }
            })
        }

            /*if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    SessionStorageService.setOneSessionStorage("latitude", position.coords.latitude);
                    SessionStorageService.setOneSessionStorage("longitude", position.coords.longitude);
                    if (callback) {
                        callback(position)
                    }
                }, function (fail) {
                    if (callback) {
                        callback(fail)
                    }
                });
            } else {
              window.alert('Geolocation is not supported by this browser.')
            }*/
    }
})();
