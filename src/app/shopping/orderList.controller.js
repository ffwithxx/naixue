(function () {
    'use strict';

    angular
        .module('vk')
        .controller('OrderListController', OrderListController);

    /** @ngInject */
    OrderListController.$inject = ['$scope', '$location', '$timeout', '$sessionStorage', 'ShoppingService', 'RunStoreService'];

    function OrderListController($scope, $location, $timeout, $sessionStorage, ShoppingService, RunStoreService) {
        var urlParam = $location.search();
        var cardId = $sessionStorage.cardId;
        var storeId = $sessionStorage.storeId;
        var subStoreId = $sessionStorage.storeId;
        var token = $sessionStorage.token;
        var cacheOrderList = RunStoreService.getOrderItems();
        var xid = 0;
        var totalArr;
        var vm = this;

        vm.allProducts = []
        vm.totalPrice = 0;
        vm.showBottom = false;
        vm.actualItems = [];
        vm.showLoading = false
        vm.showWarning = false;
        vm.warningMsg = '';
        vm.setActive = setActive;
        vm.reduce = reduce;
        vm.plus = plus;
        vm.reduceTaste = reduceTaste;
        vm.plusTaste = plusTaste;
        vm.goBack = goBack;
        vm.openTaste = openTaste;
        vm.closeBottom = closeBottom;
        vm.openAllotTaste = openAllotTaste;
        vm.closeAllotTaste = closeAllotTaste;
        vm.setProductActive = setProductActive;
        vm.selectedTaste = selectedTaste;
        vm.addCart = addCart;
        vm.goFinal = goFinal;


        if (cacheOrderList && cacheOrderList.length > 0) {
            totalArr = _.groupBy(cacheOrderList, 'id');
            vm.actualItems = angular.copy(cacheOrderList);
            xid = cacheOrderList[cacheOrderList.length - 1].xid;
        }

        if (urlParam.subStoreId) {
            subStoreId = urlParam.subStoreId
        }

        ShoppingService.getCategorybyStoreId(cardId, token, subStoreId).then(function (res) {
            var total;
            vm.totalPrice = 0;
            vm.allProducts = []
            $scope.num = 0;
            vm.activeCategory = res.data[0];
            total = res.data.length;
            angular.forEach(res.data, function (v) {
                ShoppingService.getProductByCategoryId(cardId, token, subStoreId, v.id).then(function (data) {
                    angular.forEach(data.data, function (v) {
                        v.total = 0;
                        if (cacheOrderList && cacheOrderList.length > 0) {
                            angular.forEach(cacheOrderList, function (vv) {
                                if (vv.id == v.id) {
                                    // v.total = vv.total;
                                    angular.forEach(vv.tasteList, function (t) {
                                        //taste price
                                        vm.totalPrice += t.total * t.price;
                                    });
                                    //product price
                                    vm.totalPrice += vv.price;
                                }
                            });
                            if (angular.isDefined(totalArr[v.id])) {
                                v.total = totalArr[v.id].length;
                            }
                        }
                    });
                    v.products = data.data;
                    vm.allProducts = _.concat(vm.allProducts, data.data)
                    $scope.num++;
                });
            });
            $scope.$watch('num', function (v) {
                if (v === total) {
                    vm.categories = res.data;
                    setActive(vm.categories[0])
                }
            });
        });

        /* ShoppingService.getProductAttributes(token, branchId).then(function (res) {
            vm.tosteList = res.data;
            angular.forEach(res.data, function (v) {
                v.total = 0;
            });
        }); */

        function goBack() {
            $location.url('/shopping?storeId=' + storeId)
            // $location.url('/storeDetail\?storeId=' + storeId);
        }

        function selectedTaste(t) {
            // plusTaste(t)
            calculateSelectProduct(t)
        }

        function calculateSelectProduct(t) {
            if (!vm.activeProduct.tasteList) vm.activeProduct.tasteList = []
            if (t) {
                _.remove(vm.activeProduct.tasteList, function(v) {
                    if(v.groupId === t.groupId && t.selectType == 1) {
                        v.total = 0
                        return true
                    }
                    return false
                })

                // var clone = angular.copy(t)
                if (!t.total) t.total = 0
                if (t.total > 0) {
                  t.total = 0
                } else {
                  t.total = 1
                  t.productId = vm.activeProduct.id

                  var item = _.find(vm.activeProduct.tasteList, { 'id': t.id })
                  console.log(item)
                  if (item) {
                    _.remove(vm.activeProduct.tasteList, function(n) {
                        return n.id == item.id
                    })
                  }
                  vm.activeProduct.tasteList.push(t)
                }
            }

            var tastePrice = 0
            angular.forEach(vm.activeProduct.tasteList, function (v) {
                if (v.total > 0) {
                  tastePrice += v.price
                }
            })

            vm.activeProductPrice = tastePrice + vm.activeProduct.price
        }

        function addCart(p) {
            p.total = p.total + 1;
            calculate(p, true);
            closeAllotTaste()

            showLoading()
            closeLoading()
        }

        function calculate(p, isPlus) {
            ++xid;
            if (isPlus) {
                var p2 = angular.copy(p)
                p2.xid = xid
                p2.total = 1
                vm.actualItems.push(p2)
            } else {
                var droped = false
                // p.total = p.total - 1
                angular.forEach(vm.actualItems, function (v, k) {
                    if (p.xid) {
                        if (p.xid == v.xid && !droped) {
                            console.log(v)
                            v.total = v.total - 1
                            if (v.total <= 0) {
                                vm.actualItems.splice(k, 1)
                            }
                            droped = true
                            calculateNative(p, false)
                        }
                    } else {
                        if (p.id == v.id && !droped) {
                            p.total = p.total - 1
                            v.total = v.total - 1
                            if (v.total <= 0) {
                              vm.actualItems.splice(k, 1)
                              angular.forEach(p.tasteList, function (item) {
                                  item.total = 0
                              })
                            }
                            droped = true
                        }
                    }
                })
            }
            calcItemTotal()
        }

        function calcItemTotal() {
            vm.totalPrice = 0
            vm.itemCount = 0
            angular.forEach(vm.actualItems, function (eachItem) {
                vm.totalPrice += (eachItem.price || 0) * (eachItem.total || 1);
                angular.forEach(eachItem.tasteList, function (eachTaste) {
                    vm.totalPrice += (eachTaste.price || 0) * (eachTaste.total || 0);
                })

                vm.itemCount += eachItem.total
            })
        }

        function calculateNative(p, isPlus) {
            var _p = _.find(vm.allProducts, ['id', p.id])
            console.log('vm.allProducts', vm.allProducts)
            if (isPlus) {
                _p.total = _p.total + 1
            } else {
                if (_p && _p.total && _p.total > 0) {
                    _p.total = _p.total - 1
                }
            }
        }

        function reduce(p, isNative) {
            // p.total = p.total - 1
            calculate(p, false)

            /*if (!isNative) {
              console.log('isNative:' + isNative)
              calculate(p, false)
            } else {
              p.total = p.total - 1
              calculate(p, false)
              // reduceTaste(p)
            }*/
        }

        function reduceTaste(p) {
            if (!vm.selectTastes) return
            var tastes = vm.selectTastes[p.id]
            if (!tastes) return

            _.remove(tastes, function(v) {
                if(v.productId === p.id) {
                    v.total = 0
                    return true
                }
                return false
            })
        }

        function plus(p, isNative) {
            // p.total = p.total + 1;
            // calculate(p, true);
            if (!isNative) {
              p.total = p.total + 1
              calculateNative(p, true)
              calcItemTotal()
            } else {
              openAllotTaste(p)
              calculateSelectProduct()
            }
        }

        /*function reduceTaste2(t) {
            t.total -= 1;
            calculateTaste(t, false);
        }*/

        function plusTaste(t) {
            var repeatGroup = false;
            angular.forEach(vm.activeProduct.attributeGroups, function (g) {
              angular.forEach(g.productAttributeResponseList, function (v) {
                  if (v.groupId == t.groupId && v.total > 0) {
                      if (v.id == t.id) {
                          repeatGroup = false
                      } else {
                          repeatGroup = true;
                          v.total = 0
                          calculateTaste(v, false)
                      }
                  }
              });
            });

            if (!t.total) t.total = 0
            if (t.total <= 0) {
                t.total = 1;
                calculateTaste(t, true);
                console.log(t)
            }
        }

        function calculateTaste(t, isPlus) {
            angular.forEach(vm.actualItems, function (v) {
                if (v.id == vm.activeProduct.id) {
                    v = vm.activeProduct;
                }
            });
            if (isPlus) {
                vm.totalPrice += t.price;
            } else {
                vm.totalPrice -= t.price;
            }
        }

        function setActive(c) {
            vm.activeCategory = c;
            vm.products = c.products;
        }

        function openTaste() {
            vm.showAllotTaste = false;

            vm.circleItems = [];
            angular.forEach(vm.actualItems, function (vv) {
              if (vv.total > 0) {
                vm.circleItems.push(vv);
              }
            })

            /*vm.circleItems = [];
            angular.forEach(vm.categories, function (v) {
                angular.forEach(v.products, function (vv) {
                    if (vv.total > 0) {
                        vm.circleItems.push(vv);
                    }
                });
            });*/
            if (vm.actualItems.length > 0) {
                vm.showBottom = true;
            }
        }

        function closeBottom() {
            vm.showBottom = false;
            vm.activeProduct = undefined
            vm.currentTastes = undefined
        }

        function openAllotTaste(p) {
            vm.showBottom = false;
            vm.showAllotTaste = true;
            vm.activeProduct = p || vm.actualItems[0];

            /*if (vm.actualItems.length > 0) {
                vm.showAllotTaste = true;
                vm.activeProduct = p || vm.actualItems[0];
            }*/
        }

        function closeAllotTaste() {
            vm.showAllotTaste = false;
            vm.activeProduct = undefined
            vm.currentTastes = undefined
        }

        function setProductActive(p) {
            vm.activeProduct = p;
        }

        function goFinal() {
            if (vm.actualItems.length <= 0) {
                return;
            }
            RunStoreService.setOrderItems(vm.actualItems);
            var orderType = "takeOut";
            if (urlParam.orderType) {
                orderType = urlParam.orderType
            }
            $location.url('/orderSubmit?storeId=' + storeId +
            '&subStoreId=' + subStoreId + '&orderType=' + orderType);
        }

        function showLoading() {
            vm.showLoading = true;
        }

        function closeLoading() {
            $timeout(function () {
                vm.showLoading = false;
            }, 500);
        }

        function clearDialog() {
            $timeout(function () {
                vm.showWarning = false;
                vm.warningMsg = '';
            }, 1000);
        }


    }
})();
