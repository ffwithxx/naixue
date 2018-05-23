/**
 * Created by ganyang on 16/11/11.
 */

(function () {
    'use strict';

    angular
        .module('vk')
        .factory('RegisterWithPwdService', RegisterWithPwdService);

    RegisterWithPwdService.$inject = ['$http', '$q', 'restUrlV2'];

    function RegisterWithPwdService($http, $q, restUrlV2) {
        return {
            register: register
        };

        function register(storeId, param) {
            // var bir = param.birthday;
            // var  m = bir.split("-");
            // var year = m[0];
            // var  month = m[1];
            // var  day = m[2];
            // if (month < 10) {
            //     month = "0" + month;
            // }
            //
            // if (day < 10) {
            //     day = "0" + day;
            // }

            return $http({
                method: 'POST',
                url: restUrlV2 + 'card',
                data: {
                    storeId: storeId,
                    mobile: param.mobile,
                    sms: param.vcode,
                    password: param.pwd,
                    birthday: param.birthday,
                    sex: param.gender,
                    name:param.name
                },
                dataType: "json"
            }).then(completed).catch(failed);
        }

        function completed(response) {
            return response.data;
        }

        function failed(e) {
            return $q.reject(e);
        }
    }
})();
