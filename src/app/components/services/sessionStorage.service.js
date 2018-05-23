/**
 * Created by wenpeng.guo on 11/10/16.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .factory('SessionStorageService', SessionStorageService);

    SessionStorageService.$inject = ['$sessionStorage', 'lodash'];

    function SessionStorageService($sessionStorage, lodash) {
        return {
            setAllSessionStorage: setAllSessionStorage,
            setOneSessionStorage: setOneSessionStorage,
            removeAllSessionStorage: removeAllSessionStorage,
            removeOneSessionStorage: removeOneSessionStorage
        };

        function setAllSessionStorage(res, callback) {
            lodash.each(res, function (value, key) {
                $sessionStorage[key] = value
            });
            if (callback) {
                callback(res);
            }
            // $sessionStorage.levelName = res.data.levelName;
        }

        function setOneSessionStorage(key, value) {
            $sessionStorage[key] = value;
        }

        function removeAllSessionStorage() {
            delete $sessionStorage.cardId;
            delete $sessionStorage.token;
            delete $sessionStorage.storeId;
            delete $sessionStorage.weChatOpenId;
        }

        function removeOneSessionStorage(key) {
            delete $sessionStorage[key];
        }
    }
})();
