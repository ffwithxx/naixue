(function () {
    'use strict';

    angular
        .module('vk')
        .controller('HeyTeaMyFeedbackController', HeyTeaMyFeedbackController);

    /** @ngInject */
    HeyTeaMyFeedbackController.$inject = ['$location', 'UtilService', 'MyService', '$sessionStorage'];

    function HeyTeaMyFeedbackController($location, UtilService, MyService, $sessionStorage) {
        var cardId = $sessionStorage.cardId;
        var token = $sessionStorage.token;
        var storeId = $sessionStorage.storeId;
        var vm = this;
        vm.memoMaxInput = 30;
        vm.memoInputCount = 0;
        vm.onTextChange = onTextChange;
        vm.submit = submit;
        vm.goBack = goBack;

        function goBack() {
            $location.url('/heytea-my?storeId=' + storeId);
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

        function submit() {
            if (!vm.feedback) {
                alert("有信息未填写");
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
