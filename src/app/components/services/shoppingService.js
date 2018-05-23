/**
 * Created by ganyang on 16/11/12.
 */

(function () {
    'use strict';

    angular
        .module('vk')
        .factory('ShoppingService', ShoppingService);

    ShoppingService.$inject = ['$http', '$q', 'restUrl', 'restUrlV2','restUrlV4'];

    function ShoppingService($http, $q, restUrl, restUrlV2,restUrlV4) {
        return {
            getStores: getStores,
            getCategorybyStoreId: getCategorybyStoreId,
            getProductByCategoryId: getProductByCategoryId,
            getProductAttributes: getProductAttributes,
            getShouldPayAmount: getShouldPayAmount,
            getTransaction: getTransaction,
            payWithWeChat: payWithWeChat,
            getShouldPay:getShouldPay,
            getallStroe:getallStroe,
            getcardPay:getcardPay
        };

        function payWithWeChat(storeId, token, cardId, openId, param) {
            return $http({
                method: "POST",
                url: restUrlV2 + 'weixin/vShopWeixinPay',
                dataType: 'json',
                data: {
                    parentId: storeId,
                    cardId: cardId,
                    openId: openId,
                    body: param.body,
                    amount: param.amount,
                    curUrl: param.curUrl,
                    orderId: param.orderId
                },
                headers: {
                    token: token,
                    cardId: cardId
                }
            }).then(completed).catch(failed);
        }

               function getTransaction(token, cardId, param) {
            return $http({
                method: "POST",
                url: restUrlV2 + 'beforeOrders',
                dataType: 'json',
                data: param,
                headers: {
                    token: token,
                    cardId: cardId
                }
            }).then(completed).catch(failed);
        }

        function getcardPay(token, cardId, param) {
            return $http({
                method: "POST",
                url: restUrlV2 + 'payOrders',
                dataType: 'json',
                data: param,

            }).then(completed).catch(failed);
        }

        function getShouldPayAmount(token, cardId, param) {
            return $http({
                method: "POST",
                url: restUrl + 'orders/payment-compute',
                dataType: 'json',
                data: {
                    cardId: cardId,
                    total: param.total,
                    ticketIds: param.ticketIds || ""
                },
                headers: {
                    token: token,
                    cardId: cardId
                }
            }).then(completed).catch(failed);
        }
        function getShouldPay( param) {
            return $http({
                method: "POST",
                url: restUrlV4 + 'coupon/verification',
                dataType: 'json',
                data: {

                    products: param.products,
                    couponIds: param.couponIds || ""
                },
                headers: {
                    storeId:param.storeId
                }
            }).then(completed).catch(failed);
        }
        function getStores(storeId, token,cardId, params) {
            return $http({
                method: 'GET',
                url: restUrlV2 + 'store/by/' + params.distance + '/' + params.longitude + '/' + params.latitude + '/0/99/' + storeId,
                headers: {
                    token:token,
                    cardId:cardId
                }
            }).then(completed).catch(failed);
        }


        function getCategorybyStoreId(cardId, token, storeId) {
            return $http({
                method: 'GET',
                url: restUrl + 'categories/by/' + storeId + '/0/20',
                dataType: "json",
                headers: {
                    cardId: cardId,
                    token: token
                }
            }).then(completed).catch(failed);
        }

        function getProductByCategoryId(cardId, token, storeId, categoryId) {
            return $http({
                method: 'GET',
                url: restUrl + 'product/by/' + storeId + '/' + categoryId + '/0/199',
                dataType: "json",
                headers: {
                    cardId: cardId,
                    token: token
                }
            }).then(completed).catch(failed);
        }

        function getProductAttributes(token, storeId) {
            return $http({
                method: 'GET',
                url: restUrl + 'productAttribute/by/' + storeId + '/0/99',
                dataType: "json",
                headers: {
                    // cardId: cardId,
                    token: token
                }
            }).then(completed).catch(failed);
        }
        function getallStroe( storeId) {
            return $http({
                method: 'GET',
                url: restUrl + 'district/list/' + storeId ,
                data: {
                    id:storeId
                },
                dataType: "json",

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
