(function () {
    'use strict';

    angular
        .module('vk')
        .controller('LoginByVKApiController', LoginByVKApiController);

    LoginByVKApiController.$inject = ['$rootScope', '$location', '$timeout', '$sessionStorage', 'LoginService', 'SessionStorageService','$interval',"$sce"];

    /** @ngInject */
    function LoginByVKApiController($rootScope, $location, $timeout, $sessionStorage, LoginService, SessionStorageService,$interval,$sce) {
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
            // window.alert('没有门店ID: ' + $location.absUrl())
            return;
        }

        if (!openId && angular.isUndefined($sessionStorage.debug) && !window.isDebug) {
            //console.log("没有openId,请通过微信重新登录");
            $location.url('/loginByWeChat?storeId=' + storeId + "&theme=" + theme );
            return;
        }

        if (angular.isDefined(theme)) {
            $rootScope.theme = theme;
            SessionStorageService.setOneSessionStorage("theme", theme);
        } else {
            $rootScope.theme = 'default';
            SessionStorageService.setOneSessionStorage("theme", 'default');
        }
        SessionStorageService.setOneSessionStorage("storeId", storeId);

        var vm = this;
        vm.showRes = true;
        // if (storeId == 3925){
        // vm.showRes = false;
        // }
        vm.msg = {
            warning: false,
            message: ''
        };
        vm.login = login;
        vm.goRegister = goRegister;
        vm.forgetPwd = forgetPwd;
        var waitSec = 60;
        var vCodeWait = waitSec;
        vm.vcodeStr = "获取验证码";
        vm.getVcode = getVcode;
       // vm.loginMai=loginMai;
        vm.gobuy = gobuy;
        var otherMobileNum = "";
        if (storeId==0 && otherMobileNum){
            vm.show=true;
        }else {
            vm.show=false;
        }
      function gobuy() {
    // $location.url("myBuy" + '?storeId=' + storeId +"&urlStr=" + "loginByVKApi");
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
            $location.url('/Buy?storeId=' + storeId +"&theme=" + theme);



        }

    }, function (e) {
        //error msg
    });

}
first();
function first() {
    LoginService.getStoreConfig( storeId).then(function (data) {
        if (data.code != 200) {
            alert(data.message);
            return
        }
         //showRes

       var APPIGNORE_REGISTER = data.data.APPIGNORE_REGISTER;
        if (APPIGNORE_REGISTER == 1) {
            vm.showRes = false;
        }


    }, function (e) {
        //error msg
    });
}

        function countDown() {
            var timePromise = $interval(function () {
                if (vCodeWait <= 0) {
                    $interval.cancel(timePromise);
                    timePromise = undefined;
                    vCodeWait = waitSec;
                    vm.vcodeStr = "重新发送";
                    vm.vcodeCss = "";
                } else {
                    vm.vcodeStr = "重发(" + vCodeWait + ")";
                    vCodeWait--;
                    vm.vcodeCss = "my_greyout";
                }
            }, 1000, 100);

        }

        function getVcode() {
            if (!vm.otherMobile) {
                vm.msg.warning = true;
                vm.msg.message = "请输入手机号";
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return;
            }

            if (vCodeWait < waitSec) {
                return
            }

            LoginService.getVcode(storeId, vm).then(function (data) {
                if (data.code != 200) {
                    vm.msg.warning = true;
                    vm.msg.message = data.message;
                    $timeout(function () {
                        vm.msg.warning = false;
                        vm.msg.message = '';
                    }, 2000);
                    return;
                }
                countDown();
            }, function (e) {
                alert(e.message);
            });
        }
        if (mobile && pwd && redirect) {
            doLogin(mobile, pwd, redirect);
        }


        function doLogin(mobile, pwd,otherMobile,mobileCode, redirect) {
            var params = {mobile: mobile, password: pwd, openId: openId};
            // if (storeId == 0) {
            //     // params.othermobie = otherMobile;
            //     // params.mobilecode = mobileCode;
            //     params = {
            //         mobile: mobile,
            //         password: pwd,
            //         openId: openId,
            //         othermobie: otherMobile,
            //         mobilecode: mobileCode
            //     };
                // checkmobileByCard
                // if (!otherMobileNum) {
                //     if(cardId =="" ||cardId=="null"||!cardId){
                //         return
                //     }
                //     LoginService.checkmobileByCard(storeId, params).then(function (data) {
                //         if (data.code != 200) {
                //             otherMobileNum=true;
                //             vm.show =true;
                //             return;
                //         }
                //
                //   loginMai(params);
                //     }, function (e) {
                //         // vm.msg.warning = true;
                //         // vm.msg.message = '账号/密码输入错误';
                //         // $timeout(function () {
                //         //     vm.msg.warning = false;
                //         //     vm.msg.message = '';
                //         // }, 2000);
                //     });
                //
                // } else {
                //    loginMai(params);
                // }
            // }else {
                // if(cardId =="" ||cardId=="null"||!cardId){
                //     return
                // }
                LoginService.loginByVKApi(storeId, params).then(function (data) {
                    if (data.code != 200) {

                        if (data.code == 1351 || data.code == 1356) {
                            SessionStorageService.setOneSessionStorage("dengLuID", mobile);
                            SessionStorageService.setOneSessionStorage("pwd", pwd);
                            $location.url('/activation?storeId=' + storeId+"&type="+"login"+"&theme=" + theme);
                            return

                        }
                        if (redirect) {
                            $location.url(redirect + '?storeId=' + storeId +"&theme=" + theme +"&theme=" + theme+"&message=" + data.message);
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
                    SessionStorageService.setOneSessionStorage("token", data.token);
                    SessionStorageService.setOneSessionStorage("levelName", data.data.levelName);
                    SessionStorageService.setOneSessionStorage("discount", data.data.discount);
                    SessionStorageService.setOneSessionStorage("name", data.data.name);
                    SessionStorageService.setOneSessionStorage("couponsCount", data.data.couponsCount);
                    var timestamp = formatDateTime(data.data.activated);
                    SessionStorageService.setOneSessionStorage("activated", timestamp);
                    SessionStorageService.setAllSessionStorage(data.data, function (res) {
                        $sessionStorage.memberName = $sessionStorage.name;
                        $sessionStorage.activated = timestamp;
                    });

                    var url = $sessionStorage.redirectUrl;
                    if (url != "/my_recharge" && url != "/myPayCode" && url != "/shopping" && url != "/pointShop") {
                        url = "";
                    }
                    if (url) {
                        $location.url(url + '?storeId=' + storeId +"&theme=" + theme);
                    } else {
                        $location.url('/my?storeId=' + storeId +"&theme=" + theme);
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
        // }
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
        // function loginMai(params) {
        //
        //     var params = params;
        //     // if(cardId =="" ||cardId=="null"||!cardId){
        //     //     return
        //     // }
        //     LoginService.loginmaiByVKApi(storeId, params).then(function (data) {
        //         if (data.code != 200) {
        //
        //             if (redirect) {
        //                 $location.url(redirect + '?storeId=' + storeId + "&message=" + data.message);
        //                 return
        //             }
        //
        //             vm.msg.warning = true;
        //             vm.msg.message = data.message;
        //             $timeout(function () {
        //                 vm.msg.warning = false;
        //                 vm.msg.message = '';
        //             }, 2000);
        //             return;
        //         }
        //         SessionStorageService.setOneSessionStorage("cardId", data.cardId);
        //         SessionStorageService.setOneSessionStorage("token", data.token);
        //         SessionStorageService.setOneSessionStorage("levelName", data.data.levelName);
        //         SessionStorageService.setOneSessionStorage("discount", data.data.discount);
        //         SessionStorageService.setOneSessionStorage("couponsCount", data.data.couponsCount);
        //         var timestamp = formatDateTime(data.data.activated);
        //         SessionStorageService.setOneSessionStorage("activated", timestamp);
        //         SessionStorageService.setAllSessionStorage(data.data, function (res) {
        //             $sessionStorage.memberName = $sessionStorage.name;
        //             $sessionStorage.activated = timestamp;
        //         });
        //
        //
        //         var url = $sessionStorage.redirectUrl;
        //         if (url != "/my_recharge" && url != "/myPayCode" && url != "/shopping" && url != "/pointShop") {
        //             url = "";
        //         }
        //         if (url) {
        //             $location.url(url + '?storeId=' + storeId);
        //         } else {
        //             $location.url('/my?storeId=' + storeId);
        //         }
        //
        //     }, function (e) {
        //         // vm.msg.warning = true;
        //         // vm.msg.message = '账号/密码输入错误';
        //         // $timeout(function () {
        //         //     vm.msg.warning = false;
        //         //     vm.msg.message = '';
        //         // }, 2000);
        //     });
        //
        // }
        function login() {
            if (storeId == 0 && otherMobileNum){

                if (!vm.otherMobile || !vm.vcode||!vm.mobile || !vm.pwd ) {
                    vm.msg.warning = true;
                    vm.msg.message = '请填入所有信息';
                    $timeout(function () {
                        vm.msg.warning = false;
                        vm.msg.message = '';
                    }, 2000);
                    return;
                }
            }
            else {
                if (!vm.mobile || !vm.pwd) {
                    vm.msg.warning = true;
                    vm.msg.message = '账号密码不能为空';
                    $timeout(function () {
                        vm.msg.warning = false;
                        vm.msg.message = '';
                    }, 2000);
                    return;
                }

            }
            doLogin(vm.mobile, vm.pwd,vm.otherMobile,vm.vcode);

        }

        function goRegister() {
            if(storeId==4617){
                vm.msg.warning = true;
                vm.msg.message = '此门店无注册权限';
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return;
                return

            }
            $location.url('/register?storeId=' + storeId + "&theme=" + theme);
        }

        function forgetPwd() {
            $location.url('/forgetPwd?storeId=' + storeId + "&theme=" + theme);
        }
    }
})();
