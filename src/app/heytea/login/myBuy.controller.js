/**
 * Created by fengli on 17/7/25.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaMyBuyController', HeyTeaMyBuyController);

    /** @ngInject */
    HeyTeaMyBuyController.$inject = ['$location', 'UtilService', 'MyService', '$sessionStorage','LoginService'];

    function HeyTeaMyBuyController($location, UtilService, MyService, $sessionStorage,LoginService) {
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var storeId = $sessionStorage.storeId;
        var vm = this;

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
vm.detail = data.data;



            }, function (e) {
                //error msg
            });

        }
        function goBack() {
            $location.url('/loginByVKApiHeyTea?storeId=' + storeId);
        }

    }
})();
