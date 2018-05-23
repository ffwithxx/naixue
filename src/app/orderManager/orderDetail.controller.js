(function () {
    'use strict';

    angular
        .module('vk')
        .controller('OrderDetailController', OrderDetailController);

    OrderDetailController.$inject = ['$scope', '$location', '$sessionStorage', 'ApiService'];

    /** @ngInject */
    function OrderDetailController($scope, $location, $sessionStorage, ApiService) {
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;
        var token = $sessionStorage.token;
        var orderId;

        var vm = this;
        vm.star = 5;
        vm.showStarDialog = false;
        vm.setStar = setStar;
        vm.goBack = goBack;
        vm.orderAgain = orderAgain;
        vm.openEvaluate = openEvaluate;
        vm.saveStar = saveStar;
        vm.closeStar = closeStar;
        var urlParam = $location.search();
        var theme = urlParam.theme || $sessionStorage.theme;
        init();

        function init() {
            orderId = $location.search().orderId;
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            ApiService.getOrderById(cardId, token, orderId).then(function (data) {
                if (data.data.length > 0) {
                    vm.d = data.data[0];
                }
            });
        }


        function setStar(n) {
            vm.star = n;
        }

        function openEvaluate() {
            vm.showStarDialog = true;
        }

        function orderAgain() {
            // TODO
        }

        function saveStar() {
            var params = {orderId: orderId, starLevel: vm.star, content: ''};
            ApiService.assessOrder(params).then(function () {
                vm.showStarDialog = false;
                vm.d.commentNum = 1;
            });
            vm.showStarDialog = false;
        }

        function closeStar() {
            vm.showStarDialog = false;
        }

        function goBack() {
            $location.url("/orderManager?storeId=" + storeId+ "&theme=" + theme);
        }
    }
})();
