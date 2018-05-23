/**
 * Created by ganyang on 16/11/12.
 */

(function () {
    'use strict';

    angular
        .module('vk')
        .factory('MyService', MyService);

    MyService.$inject = ['$http', '$q', 'appUrl', 'restUrl', 'restUrlV2', 'restUrlV3', 'pointV1', 'levelV1','restUrlV5'];

    function MyService($http, $q, appUrl, restUrl, restUrlV2, restUrlV3, pointV1, levelV1,restUrlV5) {
        return {
            getMemberLevelDetail: getMemberLevelDetail,
            getPrivilegeDetail: getPrivilegeDetail,
            getMyExperienceDetail: getMyExperienceDetail,
            getMyAddressList: getMyAddressList,
            getMemberInfo: getMemberInfo,
            getMyCards: getMyCards,
            addMyAddress: addMyAddress,
            updateMyAddress: updateMyAddress,
            deleteMyAddress: deleteMyAddress,
            postMyFeedback: postMyFeedback,
            changeMyPwd: changeMyPwd,
            getRechargeList: getRechargeList,
            postRecharge: postRecharge,
            getDiscountCouponList: getDiscountCouponList,
            getPayCode: getPayCode,
            rechargeByWeChat: rechargeByWeChat,
            doAssetsTransfer: doAssetsTransfer,
            updateMemberInfo: updateMemberInfo,
            deleteCard: deleteCard,
            getFitShops: getFitShops,
            getUserRule:getUserRule,
            agreement:agreement,
            levelPrivileges:levelPrivileges

        };

        function getFitShops(token, storeId) {
            return $http({
                method: 'GET',
                headers: {
                    token: token
                    // cardId: cardId
                },
                url: restUrl + 'district/list/' + storeId
            }).then(completed).catch(failed);
        }
        function getUserRule( storeId) {
            return $http({
                method: 'GET',

                url: restUrl + 'getUserRule/' + storeId
            }).then(completed).catch(failed);
        }
function agreement(cardId, token) {
    return $http({
        method: 'POST',
        headers: {
            token: token,
            cardId: cardId
        },
        data: {
            id: cardId
        },
        url: restUrlV5 + 'card/agreement'
    }).then(completed).catch(failed);
}
        function deleteCard(cardId, token, params) {
            return $http({
                method: 'GET',
                headers: {
                    token: token,
                    cardId: cardId
                },
                url: restUrl + 'card/by/unbind/' + params.unbindCardId
            }).then(completed).catch(failed);
        }

        function updateMemberInfo(cardId, token, params) {
            return $http({
                method: "PUT",
                url: restUrl + 'card',
                dataType: 'json',
                data: {
                    id: cardId,
                    birthday: params.birthday,
                    birthday2: params.birthday2,
                    name: params.name,
                    sex: params.sex,
                    headUrl:params.headUrl,
                    otherMobile:params.otherMobile

                },
                headers: {
                    token: token,
                    cardId: cardId
                }
            }).then(completed).catch(failed);
        }

        function doAssetsTransfer(cardId, token, storeId, intoCardId) {
            return $http({
                method: 'GET',
                headers: {
                    token: token,
                    cardId: cardId
                },
                url: restUrlV3 + 'card/' + cardId + '/' + intoCardId + '/' + storeId
            }).then(completed).catch(failed);
        }

        function getMyCards(storeId, openId) {
            return $http({
                method: 'GET',
                url: restUrl + 'weixin/weixin_user_by_openid/' + openId + '/' + storeId
            }).then(completed).catch(failed);
        }

        function getMemberInfo(cardId, token) {
            return $http({
                method: 'GET',
                url: restUrl + 'card/' + cardId,
                headers: {
                    token: token,
                    cardId: cardId
                }
            }).then(completed).catch(failed);
        }

        function rechargeByWeChat(cardId, storeId, token, openId, params) {
            return $http({
                method: "POST",
                url: restUrlV2 + 'weixin/recharge',
                dataType: 'json',
                data: {
                    cardId: cardId,
                    parentId: storeId,
                    token: token,
                    openId: openId,
                    mobile: params.mobile,
                    name: params.memberName,
                    body: params.title,
                    amount: params.amount * 100,
                    amountConfigId: params.id,
                    curUrl: params.curUrl
                },
                headers: {
                    token: token,
                    cardId: cardId
                }
            }).then(completed).catch(failed);
        }

        function getPayCode(cardId, token) {
            return $http({
                method: 'GET',
                url: restUrl + 'card/paymentcode/' + cardId,
                headers: {
                    cardId: cardId,
                    token: token
                }
            }).then(completed).catch(failed);
        }

        function changeMyPwd(cardId, token, storeId, params) {
            return $http({
                method: 'PUT',
                url: restUrl + 'card/updatePwd',
                dataType: "json",
                data: {
                    storeId: storeId,
                    password: params.password,
                    oldPassword: params.oldPassword,
                    mobile: params.mobile
                },
                headers: {
                    cardId: cardId,
                    token: token
                }
            }).then(completed).catch(failed);
        }

        function getRechargeList(cardId, token) {
            return $http({
                method: 'GET',
                url: restUrl + 'amountConfigs/0/99',
                dataType: "json",
                headers: {
                    cardId: cardId,
                    token: token
                }
            }).then(completed).catch(failed);
        }

        function postRecharge() {

        }

        function postMyFeedback(cardId, storeId, token, param) {
            return $http({
                method: 'POST',
                url: restUrl + 'feedback',
                headers: {
                    cardId: cardId,
                    token: token
                },
                data: {
                    storeId: storeId,
                    content: param.feedback,
                    source: "微商城v2"
                },
                dataType: "json"
            }).then(completed).catch(failed);
        }

        function deleteMyAddress(cardId, token, param) {
            return $http({
                method: 'DELETE',
                url: restUrlV2 + 'address/' + param.addressId,
                headers: {
                    cardId: cardId,
                    token: token
                },
                dataType: "json"
            }).then(completed).catch(failed);
        }

        function updateMyAddress(cardId, token, param) {
            return $http({
                method: 'PUT',
                url: restUrlV2 + 'address',
                headers: {
                    cardId: cardId,
                    token: token
                },
                data: {
                    id: param.addressId,
                    address: param.address,
                    city: param.city,
                    mobile: param.mobile,
                    isDefault: param.isDefault,
                    name: param.name
                },
                dataType: "json"
            }).then(completed).catch(failed);
        }

        function addMyAddress(cardId, token, param) {
            return $http({
                method: 'POST',
                url: restUrlV2 + 'address',
                headers: {
                    cardId: cardId,
                    token: token
                },
                data: {
                    cardId: cardId,
                    address: param.address,
                    city: param.city,
                    mobile: param.mobile,
                    isDefault: param.isDefault,
                    name: param.name
                },
                dataType: "json"
            }).then(completed).catch(failed);
        }

        function getMemberLevelDetail(cardId, storeId, token) {
            return $http({
                method: 'GET',
                url: restUrl + 'card/levellist/' + cardId + '/' + storeId + '/0/99',
                dataType: "json",
                headers: {
                    cardId: cardId,
                    token: token
                }
            }).then(completed).catch(failed);
        }

        function getPrivilegeDetail(cardId, token, levelId) {
            return $http({
                method: 'GET',
                url: levelV1 + 'find/' + levelId,
                dataType: "json",
                headers: {
                    cardId: cardId,
                    token: token
                }
            }).then(completed).catch(failed);
        }

        function getMyExperienceDetail(cardId, storeId, token) {
            return $http({
                method: 'GET',
                url: restUrl + 'card/explog/' + cardId + '/' + storeId + '/0/99',
                dataType: "json",
                headers: {
                    cardId: cardId,
                    token: token
                }
            }).then(completed).catch(failed);
        }

        function getMyAddressList(cardId, token) {
            return $http({
                method: 'GET',
                url: restUrlV2 + 'address/by/' + cardId + '/0/99',
                dataType: "json",
                headers: {
                    cardId: cardId,
                    token: token
                }
            }).then(completed).catch(failed);
        }
        if(cardId =="" ||cardId=="null"||!cardId){
            return
        }
        function getDiscountCouponList(cardId, storeId, token, flag) {
            return $http({
                method: 'GET',
                url: restUrl + 'ticket/by/' + cardId + '/' + storeId + '/0/99/' + flag,
                dataType: "json",
                headers: {
                    cardId: cardId,
                    token: token
                }
            }).then(completed).catch(failed);
        }

        function levelPrivileges(cardId, storeId, token) {
            return $http({
                method: 'POST',
                url: restUrl + 'card/levelPrivileges',
                dataType: "json",
                headers: {
                    cardId: cardId,
                    token: token
                }
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
