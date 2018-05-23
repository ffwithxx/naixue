(function () {
    'use strict';

    angular
        .module('vk')
        .controller('myAddressListController', myAddressListController);

    /** @ngInject */
    myAddressListController.$inject = ['$location', 'MyService', '$sessionStorage', "lodash"];

    function myAddressListController($location, MyService, $sessionStorage, lodash) {
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;
        var token = $sessionStorage.token;
        var vm = this;
        vm.manage = "管理";
        if(cardId =="" ||cardId=="null"||!cardId){
            return
        }
        MyService.getMyAddressList(cardId, token).then(function (data) {
            if (data.code != 200) {
                alert(data.message);
                console.log(data.message);
                return
            }
            vm.myAddress = data.data;
        }, function (e) {
            //error msg
        });

        vm.onManageClick = onManageClick;
        vm.addAddress = addAddress;
        vm.editAddress = editAddress;
        vm.clickOnDelete = clickOnDelete;
        vm.closeDialog = closeDialog;
        vm.postDelete = postDelete;
        vm.goBack = goBack;

        function goBack() {
            $location.url("/my?storeId=" + storeId);
        }

        function postDelete(addressId) {
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            MyService.deleteMyAddress(cardId, token, {addressId: addressId}).then(function (data) {
                if (data.code != 200) {
                    alert(data.message);
                    console.log(data.message);
                    return
                }
                //刷新页面
                vm.myAddress = lodash.remove(vm.myAddress, function (eachAddress) {
                    return eachAddress.id != addressId
                })

            }, function (e) {
                //error msg
            });
            vm.showDialog = false;
        }

        function closeDialog() {
            vm.showDialog = false;
        }

        function clickOnDelete(item) {
            vm.nameOnDialog = item.name;
            vm.mobileOnDialog = item.mobile;
            vm.addressOnDialog = item.address;
            vm.addressId = item.id;
            vm.showDialog = true;
        }

        function editAddress(item) {
            $location.url("/myAddressAddUpdate?storeId=" + storeId
                + "&title=修改地址"
                + "&city=" + item.city
                + "&mobile=" + item.mobile
                + "&name=" + item.name
                + "&default=" + item.isDefault
                + "&addressId=" + item.id
                + "&address=" + item.address
            );
        }

        function onManageClick() {
            if (this.manage === "管理") {
                this.manage = "取消"
            } else if (this.manage === "取消") {
                this.manage = "管理"
            }
        }

        function addAddress() {
            $location.url("/myAddressAddUpdate?storeId=" + storeId
                + "&title=新增地址"
            );

        }

    }
})();
