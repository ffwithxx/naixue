/**
 * Created by wenpeng.guo on 11/10/16.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .factory('orderTypeService', orderTypeService);

    orderTypeService.$inject = [];

    function orderTypeService() {
        var self = this;

        self.orderType = null;

        return {
            setOrderType: setOrderType,
            getOrderType: getOrderType
        };

        function setOrderType(orderType) {
            self.orderType = orderType;
        }

        function getOrderType() {
            return self.orderType;
        }
    }
})();
