(function () {
    'use strict';

    angular
        .module('vk')
        .controller('myPayCodeController', myPayCodeController);

    /** @ngInject */
    myPayCodeController.$inject = ['$interval', '$location', '$sessionStorage', 'MyService', 'JsBarcode', 'SessionStorageService','$scope'];

    function myPayCodeController($interval, $location, $sessionStorage, MyService, JsBarcode, SessionStorageService,$scope) {
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var storeId = $sessionStorage.storeId;
        var urlParam = $location.search();
        var theme = urlParam.theme || $sessionStorage.theme;
        var vm = this;
        vm.fukuanma="付款码";
        vm.refresh = refresh;
        vm.goBack = goBack;
        if (storeId==4172 || storeId == 5411){
        vm.fukuanma="会员码";
        }
        function goBack() {
            $location.url('/my?storeId=' + storeId+ "&theme=" + theme);
        }

        function refresh() {

            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            MyService.getPayCode(cardId, token).then(function (data) {
                if (data.code != 200) {
                    // alert(data.message);
                    return
                }
                vm.qrcode = data.data.code;
                SessionStorageService.setOneSessionStorage("payCode", data.data.code);
                // if(!document.getElementById("barcode2")){
                //     return
                // }
                JsBarcode("#barcode2")
                    .CODE128C(data.data.code, {fontSize: 20, textMargin: 10, fontWeight: 500, textPosition: "top"})
                    .render();
            }, function (e) {
                //error msg
            });
        }

        //每三分钟更新一次
        if(cardId =="" ||cardId=="null"||!cardId){
            return
        }
        refresh();
        var timer = $interval(function () {
                refresh()
            }
            , 180000
        );
        $scope.$on('$destroy', function (evt) {
            $interval.cancel(timer);
        });
    }
})();
