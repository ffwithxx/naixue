(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaMemberInfoController', HeyTeaMemberInfoController);

    /** @ngInject */
    HeyTeaMemberInfoController.$inject = ['$scope','$location', '$sessionStorage', 'MyService','Upload','$timeout','webApiUrl','SessionStorageService'];


    function HeyTeaMemberInfoController($scope,$location, $sessionStorage, MyService,Upload,$timeout,webApiUrl,SessionStorageService) {

        // ($scope, $sessionStorage, $location, $timeout, MyService, SessionStorageService, Upload, webApiUrl)
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;
        var token = $sessionStorage.token;
        var vm = this;
        vm.memberName = $sessionStorage.memberName;
        vm.mobile = $sessionStorage.mobile;
        vm.memberGender = parseInt($sessionStorage.sex) ? "女" : "男";
        if ($sessionStorage.sex == null) {
            vm.memberGender = "";
        }
        vm.memberBirthday = $sessionStorage.birthday;
        vm.memberCardNo = $sessionStorage.cardId;
        vm.createdDate = $sessionStorage.activated;
        vm.createdLocation = $sessionStorage.storeName;
        vm.memberLevel = $sessionStorage.levelName;
        vm.otherMobile = $sessionStorage.otherMobile;
        vm.mima = "******";

        vm.headUrl = $sessionStorage.headUrl || "./assets/images/heytea/head.png";
        vm.goLevelDeatil = goLevelDetail;
        vm.updateGender = updateGender;
        vm.onKeyPressUpdateMemberName = onKeyPressUpdateMemberName;
        vm.noBlurUpdateMemberName = noBlurUpdateMemberName;
        vm.updateBirthday = updateBirthday;
        vm.hold = hold;
        vm.goBack = goBack;
        vm.changeLogo = changeLogo;
        vm.uploadPhoto = uploadPhoto;
        vm.picFile = undefined;
        vm.goDetailPage =  goDetailPage;


        function hold() {
            console.log(123);
        }
        // alert("生日信息一经设置无法修改，请谨慎选择！");
        function noBlurUpdateMemberName(newName) {
            MyService.updateMemberInfo(cardId, token, {name: newName}).then(function (retData) {
                if (retData.code != 200) {
                    alert(retData.message);
                    console.log(retData.message);
                    return
                }
                $sessionStorage.memberName = newName;
            })
        }
    function goDetailPage() {
    $location.url(url + '?storeId=' + $sessionStorage.storeId);
}
        function onKeyPressUpdateMemberName(event, newName) {
            var keycode = window.event ? event.keyCode : event.which;
            if (keycode == 13) {
                if (!newName) {
                    return
                }
                MyService.updateMemberInfo(cardId, token, {name: newName}).then(function (retData) {
                    if (retData.code != 200) {
                        alert(retData.message);
                        console.log(retData.message);
                        return
                    }
                    $sessionStorage.memberName = newName;
                    event.target.blur();
                })
            }
        }

        function updateGender(newGender) {
            MyService.updateMemberInfo(cardId, token, {sex: newGender}).then(function (retData) {
                if (retData.code != 200) {
                    alert(retData.message);
                    console.log(retData.message);
                    return
                }
                $sessionStorage.sex = newGender;
            })
        }

        function updateBirthday() {
            // var datetime = vm.memberBirthday;
            // var year = datetime.getFullYear();
            // var month = datetime.getMonth() + 1;
            // if (month < 10) {
            //     month = "0" + month;
            // }
            // var day = datetime.getDate();
            // if (day < 10) {
            //     day = "0" + day;
            // }
            // var params = {
            //     birthday: [year, month, day].join("-"),
            //     birthday2: [month, day].join("-")
            // };
            //
            // MyService.updateMemberInfo(cardId, token, params).then(function (tranData) {
            //     if (tranData.code != 200) {
            //         alert(tranData.message);
            //         console.log(tranData.message);
            //         vm.memberBirthday = "";
            //         return
            //     }
            //     $sessionStorage.birthday = params.birthday;
            //     $sessionStorage.birthday2 = params.birthday2;
            //     vm.memberBirthday = params.birthday;
            // })
        }
        $("#USER_AGE").change(function(){
            vm.memberBirthday  =  $("#USER_AGE").val();;
            // var year = datetime.getFullYear();
            // var month = datetime.getMonth() + 1;
            // if (month < 10) {
            //     month = "0" + month;
            // }
            // var day = datetime.getDate();
            // if (day < 10) {
            //     day = "0" + day;
            // }
            var arr = vm.memberBirthday.split('-');
            var params = {
                birthday: vm.memberBirthday,
                birthday2: [arr[0], arr[1]].join("-")
            };

            MyService.updateMemberInfo(cardId, token, params).then(function (tranData) {
                if (tranData.code != 200) {
                    alert(tranData.message);
                    console.log(tranData.message);
                    vm.memberBirthday = "";
                    return
                }
                $sessionStorage.birthday = params.birthday;
                $sessionStorage.birthday2 = params.birthday2;
                vm.memberBirthday = params.birthday;
            })
        });
        function goLevelDetail() {
            $location.url("/heytea-myExperience?storeId=" + storeId +"&type="+"member" );
        }

        function goBack() {
            $location.url("/heytea-my?storeId=" + storeId);
        }
        function changeLogo() {
            window.alert('abc')
        }

        function goDetailPage(url) {
            $location.url(url + '?storeId=' + $sessionStorage.storeId);
        }

        $scope.$watch('picFile', function (file) {


            uploadPhoto(file)
        })


        function  resizeFile(file) {

        }
        function uploadPhoto(file) {
            if (!file) return;
            console.log('file:', file)
            // var size = file.size;
            // var sizeM = size/1024;
            // if (sizeM > 2000) {
            //
            //     alert("请上传2M以内的图片");
            //     return
            // }


            Upload.upload({
                url: webApiUrl + 'uploadFile/v2/upload',
                method: 'POST',
                headers : {
                    'Content-Type': 'multipart/form-data'
                },
                data: {'file': file}
            }).then(function (resp) {
                console.log('data: ', resp.data)
                vm.headUrl = resp.data.data[0]
                SessionStorageService.setOneSessionStorage("headUrl", vm.headUrl);

                var params = {
                    headUrl:resp.data.data[0]
                };

                MyService.updateMemberInfo(cardId, token, params).then(function (tranData) {
                    if (tranData.code != 200) {
                        alert(tranData.message);
                        console.log(tranData.message);
                        vm.headUrl = "";
                        return
                    }
                    $sessionStorage.headUrl =resp.data.data[0] ;

                    vm.headUrl = resp.data.data[0];
                })
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        }


        $(function () {
            var currYear = (new Date()).getFullYear();
            var opt={};
            opt.date = {preset : 'date'};
            opt.datetime = {preset : 'datetime'};
            opt.time = {preset : 'time'};
            opt.default = {
                theme: 'android-ics light', //皮肤样式
                display: 'modal', //显示方式
                mode: 'scroller', //日期选择模式
                dateFormat: 'yyyy-mm-dd',
                lang: 'zh',
                showNow: false,
                nowText: "今天",
                multiSelect: true,
                startYear: currYear - 50, //开始年份
                endYear: currYear + 10 //结束年份
            };

            $("#USER_AGE").mobiscroll($.extend(opt['date'], opt['default']));

        });
    }
})();
