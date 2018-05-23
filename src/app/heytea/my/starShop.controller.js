/**
 * Created by fengli on 17/9/15.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyStarShopController', HeyStarShopController);

    /** @ngInject */
    HeyStarShopController.$inject = ['$location', 'UtilService', 'MyService', '$sessionStorage'];

    function HeyStarShopController($location, UtilService, MyService, $sessionStorage) {
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var storeId = $sessionStorage.storeId;
        var vm = this;
        vm.goBack = goBack;

        function goBack() {
            $location.url('/heytea-my?storeId=' + storeId);
        }
        var timeout ;
        $("#imgone").mousedown(function() {
            timeout = setTimeout(function() {
               // alert("11")
            }, 2000);
        });


    }
})();
