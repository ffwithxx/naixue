/**
 * Created by fengli on 17/4/20.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .controller('DiscountCouponDetailController', DiscountCouponDetailController);

    DiscountCouponDetailController.$inject = ['$location', '$sessionStorage', 'MyService'];

    /** @ngInject */
    function DiscountCouponDetailController($location, $sessionStorage, MyService) {
        var storeId = $sessionStorage.storeId;
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var desStr = $sessionStorage.discountRemark;

        desStr = desStr.replace(/\~/g, "&");
        var urlParam = $location.search();
        var theme = urlParam.theme || $sessionStorage.theme;
        var vm =this;
        vm.ISshare=urlParam.ishare;
        vm.detail=desStr;
        vm.goBack=goBack;
        vm.share=share;
        function goBack() {
            $location.url('discountCoupon' + '?storeId=' + $sessionStorage.storeId+"&theme=" + theme);
        }
        function share() {
            // $location.url('/discountCouponDetail?storeId=' + storeId
            //     + "&remark=" + pStr+ "&title=" + p.name +"&time=" +timeStr+ "&barcode=" + p.code +"&url=" +p.url+"&ishare=" +p.isShare);

            $location.url('/couponRedemption?storeId=' + storeId
                + "&remark=" + urlParam.remark+ "&title=" + urlParam.title +"&time=" +urlParam.time+ "&barcode=" + urlParam.barcode +"&url=" +urlParam.url+"&ishare=" +urlParam.ishare
            );
        }

    }
})();


