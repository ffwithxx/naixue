/**
 * Created by fengli on 17/8/1.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaBuyController', HeyTeaBuyController);

    /** @ngInject */
    HeyTeaBuyController.$inject = ['$location', 'UtilService', 'MyService', '$sessionStorage','LoginService',"$sce"];

    function HeyTeaBuyController($location, UtilService, MyService, $sessionStorage,LoginService,$sce) {
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var storeId = $sessionStorage.storeId;
        var vm = this;
        var urlStr = $location.search().remark;
        vm.goBack = goBack;
        init()
        function init() {
            // if (cardId == "" || cardId == "null" || !cardId) {
            //     return
            // }
            MyService.getUserRule(storeId).then(function (res) {
                // alert(res);

                vm.detail =  $sce.trustAs($sce.RESOURCE_URL,res.largevalue);;
                // alert(vm.detail);

            }, function (e) {
                //error msg
            });;

        }
        function goBack() {

            $location.url("/" + urlStr +"?storeId=" +storeId+"&theme=heytea");
        }

    }
})();
