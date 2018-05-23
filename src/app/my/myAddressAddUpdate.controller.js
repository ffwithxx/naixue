(function () {
    'use strict';

    angular
        .module('vk')
        .controller('myAddressAddUpdateController', myAddressAddUpdateController);

    /** @ngInject */
    myAddressAddUpdateController.$inject = ['$location', 'MyService', '$sessionStorage', "lodash", "UtilService"];

    function myAddressAddUpdateController($location, MyService, $sessionStorage, lodash, UtilService) {
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var storeId = $sessionStorage.storeId;
        var vm = this;

        vm.title = "添加地址";
        var urlParam = $location.search();
        vm.addressId = urlParam.addressId;
        vm.title = urlParam.title;
        vm.name = urlParam.name;
        vm.mobile = lodash.parseInt(urlParam.mobile);
        vm.city = urlParam.city;
        vm.address = urlParam.address;
        if (urlParam.default == 1) {
            vm.default = true
        }

        vm.onSaveClick = onSaveClick;
        vm.checkSimbol = checkSimbol;
        vm.goBack = goBack;

        function goBack() {
            $location.url("/myAddressList?storeId=" + storeId);
        }

        function checkSimbol(obj, key) {
            var IllegalString = "[`~!#@$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
            var index = obj[key].length - 1;
            var s = obj[key].charAt(index);
            if (IllegalString.indexOf(s) >= 0) {
                s = obj[key].substring(0, index);
                obj[key] = s;
            }
        }

        function onSaveClick() {
            if (!vm.name || !vm.mobile || !vm.address) {
                alert("还有信息未填写");
                return
            }

            if (vm.mobile.toString().length != 11) {
                alert("电话号码不正确");
                return
            }

            vm.isDefault = 0;
            if (vm.default) {
                vm.isDefault = 1;
            }

            if (vm.title === "修改地址") {
                if(cardId =="" ||cardId=="null"||!cardId){
                    return
                }
                MyService.updateMyAddress(cardId, token, vm).then(function (data) {
                    if (data.code != 200) {
                        alert(data.message);
                        return
                    }

                    UtilService.showToast(vm, "保存成功", goBack);
                }, function (e) {
                    //error msg
                });
            } else if (vm.title === "新增地址") {
                MyService.addMyAddress(cardId, token, vm).then(function (data) {
                    if (data.code != 200) {
                        alert(data.message);
                        return
                    }

                    UtilService.showToast(vm, "保存成功", goBack);

                }, function (e) {
                    //error msg
                });
            }


        }

    }
})();
