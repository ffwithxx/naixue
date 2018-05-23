(function () {
    'use strict';

    angular
        .module('vk')
        .controller('BarcodeController', BarcodeController);

    /** @ngInject */
    BarcodeController.$inject = ['$location', '$sessionStorage', 'JsBarcode'];

    function BarcodeController($location, $sessionStorage, JsBarcode) {
        var data = $location.search();
        var storeId = $sessionStorage.storeId;
        var vm = this;
        vm.barcode = data.barcode;
        vm.goBack = goBack;
        var urlParam = $location.search();
        var theme = urlParam.theme || $sessionStorage.theme;
        function goBack() {
            $location.url('/discountCoupon?storeId=' + storeId+"&theme=" + theme);
        }

        JsBarcode("#barcode")
            .CODE128(vm.barcode, {fontSize: 20, textMargin: 10, fontWeight: 500, textPosition: "top"})
            .render();
    }
})();
