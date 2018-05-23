/**
 * Created by wenpeng.guo on 11/10/16.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .factory('RunStoreService', RunStoreService);

    function RunStoreService() {
        var orderItems;
        return {
            getOrderItems: getOrderItems,
            setOrderItems: setOrderItems
        };

        function getOrderItems() {
            return orderItems;
        }

        function setOrderItems(obj) {
            orderItems = obj;
        }
    }
})();
