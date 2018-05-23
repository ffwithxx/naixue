/**
 * Created by fengli on 2017/11/15.
 */

(function () {
    'use strict';

    angular
        .module('vk')
        .controller('BuyController', BuyController);

    /** @ngInject */
    BuyController.$inject = ['$location', 'UtilService', 'MyService', '$sessionStorage','LoginService','SessionStorageService',"$sce"];

    function BuyController($location, UtilService, MyService, $sessionStorage,LoginService,SessionStorageService,$sce) {
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var storeId = $sessionStorage.storeId;
        var vm = this;
        var gobackUrl = $location.search().urlStr;
        var theme = $sessionStorage.theme;
        vm.goBack = goBack;
        init()
        function init() {
            // if (cardId == "" || cardId == "null" || !cardId) {
            //     return
            // }
            LoginService.getStoreExplainRemark( storeId).then(function (data) {
                if (data.code != 200) {
                    alert(data.message);
                    return
                }

                vm.detail=  $sce.trustAsHtml( data.data);   ;
                //

            }, function (e) {
                //error msg
            });

        }
        function goBack() {
            $location.url('/loginByVKApi?storeId=' + storeId+ "&theme=" + theme);

        }

    }
})();
