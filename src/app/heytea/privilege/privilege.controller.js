(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaMyPrivilegeController', HeyTeaMyPrivilegeController);

    HeyTeaMyPrivilegeController.$inject = ['$location', '$sessionStorage', 'lodash', '$templateCache', '$timeout', 'MyService'];

    /** @ngInject */
    function HeyTeaMyPrivilegeController($location, $sessionStorage, lodash, $templateCache, $timeout, MyService) {
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;
        var token = $sessionStorage.token;
        var orderType = $location.search().orderType;
        var orderId;
        var bgArr = ["./assets/images/snow/card1.jpg","./assets/images/snow/card2.jpg","./assets/images/snow/card3.jpg"];
        var vm = this;
        vm.goBack = goBack;
        vm.goPrivilegeDetail = goPrivilegeDetail;
        vm.setTabActive = setTabActive;
        vm.setNextActive = setNextActive;
        vm.setPrevActive = setPrevActive;

        init();

        function init() {
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            MyService.getMemberInfo(cardId, token).then(function (res) {
                vm.levelId = res.data.levelId;
                MyService.getMemberLevelDetail(cardId, storeId, token).then(function (data) {
                    if (data.code != 200) {
                        return
                    }
                    setBackground(data.data.slice(0,3));
                }, function (e) {
                    //error msg
                });
            }, function (e) {
                //error msg
            });

        }

        function setBackground(data) {
            lodash.forEach(data, function (v, k) {
                if (v.id === vm.levelId) {
                    vm.activeKey = k;
                }
                v.index = k;
                var tempUrl = '';
                v.key = 'tpl-privilege-' + v.index;
                if (k < data.length - 1) {
                    tempUrl = bgArr[k + 1];
                    $templateCache.put(v.key, "<div class='img' style='background-image: url(" + bgArr[k] + ");'></div><div class='right' style='background-image: url(" + tempUrl + ");'></div>");
                } else {
                    $templateCache.put(v.key, "<div class='img' style='background-image: url(" + bgArr[k] + ");'></div><div class='right-last'></div>");
                }

            });
            // vm.tabList = data.slice(0,3);
            if (!vm.activeKey){
                vm.activeKey = 0;
            }
            vm.tabList = data;
            vm.tabActiveList = vm.tabList[vm.activeKey];
            selectPage(vm.activeKey);
        }

        function setTabActive(tab) {
            vm.tabActiveList = tab;
            setTabMenuActiveLine();
        }

        function setTabMenuActiveLine() {
            $timeout(function () {
                var index = jQuery('.tab-item.active').index();
                var left = 100 * index + 48;
                jQuery('.active-line').animate({left: left})
            }, 200);
        }

        function setNextActive() {
            if (vm.tabActiveList.index == vm.tabList.length - 1) {
                return;
            }

            selectPage(vm.tabActiveList.index + 1);
        }

        function setPrevActive() {
            if (vm.tabActiveList.index == 0) {
                return;
            }
            selectPage(vm.tabActiveList.index - 1);

        }

        function selectPage(indexSelected) {
            if (vm.tabList[indexSelected].index > vm.tabActiveList.index) {
                vm.moveToLeft = false;
            } else {
                vm.moveToLeft = true;
            }
            moveTabMenu(indexSelected, vm.moveToLeft);
            vm.tabActiveList = vm.tabList[indexSelected];
            setTabMenuActiveLine();
        }

        function moveTabMenu(indexSelected, moveToLeft) {
            if (indexSelected < 3 && !moveToLeft) {
                return;
            }

            var distance = 100 * (indexSelected - 2);
            jQuery(".tab-list").scrollLeft(distance);
        }

        function goBack() {
            $location.url("/heytea-my?storeId=" + storeId);
        }

        function goPrivilegeDetail() {
            $location.url("/heytea-privilege-detail?storeId=" + storeId + "&privilegeId=" + vm.tabActiveList.id + "&sid=" + (parseInt(vm.tabActiveList.index) + 1) + "&name=" + vm.tabActiveList.levelName);
        }

    }
})();
