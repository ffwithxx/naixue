(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaIntegralController', HeyTeaIntegralController);

    /** @ngInject */
    HeyTeaIntegralController.$inject = ['$location', '$sessionStorage', 'ApiService', 'lodash','PointShopService'];

    function HeyTeaIntegralController($location, $sessionStorage, ApiService, lodash,PointShopService) {
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;
        var token = $sessionStorage.token;

        var vm = this;
        vm.list = [];
        vm.goBack = goBack;

        getTradeList();

        function goBack() {
            $location.url("/heytea-myExperience?storeId=" + storeId);
        }

        function getTradeList() {
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            PointShopService.getMyPointsRecords(cardId, token).then(function (data) {
                if (data.code != 200) {
                    alert(data.message);
                    // vm.msg.warning = true;
                    // vm.msg.message = data.message;
                    // $timeout(function () {
                    //     vm.msg.warning = false;
                    //     vm.msg.message = '';
                    // }, 2000);
                    return;
                }


                vm.list = data.data

            });
        }
    }
})();
