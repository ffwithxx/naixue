(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaConversionRecordController', HeyTeaConversionRecordController);

    HeyTeaConversionRecordController.$inject = ['$location', '$sessionStorage', 'PointShopService'];

    /** @ngInject */
    function HeyTeaConversionRecordController($location, $sessionStorage, PointShopService) {
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;
        var token = $sessionStorage.token;
        var orderId;

        var vm = this;
        vm.goBack = goBack;
        if(cardId =="" ||cardId=="null"||!cardId){
            return
        }
        PointShopService.getHeyTeaRecordList(token,cardId).then(function (res) {
            vm.list = res.data;
        }, function (e) {
            vm.list = [];
        });

        function goBack() {
            $location.url("/heytea-pointShop?storeId=" + storeId);
        }
    }
})();
