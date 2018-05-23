/**
 * Created by ganyang on 16/11/11.
 */

(function () {
    'use strict';

    angular
        .module('vk')
        .factory('RegisterService', RegisterService);

    RegisterService.$inject = ['$http', '$q', 'restUrl','restUrlV5'];

    function RegisterService($http, $q, restUrl,restUrlV5) {
        return {
            getVcode: getVcode,
            register:register,
            getmobileVcode:getmobileVcode,
            checkSms:checkSms
        };

        function getVcode(storeId, otherMobile,csessionid,sig,tokenStr,scene) {
            return $http({
                method: 'GET',
                url: restUrl + 'send/' + otherMobile + '/identifyingCode/by/' + storeId,
                dataType: "json",
                headers: {
                    storeId: storeId,
                    csessionid:csessionid,
                    sig:sig,
                    token:tokenStr,
                    scene:scene
                }
            }).then(completed).catch(failed);
        }
        function checkSms(code, otherMobile) {
            return $http({
                method: 'POST',
                url: restUrl + 'card/checkSms',
                data: {

                    mobile: otherMobile,

                    code:code


                },
                dataType: "json"
            }).then(completed).catch(failed);
        }

        function getmobileVcode(storeId, otherMobile,csessionid,sig,tokenStr,scene) {
            return $http({
                method: 'POST',
                url: restUrlV5 + 'cardSell/sendCode/'+ storeId +"/" + otherMobile,
                dataType: "json",
                headers: {
                    storeId: storeId,
                    csessionid:csessionid,
                    sig:sig,
                    token:tokenStr,
                    scene:scene
                }
            }).then(completed).catch(failed);
        }

        function register(storeId, param) {
            // var datetime = param.birthday;
            // var year = datetime.getFullYear();
            // var month = datetime.getMonth() + 1;
            // if (month < 10) {
            //     month = "0" + month;
            // }
            // var day = datetime.getDate();
            // if (day < 10) {
            //     day = "0" + day;
            // }

            return $http({
                method: 'POST',
                url: restUrl + 'card/activate',
                data: {
                    storeId: storeId,
                    otherMobile: param.mobile,
                    mobileCode: param.vcode,
                    password: param.vpwd,
                    birthday: param.birthday,
                    sex: param.gender,
                    name:param.name,
                    mobile:param.vcardNum


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
