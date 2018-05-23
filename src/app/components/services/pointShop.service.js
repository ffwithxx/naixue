/**
 * Created by wenpeng.guo on 16/12/31.
 */

(function () {
    'use strict';

    angular
        .module('vk')
        .factory('PointShopService', PointShopService);

    PointShopService.$inject = ['$http', '$q', 'restUrl', 'pointV1','restUrlV5', 'SessionStorageService'];

    function PointShopService($http, $q, restUrl, pointV1,restUrlV5 ,SessionStorageService) {
        return {
            getMyPointInfo: getMyPointInfo,
            getPointList: getPointList,
            getHeyTeaPointList: getHeyTeaPointList,
            getItemDetail: getItemDetail,
            getHeyTeaItemDetail: getHeyTeaItemDetail,
            getRecordList: getRecordList,
            getHeyTeaRecordList: getHeyTeaRecordList,
            getStoreList: getStoreList,
            getMyPointsRecords: getMyPointsRecords,
            goExchange: goExchange,
            goHeyTeaExchange: goHeyTeaExchange,
            pointProduct:pointProduct,
            pointProductwxPay:pointProductwxPay,
            getStoreFreight:getStoreFreight
        };

        function getMyPointInfo(token, cardId) {
            return $http({
                method: 'GET',
                url: restUrl + 'card/getCardInfo/' + cardId,
                headers: {
                    token: token,
                    cardId: cardId
                }
            }).then(completed).catch(failed);
        }
        function pointProduct(token, cardId,data) {
            return $http({
                method: 'POST',
                url: restUrlV5 + 'pointProduct/orders/add' ,
                data: data,
                headers: {
                    token: token,
                    cardId: cardId
                }
            }).then(completed).catch(failed);
        }
        function getMyPointsRecords(cardId, token) {
            return $http({
                method: 'GET',
                headers: {
                    token: token,
                    cardId: cardId
                },
                url: pointV1 + 'find/' + cardId + "/0/99"
            }).then(completed).catch(failed);
        }
        function getHeyTeaPointList(token, cardId, storeId) {
            return $http({
                method: 'GET',
                url: restUrl + 'point_product/queryList/' + storeId + '/1/0/99',
                headers: {
                    token: token,
                    cardId: cardId
                }
            }).then(completed).catch(failed);
        }
        function getPointList(token, cardId, storeId) {
            return $http({
                method: 'GET',
                url: restUrlV5 + 'pointProduct/list/0/99',
                headers: {
                    token: token,
                    cardId: cardId
                }
            }).then(completed).catch(failed);
        }

        function getItemDetail(token, cardId, itemId) {
            return $http({
                method: 'GET',
                url: restUrlV5 + 'pointProduct/get/' + itemId,
                headers: {
                    token: token,
                    cardId: cardId
                }
            }).then(completed).catch(failed);
        }

        function getStoreFreight(token, cardId, storeId) {
            return $http({
                method: 'GET',
                url: restUrlV5 + 'Store/StoreFreight/' + storeId,
                headers: {
                    token: token,
                    cardId: cardId
                }
            }).then(completed).catch(failed);
        }


        function getHeyTeaItemDetail(token, cardId, itemId) {
            return $http({
                method: 'GET',
                url: restUrl + 'point_product/queryOne/' + itemId,
                headers: {
                    token: token,
                    cardId: cardId
                }
            }).then(completed).catch(failed);
        }
        function getRecordList(token,cardId) {
            return $http({
                method: 'GET',
                url: restUrlV5 + 'pointProduct/orderRecord/0/99' ,
                headers: {
                    token: token,
                    cardId: cardId
                }
            }).then(completed).catch(failed);
        }
        function getHeyTeaRecordList(token,cardId) {
            return $http({
                method: 'GET',
                url: restUrl + 'point_exchange_gifts/queryList/0/99/' + cardId,
                headers: {
                    token: token,
                    cardId: cardId
                }
            }).then(completed).catch(failed);
        }
        function getStoreList(cardId, storeId, lat, lng) {
            return $http({
                method: 'GET',
                url: restUrl + 'store/by/100000000/' + lat + '/' + lng + '/0/99/' + storeId,
                headers: {

                    cardId: cardId
                }
            }).then(completed).catch(failed);
        }

        function goExchange(token,cardId,data) {
            return $http({
                method: 'POST',
                url: restUrlV5 + 'pointProduct/orders/pay',
                data: data,
                headers: {
                    token: token,
                    cardId: cardId
                },
                dataType: "json"
            }).then(completed).catch(failed);
        }
        function goHeyTeaExchange(token,cardId,data) {
            return $http({
                method: 'POST',
                url: restUrl + 'point_exchange_gifts/add',
                data: data,
                headers: {
                    token: token,
                    cardId: cardId
                },
                dataType: "json"
            }).then(completed).catch(failed);
        }


        function pointProductwxPay(token,cardId,data) {
            return $http({
                method: 'POST',
                url: restUrlV5 + 'pointProduct/orders/wxPay',
                data: data,
                headers: {
                    token: token,
                    cardId: cardId
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
