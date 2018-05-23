(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaPointShopController', HeyTeaPointShopController);

    HeyTeaPointShopController.$inject = ['PointShopService', '$sessionStorage', '$location', 'lodash'];

    /** @ngInject */
    function HeyTeaPointShopController(PointShopService, $sessionStorage, $location, lodash) {
        var token = $sessionStorage.token;
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;

        var vm = this;
        vm.currentPoints = $sessionStorage.point || 0;
        vm.goConversionRecord = goConversionRecord;
        vm.goItemDetail = goItemDetail;
        vm.goBack = goBack;

        PointShopService.getMyPointInfo(token, cardId).then(function (data) {
            if (data.code != 200) {
                alert(data.message);
                return
            }
            vm.currentPoints = data.data.point;
            $sessionStorage.point = data.data.point;
        });

        PointShopService.getHeyTeaPointList(token, cardId, storeId).then(function (res) {
            vm.list = lodash.filter(res.data, function (each) {
                return each.num > 0;
            });
        });



        function goConversionRecord() {
            $location.url("/heytea-conversionRecord?storeId=" + storeId);
        }

        function goItemDetail(itemId) {
            $location.url("/heytea-conversionDetail?storeId=" + storeId + "&itemId=" + itemId);
        }

        function goBack() {
            $location.url("/heytea-my?storeId=" + storeId);
        }
    }
})();
