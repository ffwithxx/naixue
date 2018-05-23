/**
 * Created by fengli on 17/4/21.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyteaDiscountDetailController', HeyteaDiscountDetailController);

    HeyteaDiscountDetailController.$inject = ['$location', '$sessionStorage', 'MyService'];

    /** @ngInject */
    function HeyteaDiscountDetailController($location, $sessionStorage, MyService) {
        var storeId = $sessionStorage.storeId;
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var desStr =$sessionStorage.discountRemark;;
        var titleStr = $location.search().title;
        var timeStr = $location.search().time;
        var url = $location.search().url;
        var isshare = $location.search().ishare;
        var url =  $location.search().url;
        var vm =this;
        vm.detail=desStr;
        vm.bagImg = url||"./assets/images/newHey/map.png"

        // bgimg

        var s = document.getElementById("bagImg");
        var w = s.offsetWidth; //宽度
        var x = 62*w/100;
        document.getElementById("bagImg").style.height = x +"px";

        vm.title = titleStr;
        vm.time = timeStr;
        vm.goBack=goBack;
        function goBack() {
            $location.url('heytea-discount' + '?storeId=' + $sessionStorage.storeId);
        }


    }
})();
