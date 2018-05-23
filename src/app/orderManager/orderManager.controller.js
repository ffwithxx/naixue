(function () {
    'use strict';

    angular
        .module('vk')
        .controller('OrderManagerController', OrderManagerController);

    OrderManagerController.$inject = ['$location', '$sessionStorage', 'SessionStorageService', 'ApiService', 'orderTypeService'];

    /** @ngInject */
    function OrderManagerController($location, $sessionStorage, SessionStorageService, ApiService, orderTypeService) {
        if (!$sessionStorage.weChatOpenId) {
          SessionStorageService.setOneSessionStorage("weChatOpenId", 'oTUIst9UHGB3P2ogdN69Ms6NJKu0');
        }

        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;
        var token = $sessionStorage.token;
        var orderType = $location.search().orderType;
        var orderId;
        var urlParam = $location.search();
        var theme = urlParam.theme || $sessionStorage.theme;
        var vm = this;
        var backOrderType = orderTypeService.getOrderType();
        vm.active = 'one';
        vm.star = 5;
        vm.showStarDialog = false;
        vm.setStar = setStar;
        vm.saveStar = saveStar;
        vm.closeStar = closeStar;
        vm.openEvaluate = openEvaluate;
        vm.switchTab = switchTab;
        vm.goBack = goBack;
        vm.goOrderDetail = goOrderDetail;
        vm.isPosSeq = isPosSeq;

        backOrderType = 2;
        if (angular.isDefined(backOrderType) && backOrderType != null) {
            console.log(backOrderType)
            if (backOrderType == 1) {
                vm.active = 'one';
            } else if (backOrderType == 0) {
                vm.active = 'two';
            } else {
                vm.active = 'three';
            }
            getOrderList(backOrderType);
        }

        if (angular.isDefined(orderType)) {
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            orderTypeService.setOrderType(orderType);
            if (orderType == 1) {
                vm.active = 'one';
            } else if (orderType == 0) {
                vm.active = 'two';
            } else {
                vm.active = 'three';
            }
            getOrderList(orderType);
        } else {
            getOrderList(1);
        }

        function isPosSeq(posSeq) {
          if (posSeq === 'undefined' || posSeq === 'null' || posSeq.length === '') {
            return false;
          }
          return true;
        }

        function saveStar() {
            var params = {orderId: orderId, starLevel: vm.star, content: ''};
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            ApiService.assessOrder(params).then(function () {
                vm.showStarDialog = false;
                switchTab(vm.active);
            });
            vm.showStarDialog = false;
        }

        function openEvaluate(id) {
            orderId = id;
            vm.showStarDialog = true;
        }

        function closeStar() {
            vm.showStarDialog = false;
        }

        function setStar(n) {
            vm.star = n;
        }

        function switchTab(tab) {
            vm.list = [];
            vm.active = tab;
            //filter data
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            if (tab === 'one') {
                orderTypeService.setOrderType(1);
                getOrderList(1);
            } else if (tab === 'two') {
                orderTypeService.setOrderType(0);
                getOrderList(0);
            } else {
                orderTypeService.setOrderType(2);
                getOrderList(2);
            }
        }

        function goBack() {
            $location.url("/my?storeId=" + storeId+ "&theme=" + theme);
        }

        function getOrderList(orderType) {
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            ApiService.getOrderList($sessionStorage.cardId, $sessionStorage.token, $sessionStorage.weChatOpenId, $sessionStorage.storeId, orderType).then(function (res) {
                vm.list = res.data;
            });
        }

        function goOrderDetail(obj) {
            $location.url("/orderDetail?storeId=" + storeId + "&orderId=" + obj.id+ "&theme=" + theme);
        }

    }
})();
