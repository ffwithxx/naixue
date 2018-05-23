/**
 * Created by fengli on 2018/1/4.
 */
(function () {
    'use strict';

    angular
        .module('vk')
        .controller('ActivationController', ActivationController);

    /** @ngInject */
    ActivationController.$inject = ['$interval', '$timeout', '$location', 'RegisterService', '$sessionStorage','SessionStorageService','LoginService',"$window","$scope"];

    function ActivationController($interval, $timeout, $location, RegisterService, $sessionStorage,SessionStorageService,LoginService,$window,$scope) {
        var waitSec = 60;
        //要复制的
        var send = "false";
        var  csessionid;
        var  sig;
        var tokenStr;
        var scene;
        //到这
        var vCodeWait = waitSec;
        var urlParam = $location.search();
        var storeId = urlParam.storeId || $sessionStorage.storeId;
        var openId = $sessionStorage.weChatOpenId;
        var vm = this;
        vm.msg = {
            warning: false,
            message: ''
        };
        vm.vcodeTitle = "获取验证码";
        vm.checked = true;
        vm.getVcode = getVcode;
        vm.submit = submit;
        vm.goBack = goBack;
        vm.goBuy = goBuy;
        vm.doLogin = doLogin;
        var type = $location.search().type;
        vm.vcardNum = $sessionStorage.dengLuID || "" ;
        vm.vpwd = $sessionStorage.pwd || "";

        // alert("生日信息一经设置无法修改，请谨慎选择！");
        function goBack() {
            $location.url('/loginByVKApi?storeId=' + storeId);
        }
        function goBuy() {
            $location.url('/agreement?storeId=' + storeId+"&type="+"activation");
        }
        if (!openId && angular.isUndefined($sessionStorage.debug) && !window.isDebug) {
            //console.log("没有openId,请通过微信重新登录");
            SessionStorageService.setOneSessionStorage("redirectUrl", $location.path());
            $location.url('/loginByWeChat?storeId=' + storeId);
            return;
        }
        setTimeout(function () {
            alert("生日信息一经设置无法修改，请谨慎选择！")
        }, 1000);

        function countDown() {
            var timePromise = $interval(function () {
                if (vCodeWait <= 0) {
                    $interval.cancel(timePromise);
                    timePromise = undefined;
                    vCodeWait = waitSec;
                    vm.vcodeTitle = "重新发送";
                    vm.vcodeCss = "";
                } else {
                    vm.vcodeTitle = "重发(" + vCodeWait + ")";
                    vCodeWait--;
                    vm.vcodeCss = "my_greyout";
                }
            }, 1000, 100);

        }

        function getVcode() {
            if (!vm.mobile) {
                vm.msg.warning = true;
                vm.msg.message = "请输入手机号";
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return;
            }
            //要复制的
            if (send == "false"){
                vm.msg.warning = true;
                vm.msg.message = "请先进行滑动校验！";
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);

                return;
            }

            //这
            if (vCodeWait < waitSec) {
                return
            }

            RegisterService.getVcode(storeId, vm.mobile,csessionid,sig,tokenStr,scene).then(function (data) {
                if (data.code != 200) {
                    vm.msg.warning = true;
                    vm.msg.message = data.message;
                    $timeout(function () {
                        vm.msg.warning = false;
                        vm.msg.message = '';
                    }, 2000);
                    $timeout(function () {
                        $scope.reloadRoute();
                    }, 3000);

                    return;
                }
                countDown();
            }, function (e) {
                alert(e.message);
            });
        }

        function submit() {
            if (!vm.mobile || !vm.vcode || !vm.birthday || !vm.name || !vm.gender || !vm.vcardNum ||!vm.vpwd) {
                vm.msg.warning = true;
                vm.msg.message = '请填写所有星号项';
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return
            }
            if (vm.vpwd.length != 6) {
                vm.msg.warning = true;
                vm.msg.message = '密码只能为6位数字';
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return
            }
            if (!vm.checked) {
                vm.msg.warning = true;
                vm.msg.message = '您还未同意相关条款';
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return
            }


            var y = vm.birthday.getFullYear();
            var m = vm.birthday.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            var d = vm.birthday.getDate();
            d = d < 10 ? ('0' + d) : d;
            // vm.birthday = [y, m, d].join("-");
            var  bir = [y, m, d].join("-");
            var pra = {
                "mobile":vm.mobile,
                "vcode":vm.vcode,
                "birthday":bir,
                "name":vm.name,
                "gender":vm.gender,
                "vcardNum":vm.vcardNum,
                "vpwd":vm.vpwd,


            }
            RegisterService.register(storeId, pra).then(function (data) {
                if (data.code != 200) {
                    vm.msg.warning = true;
                    vm.msg.message = data.message;
                    $timeout(function () {
                        vm.msg.warning = false;
                        vm.msg.message = '';
                    }, 2000);
                    return;
                }
                doLogin(vm.vcardNum, vm.vpwd);

            }, function (e) {
                alert(e.message);
            });


        }


        function doLogin(mobile, pwd,otherMobile,mobileCode, redirect) {
            var params = {mobile: mobile, password: pwd, openId: openId};

            LoginService.loginByVKApi(storeId, params).then(function (data) {
                if (data.code != 200) {

                    if (data.code == 1351 || data.code == 1356) {
                        SessionStorageService.setOneSessionStorage("dengLuID", mobile);
                        SessionStorageService.setOneSessionStorage("pwd", pwd);
                        $location.url('/activation?storeId=' + storeId);
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
                SessionStorageService.setOneSessionStorage("token", data.token);
                SessionStorageService.setOneSessionStorage("levelName", data.data.levelName);
                SessionStorageService.setOneSessionStorage("discount", data.data.discount);
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
                    $location.url(url + '?storeId=' + storeId);
                } else {
                   if (type =="myAcountSetting" ){
                       $location.url('/myAcountSetting?storeId=' + storeId);
                   }else {
                       $location.url('/my?storeId=' + storeId);
                   }

                }

            }, function (e) {

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
        var nc = new noCaptcha();
        var nc_appkey = 'FFFF00000000017A69F4';  // 应用标识,不可更改
        var nc_scene = 'register';  //场景,不可更改
        var nc_token = [nc_appkey, (new Date()).getTime(), Math.random()].join(':');
        var nc_option = {
            renderTo: '#dom_id',//渲染到该DOM ID指定的Div位置
            appkey: nc_appkey,
            scene: nc_scene,
            token: nc_token,
            //   trans: '{"name1":"code100"}',//测试用，特殊nc_appkey时才生效，正式上线时请务必要删除；code0:通过;code100:点击验证码;code200:图形验证码;code300:恶意请求拦截处理
            callback: function (data) {// 校验成功回调
                console.log(data.csessionid);
                console.log(data.sig);
                console.log(nc_token);

                document.getElementById('csessionid').value = data.csessionid;
                document.getElementById('sig').value = data.sig;
                document.getElementById('token').value = nc_token;
                document.getElementById('scene').value = nc_scene;
                send = "true";
                csessionid = data.csessionid;
                sig =  data.sig;
                tokenStr = nc_token;;
                scene = nc_scene;;
            }
        };
        nc.init(nc_option);

        $scope.reloadRoute = function () {
            $window.location.reload();

        };

    }
})();
