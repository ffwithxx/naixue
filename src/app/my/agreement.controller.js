/**
 * Created by fengli on 17/8/3.
 */
// AgreementController

(function () {
    'use strict';

    angular
        .module('vk')
        .controller('AgreementController', AgreementController);

    /** @ngInject */
    AgreementController.$inject = ['$location', 'UtilService', 'MyService', '$sessionStorage','LoginService',"$sce"];

    function AgreementController($location, UtilService, MyService, $sessionStorage,LoginService,$sce) {
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var storeId = $sessionStorage.storeId;
        var vm = this;
        var theme = $sessionStorage.theme;
        var type = $location.search().type;
        vm.goBack = goBack;
        init()
        function init() {
            // if (cardId == "" || cardId == "null" || !cardId) {
            //     return
            // }
            MyService.getUserRule(storeId).then(function (res) {
                // alert(res);
                var arr = res.largevalue.split("span>");
                var arrone = arr[1].split("</");
                 console.log(arrone);
                vm.detail =  $sce.trustAsResourceUrl(arrone[0]);
            }, function (e) {
                //error msg
            });;

        }
        function goBack() {
            if (type == "activation"){
                $location.url("/activation"  +"?storeId=" +storeId+"&theme=" +theme);
            }else {
                $location.url("/register"  +"?storeId=" +storeId+"&theme=" +theme);
            }

        }

    }
})();
