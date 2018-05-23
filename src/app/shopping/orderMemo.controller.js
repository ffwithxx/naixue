(function () {
    'use strict';

    angular
        .module('vk')
        .controller('orderMemoController', orderMemoController);

    /** @ngInject */
    orderMemoController.$inject = ['$location'];

    function orderMemoController($location) {
        var vm = this;
        vm.memoMaxInput = 30;
        vm.memoInputCount = 0;
        vm.onTextChange = onTextChange;
        vm.onSubmit = onSubmit;
        vm.goBack = goBack;

        function goBack() {
            //TODO: dismiss the window
        }

        function onTextChange() {
            var count = vm.feedback.split("");
            vm.memoInputCount = count.length;
            if (count.length > vm.memoMaxInput) {
                count.pop();
                vm.memoInputCount = vm.memoMaxInput;
            }
            vm.feedback = count.join("");
        }

        function onGoBackClick() {
            $location.url("/myAddressList");
        }

        function onSubmit() {
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
                alert("反馈成功");
            }, function (e) {
                //error msg
            });
        }
    }
})();
