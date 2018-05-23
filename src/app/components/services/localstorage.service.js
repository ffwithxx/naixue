/**
 * Created by wenpeng.guo on 11/10/16.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .factory('LocalStorageService', LocalStorageService);

    LocalStorageService.$inject = ['$localStorage', 'lodash'];

    function LocalStorageService($localStorage, lodash) {
        return {
            setAllLocalStorage: setAllLocalStorage,
            setOneLocalStorage: setOneLocalStorage,
            removeAllLocalStorage: removeAllLocalStorage,
            removeOneLocalStorage: removeOneLocalStorage
        };

        function setAllLocalStorage(res, callback) {
            lodash.each(res, function (key, value) {
                $localStorage[key] = value
            });
            if (callback) {
                callback(res);
            }
            // $localStorage.levelName = res.data.levelName;
        }

        function setOneLocalStorage(key, value) {
            $localStorage[key] = value;
        }

        function removeAllLocalStorage() {
            delete $localStorage.cardId;
            delete $localStorage.token;
            delete $localStorage.storeId;
            delete $localStorage.openId;
        }

        function removeOneLocalStorage(key) {
            delete $localStorage[key];
        }
    }
})();
