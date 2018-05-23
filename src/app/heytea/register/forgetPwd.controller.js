(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaForgetPwdController', HeyTeaForgetPwdController);

    /** @ngInject */
    HeyTeaForgetPwdController.$inject = ['$interval', '$location', '$sessionStorage', 'lodash', 'ForgetPwdService', 'MyService', 'UtilService', '$timeout'];

    function HeyTeaForgetPwdController($interval, $location, $sessionStorage, lodash, ForgetPwdService, MyService, UtilService, $timeout) {
        var storeId = $sessionStorage.storeId;
        var waitSec = 60;
        var send = "false";
        var  csessionid;
        var  sig;
        var tokenStr;
        var scene;
        var vCodeWait = waitSec;

        var vm = this;
        vm.msg = {
            warning: false,
            message: ''
        };
        vm.vcodeTitle = "发送验证码";
        vm.getVcode = getVcode;
        vm.submit = submit;
        vm.goBack = goBack;
        vm.onPwdChange = onPwdChange;
        ali()
        var nc = new noCaptcha();
        var nc_appkey = 'FFFF00000000017A69F4';  // 应用标识,不可更改
        var nc_scene = 'register';  //场景,不可更改
        var nc_token = [nc_appkey, (new Date()).getTime(), Math.random()].join(':');
        var nc_option = {
            renderTo: '#dom_id',//渲染到该DOM ID指定的Div位置
            appkey: nc_appkey,
            scene: nc_scene,
            token: nc_token,
            trans: '{"name1":"code100"}',//测试用，特殊nc_appkey时才生效，正式上线时请务必要删除；code0:通过;code100:点击验证码;code200:图形验证码;code300:恶意请求拦截处理
            callback: function (data) {// 校验成功回调
                console.log(data.csessionid);
                console.log(data.sig);
                console.log(nc_token);

                document.getElementById('csessionid').value = data.csessionid;
                document.getElementById('sig').value = data.sig;
                document.getElementById('token').value = nc_token;
                document.getElementById('scene').value = nc_scene;
            }
        };

        function onPwdChange(item) {
            if (isNaN(item)) {
                vm.pwd = item.substring(0, item.length - 1);
                return
            }
            if (item.length > 6) {
                vm.pwd = item.substring(0, item.length - 1);
                vm.msg.warning = true;
                vm.msg.message = '密码长度只能为6位';
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return
            }
            console.log(item)
        }

        function goBack() {
            $location.url('/loginByVKApiHeyTea?storeId=' + storeId)
        }

        function countDown() {
            var timePromise = $interval(function () {
                if (vCodeWait <= 0) {
                    $interval.cancel(timePromise);
                    timePromise = undefined;
                    vCodeWait = waitSec;
                    vm.vcodeTitle = "重新发送";
                    vm.vcodeCss = "";
                    send = "false";
                } else {
                    vm.vcodeTitle = "已发送(" + vCodeWait + ")";
                    vCodeWait--;
                    vm.vcodeCss = "heycha_greyout";
                }
            }, 1000, 100);

        }

        function getVcode() {
            if(!vm.mobile){
                return
            }
            if (vm.mobile.length != 11) {
                vm.msg.warning = true;
                vm.msg.message = "手机号码有误";
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return;
            }
            if (send == "false"){
                document.getElementById("star-dialog").style.display="block";;
                return
            }
            if (!vm.mobile || vCodeWait < waitSec) {
                return
            }

            ForgetPwdService.getVcode(storeId, vm,csessionid,sig,tokenStr,scene).then(function (data) {
                if (data.code != 200) {
                    console.log(data.message);
                    vm.msg.warning = true;
                    vm.msg.message = data.message;
                    $timeout(function () {
                        vm.msg.warning = false;
                        vm.msg.message = '';
                    }, 2000);
                    return;
                }
                ali()
                countDown();
                console.log(data.message)
            }, function (e) {
                //error msg
            });


        }

        function submit() {

            if (!vm.mobile || !vm.vcode || !vm.pwd || !vm.rePwd) {
                console.log("未录入完整");
                vm.msg.warning = true;
                vm.msg.message = '输入信息不完整';
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return;
            }
            if (vm.pwd.length != 6) {
                vm.msg.warning = true;
                vm.msg.message = '密码长度不能少于6位数';
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return
            }
            if (vm.pwd != vm.rePwd) {
                vm.msg.warning = true;
                vm.msg.message = '两次密码输入不一致';
                $timeout(function () {
                    vm.msg.warning = false;
                    vm.msg.message = '';
                }, 2000);
                return;
            }
            ForgetPwdService.getMyCards(storeId, vm.mobile).then(function (data) {
                if (data.code != 200) {
                    console.log(data.message);
                    vm.msg.warning = true;
                    vm.msg.message = data.message;
                    $timeout(function () {
                        vm.msg.warning = false;
                        vm.msg.message = '';
                    }, 2000);
                    return;
                }
                if (lodash.isEmpty(data.data)) {
                    vm.msg.warning = true;
                    vm.msg.message = "您当前没有会员卡";
                    $timeout(function () {
                        vm.msg.warning = false;
                        vm.msg.message = '';
                    }, 2000);
                }
                vm.cardId = data.data[data.data.length - 1].id;
                ForgetPwdService.resetPwd(storeId, vm).then(function (data) {
                    if (data.code != 200) {
                        vm.msg.warning = true;
                        vm.msg.message = data.message;
                        $timeout(function () {
                            vm.msg.warning = false;
                            vm.msg.message = data.message;
                        }, 2000);
                        return;
                    }

                    UtilService.showToast(vm, "设置成功", goBack);

                }, function (e) {
                    //error msg
                });
            }, function (e) {
                //error msg
            });
        }

        function ali() {
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
                    // console.log(data.csessionid);
                    // console.log(data.sig);
                    // console.log(nc_token);
                    $timeout(function () {
                        document.getElementById("star-dialog").style.display="none";;
                        getVcode()
                    }, 1000);


                    console.log(vm.showdom);
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
        }


        // function goRegister() {
        //     $location.url('/register');
        // }
    }
})();
