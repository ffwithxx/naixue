(function () {
    'use strict';

    angular
        .module('vk')
        .controller('myFeedbackController', myFeedbackController);

    /** @ngInject */
    myFeedbackController.$inject = ['$location', 'UtilService', 'MyService', '$sessionStorage'];

    function myFeedbackController($location, UtilService, MyService, $sessionStorage) {
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var storeId = $sessionStorage.storeId;
        var vm = this;
        vm.memoMaxInput = 30;
        vm.memoInputCount = 0;
        vm.onTextChange = onTextChange;
        vm.onSubmit = onSubmit;
        vm.goBack = goBack;
        var urlParam = $location.search();
        var theme = urlParam.theme || $sessionStorage.theme;
        function goBack() {
            $location.url('/my?storeId=' + storeId+ "&theme=" + theme);
        }

        function onTextChange() {
            var count = vm.feedback.split("");
            vm.memoInputCount = count.length;
            if (count.length > vm.memoMaxInput) {
                count = count.slice(0, vm.memoMaxInput);
                vm.memoInputCount = vm.memoMaxInput;
            }
            vm.feedback = count.join("");
        }

        function onSubmit() {
            if (!vm.feedback) {
                alert("有信息未填写");
                return
            }
            if(cardId =="" ||cardId=="null"||!cardId){
                return
            }
            MyService.postMyFeedback(cardId, storeId, token, vm).then(function (data) {
                if (data.code != 200) {
                    alert(data.message);
                    return
                }
                vm.feedback = "";
                vm.memoInputCount = 0;

                UtilService.showToast(vm, "反馈成功");

            }, function (e) {
                //error msg
            });
        }
    }
})();
