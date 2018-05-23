/**
 * Created by wenpeng.guo on 11/10/16.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .factory('ApiService', ApiService);

    ApiService.$inject = ['$http', '$q', 'restUrl', 'restUrlV2'];

    function ApiService($http, $q, restUrl, restUrlV2) {
        return {
            getOrderList: getOrderList,
            getOrderById: getOrderById,
            getRechargeList: getRechargeList,
            assessOrder: assessOrder
        };

        function getOrderList(cardId, token, openId, storeId, orderType) {
            return $http({
                method: 'GET',
                url: restUrlV2 + 'orders/getOrdersByOpenId/' + openId + '/' + storeId + '/' + orderType + '/0/99',
                dataType: "json",
                headers: {
                    cardId: cardId,
                    token: token
                }
            }).then(completed).catch(failed);
        }

        function getOrderById(cardId, token, orderId){
            return $http({
                method: 'GET',
                url: restUrl + 'orders/' + orderId,
                dataType: "json",
                headers: {
                    cardId: cardId,
                    token: token
                }
            }).then(completed).catch(failed);
        }

        function getRechargeList(cardId, token, storeId, type) {
            return $http({
                method: 'GET',
                url: restUrl + 'transaction/by/' + cardId + '/' + storeId + '/0/99?type=' + type,
                dataType: "json",
                headers: {
                    cardId: cardId,
                    token: token
                }
            }).then(completed).catch(failed);
        }

        function assessOrder(params) {
            return $http({
                method: 'POST',
                url: restUrl + 'comment',
                data: {
                    orderId: params.orderId,
                    starLevel: params.starLevel,
                    content: params.content
                },
                dataType: "json"
            }).then(completed).catch(failed);
        }

        function completed(response) {
            return response.data;
        }

        function failed(e) {
            return $q.reject(e);
        }
    }
})();
