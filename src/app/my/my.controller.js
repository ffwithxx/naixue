(function () {
    'use strict';

    angular
        .module('vk')
        .controller('MyController', MyController);

    MyController.$inject = ['$sessionStorage', '$location', 'JsBarcode', 'MyService', 'SessionStorageService', '$interval', '$scope',"LoginService"];

    /** @ngInject */
    function MyController($sessionStorage, $location, JsBarcode, MyService, SessionStorageService, $interval, $scope,LoginService) {
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var storeId = $sessionStorage.storeId;

        var vm = this;
        vm.name = $sessionStorage.memberName;
        vm.cardType = $sessionStorage.cardType || '普通卡';
        vm.cardId = $sessionStorage.cardId;
        vm.goDetailPage = goDetailPage;
        vm.showModule = showModule;
        vm.pointLabel = ( (storeId !== 4172)&&(storeId !== 5411)) ? '积分' : '里程'
        vm.pointValue = ( (storeId !== 4172)&&(storeId !== 5411)) ? vm.point : vm.experience
        vm.fukuanma=( (storeId !== 4172)&&(storeId !== 5411)) ? "付款码" : "会员码"
        vm.style = style;
        vm.isKOI = isKOI;
        vm.gobuy = gobuy;
        var urlParam = $location.search();
        var theme = urlParam.theme || $sessionStorage.theme;
        init();
        generateBarCode();

        function init() {
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            MyService.getMemberInfo(cardId, token).then(function (res) {
                vm.balance = res.data.balance || 0;
                vm.point = res.data.point || 0;
                vm.experience = res.data.experience || 0;
                vm.ticketsCount = res.data.ticketsCount || 0;
                vm.mobile = res.data.mobile;
                vm.levelName = res.data.levelName || '普通会员';
                var timestamp;
                if(res.data.activated == "null" || res.data.activated == "" ||!res.data.activated)
                {
                    timestamp = "";
                }else  {
                  timestamp = formatDateTime(res.data.activated);
                }



                SessionStorageService.setOneSessionStorage("activated", timestamp);
                SessionStorageService.setOneSessionStorage("discount", res.data.discount);
                SessionStorageService.setOneSessionStorage("point", res.data.point);
                SessionStorageService.setOneSessionStorage("couponsCount", res.data.couponsCount);
                var time = $sessionStorage.activated;
                if(res.data.background =="" ||res.data.background=="null"||!res.data.background){
                    vm.imgUrl = getBgByTheme();
                }else {
                    vm.imgUrl = res.data.background
                }

            }, function (e) {
                //error msg
            });
        }
        function formatDateTime(inputTime) {


            var date = new Date(inputTime);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
        };
        function showModule() {
          return ( (storeId !== 4172)&&(storeId !== 5411))
        }

        function isKOI() {
          return  (storeId === 4172)||(storeId === 5411)
        }

        function style() {
          var color = (storeId !== 376 && storeId !== 4172 && storeId !== 5411) ? '' : "#CC8E35"
          return {"color":color}
        }

        function generateBarCode() {
            if (!$sessionStorage.payCode) {
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
                    JsBarcode("#barcode1")
                        .CODE128C(data.data.code, {fontSize: 22, textMargin: 10, fontWeight: 500, width: 2.5})
                        .render();
                }, function (e) {
                    //error msg
                });
            } else {
                JsBarcode("#barcode1")
                    .CODE128C($sessionStorage.payCode, {fontSize: 22, textMargin: 0, fontWeight: 500, width: 2.5})
                    .render();
            }
        }

        function getBgByTheme(){
            var bg;
            if($sessionStorage.theme==='black'){
                bg = './assets/images/black/my-bg.png';
            }else {
                bg = './assets/images/VK/my-bg.png';
            }
            return bg;
        }

        function goDetailPage(url) {
            $location.url(url + '?storeId=' + $sessionStorage.storeId+ "&theme=" + theme);
        }
        function gobuy() {
            LoginService.getStoreExplainRemark( storeId).then(function (data) {
                if (data.code != 200) {
                    alert(data.message);
                    return
                }

                // vm.detail=data.data;
                if(data.data == "null" ||data.data == "" || !data.data){
                    return
                }else  {
                    // $location.url("/" + urlStr +"?storeId=" +storeId+"&theme=heytea");

                    $location.url("myBuy" + '?storeId=' + storeId +"&urlStr=" + "my"+ "&theme=" + theme);


                }

            }, function (e) {
                //error msg
            });
        }
        function refresh(){
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
                JsBarcode("#barcode1")
                    .CODE128C(data.data.code, {fontSize: 22, textMargin: 10, fontWeight: 500, width: 2.5})
                    .render();
            }, function (e) {
                //error msg
            });
        }

        //每三分钟更新一次
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
