(function () {
    'use strict';

    angular
        .module('vk')
        .controller('LoginByVKApiHeyTeaController', LoginByVKApiHeyTeaController);

    LoginByVKApiHeyTeaController.$inject = ['$rootScope', '$location', '$timeout', '$sessionStorage', 'LoginService', 'SessionStorageService'];

    /** @ngInject */
    function LoginByVKApiHeyTeaController($rootScope, $location, $timeout, $sessionStorage, LoginService, SessionStorageService) {
        document.title = "奈雪の茶";
        var urlParam = $location.search();
        var storeId = urlParam.storeId || $sessionStorage.storeId;
        var theme = urlParam.theme || $sessionStorage.theme;

        var openId = $sessionStorage.weChatOpenId;
        var mobile = urlParam.mobile;
        var pwd = urlParam.pwd;
        var redirect = urlParam.redirect;
        SessionStorageService.setOneSessionStorage("dengLuID", "");
        SessionStorageService.setOneSessionStorage("pwd", "");
        if (!storeId) {
            $location.url('/noStoreId');
            return;
        }
       //  $("input").focus(function(){
       //      $("#bottomBth").css("display","none");
       //  });
       //
       // $("input").blur(function(){
       //     $("#bottomBth").css("display","block");
       //
       // })

        var winHeight = $(window).height();
        var winWidth= $(window).width();
         var ishiddle ;
        $(window).resize(function(){
            var thisHeight=$(this).height();
            if(winHeight - thisHeight >50){
                //窗口发生改变(大),故此时键盘弹出
                //当软键盘弹出，在这里面操作

                if (ishiddle == "1" || !ishiddle){

                    $("#bottomBth").css("display","none");

                    ishiddle = "2";

                }
            }else{

                //窗口发生改变(小),故此时键盘收起
                //当软键盘收起，在此处操作
                if (ishiddle == "2") {

                    $("#bottomBth").css("display","block");
                    ishiddle = "1";
                }
                // alert(ishiddle);

            }
        });

        var screeHei = window.screen.height;
        var screeWidth = window.screen.width;
        var oneWidth = (screeHei /1215)*screeWidth;
        var leftWidth = (screeWidth - oneWidth) /2;
        // document.getElementById("one").style.width = oneWidth +"px";
        // document.getElementById("one").style.left = leftWidth +"px";
        // $("#one").css("right",200 +"px");

        if (!openId && angular.isUndefined($sessionStorage.debug) && !window.isDebug) {
            // console.log("没有openId,请通过微信重新登录");
            $location.url('/login?storeId=' + storeId);
            return;
        }

        if (angular.isDefined(theme)) {
            $rootScope.theme = theme;
            SessionStorageService.setOneSessionStorage("theme", theme);
        } else {
            $rootScope.theme = 'heytea';
            SessionStorageService.setOneSessionStorage("theme", 'heytea');
        }
        SessionStorageService.setOneSessionStorage("storeId", storeId);

        var vm = this;
        vm.msg = {
            warning: false,
            message: ''
        };
        vm.login = login;
        vm.goRegister = goRegister;
        vm.forgetPwd = forgetPwd;
        vm.goBuy = goBuy;

        if (mobile && pwd && redirect) {
            doLogin(mobile, pwd, redirect);
        }


        function doLogin(mobile, pwd, redirect) {
            var params = {mobile: mobile, password: pwd, openId: openId};
            LoginService.loginHeyteaByVKApi(storeId, params).then(function (data) {
                if (data.code != 200) {
                    if (data.code == 1351 || data.code == 1356) {
                        SessionStorageService.setOneSessionStorage("dengLuID", mobile);
                        SessionStorageService.setOneSessionStorage("pwd", pwd);
                        $location.url('/heytea-register?storeId=' + storeId);
                        return

                    }
                    if (redirect) {
                        $location.url(redirect + '?storeId=' + storeId + "&message=" + data.message);
                        return
                    }
                    vm.msg.warning = true;
                    vm.msg.message = data.message;
                    $timeout(function () {
                        vm.msg.warning = false;
                        vm.msg.message = '';
                    }, 2000);
                    return;
                }
                SessionStorageService.setOneSessionStorage("cardId", data.cardId);
                SessionStorageService.setOneSessionStorage("levelId", data.levelId);
                SessionStorageService.setOneSessionStorage("token", data.token);
                SessionStorageService.setOneSessionStorage("levelName", data.data.levelName);
                SessionStorageService.setOneSessionStorage("experience", data.data.experience);
                var timestamp = formatDateTime(data.data.activated);
                SessionStorageService.setOneSessionStorage("activated", timestamp);
// 2014年6月18日 上午10:33:24

                SessionStorageService.setAllSessionStorage(data.data, function (res) {
                    $sessionStorage.memberName = $sessionStorage.name;
                    $sessionStorage.activated = timestamp;
                });
                // SessionStorageService.setOneSessionStorage("activated", timestamp);
                var url = $sessionStorage.redirectUrl;
                if (url != "/heytea-myPayCode" && url != "/heytea-pointShop") {
                    url = "";
                }
                if (url) {
                    $location.url(url + '?storeId=' + storeId);
                } else {
                    $sessionStorage.showSplash = true;
                    $sessionStorage.showagreeMent = true;
                    $location.url('/heytea-my?storeId=' + storeId);
                }

            }, function (e) {
                // vm.msg.warning = true;
                // vm.msg.message = '账号/密码输入错误';
                // $timeout(function () {
                //     vm.msg.warning = false;
                //     vm.msg.message = '';
                // }, 2000);
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
        function login() {
            if (!vm.mobile || !vm.pwd) {
                vm.msg.warning = true;
                vm.msg.message = '账号密码不能为空';
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return;
            }
            doLogin(vm.mobile, vm.pwd);
        }

        function goRegister() {
            $location.url('/heytea-register?storeId=' + storeId);
        }
        function goBuy() {
            $location.url('/heytea-buy?storeId=' + storeId + "&remark=" + "loginByVKApiHeyTea");
        }
        function forgetPwd() {
            $location.url('/heytea-forgetPwd?storeId=' + storeId);
        }
    }
})();
