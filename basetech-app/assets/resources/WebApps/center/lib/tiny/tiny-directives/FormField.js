define(["tiny-directives/Directive", "tiny-lib/angular"], function(Directive, angular) {
    var DEFAULT_CONFIG = {};
    var FormField = Directive.extend({
        "init" : function() {
                        
        },
        "toAngularDirective" : function() {
            var module = angular.module("wcc", []);
            module.directive('tinyFormfield', function() {
                var directiveConfig = {
                    "restrict" : "E",
                    "transclude" : true,
                    "template" : '<div ng-transclude></div>',
                    "scope" : {
                        "labelwidth" : "="
                    },
                    "controller" : function($scope) {
                        $scope.itemsDomArray = [];
                        this.addItem = function(item, element) {
                            var label = item.label;
                            var verticalAlign = item.verticalAlign;
                            if(void 0 === label){
                                label = "";
                            }
                            var $itemDom = $('<tr class="tiny_form_tr"></tr>');  
                            //����ÿһ��label��Dom
                            var $itemlabelDom = $('<td class="tiny_form_td_label"><label class="tiny_form_label_default">' + label + '</label></td>');
                            //���ݴ�ֱ��������ֵ��������
                            this.setVerticalAlign(verticalAlign, $itemlabelDom);
                            $itemDom.append($itemlabelDom);                
                            var $itemCotentDom = $('<td class = "tiny_form_td_widget"></td>');
                            $itemCotentDom.append(element);
                            $itemDom.append($itemCotentDom);
                            $scope.itemsDomArray.push($itemDom);
                            return $itemDom;
                        };
                        this.getItemDom = function() {
                            return $scope.itemsDomArray;
                        };
                        
                        /**
                         * ����td��*��label���Ĵ�ֱλ��
                         * 
                         * @param {String} ��ֱλ���ַ�������ѡ top��Ĭ��ֵ����bottom��middle
                         * @param {$ Object} ��Ҫ���ô�ֱλ�õ�td DOM
                         */
                        this.setVerticalAlign = function(verticalAlign, $itemTdDom) {
                            //�˴�����verticalAlign��Ĭ��ֵ
                            verticalAlign = (verticalAlign || "top").toLowerCase();
                            //verticalAlign��ȡֵ:top/middle/bottom
                            if ("middle" === verticalAlign) {
                                $itemTdDom.addClass("tiny_form_vertical_middle");
                            } else if ("bottom" === verticalAlign) {
                                $itemTdDom.addClass("tiny_form_vertical_bottom");
                            }
                        };
                    },
                    "link" : function(scope, element, attrs, ctrl) {
                        var itemsDomArray = [];
                        itemsDomArray = ctrl.getItemDom();
                        $(element).append('<table class="tiny_form"><tbody></tbody></table>');
                        var elementBody = element.find("tbody");
                        for (var i = 0, len = itemsDomArray.length; i < len; i++) {
                            elementBody.append(itemsDomArray[i]);
                        }
                        scope.$watch("labelwidth", function(newValue, oldValue) {
                            elementBody.find(".tiny_form_td_label").eq(0).css("width", scope.labelwidth);
                        });                       
                    }
                };
                return directiveConfig;
            });
            module.directive('tinyItem', function() {
                var directiveItemConfig = {
                    require : '^tinyFormfield',
                    restrict : 'E',
                    transclude : true,
                    template : '<div class="tiny_form_td_content clearfix" ng-transclude></div>',
                    replace : true,
                    scope : {
                        label : "=",
                        require : "=",
                        display : "=",
                        labelcls : "=",
                        contentcls : "=",
                        verticalAlign : "=",
                        contentTdAttr : "="
                    },
                    link : function(scope, element, attrs, fieldCtrl) {
                        var $itemDom = fieldCtrl.addItem(scope, element);
                        var verticalAlign = scope.verticalAlign;
                        if(void 0 !== scope.labelcls){
                            $itemDom.find(".tiny_form_td_label").addClass(scope.labelcls);
                        }
                        if(void 0 !== scope.contentcls){
                            $itemDom.find(".tiny_form_td_content").addClass(scope.contentcls);
                        }    
                        scope.$watch("require", function(newValue, oldValue) {
                            if(String(newValue) !== "true"){
                                $itemDom.find(".tiny_item_require").remove();                                
                                $itemDom.prepend('<td class = "tiny_item_require"></td>');
                            }else{
                                $itemDom.find(".tiny_item_require").remove();
                                //�޸�*�Ĵ�ֱλ��
                                var $itemRequireDom = $('<td class = "tiny_form_require tiny_item_require">*</td>');
                                fieldCtrl.setVerticalAlign(verticalAlign, $itemRequireDom);
                                $itemDom.prepend($itemRequireDom);
                            }     
                        });                    
                        scope.$watch("display", function(newValue, oldValue) {
                            if(String(newValue) === "false"){
                                $itemDom.hide();
                            }else{
                                $itemDom.show();
                            }                            
                        });
                        
                        //��������td���ֵ����ԣ����Ը�ʽͬ$attr����
                        scope.$watch("contentTdAttr", function(newValue, oldValue) {
                            if(newValue) {
                                $itemDom.find(".tiny_form_td_widget").attr(newValue);
                            }                            
                        });
                    }                };
                return directiveItemConfig;
            });
        }
    });
    new FormField().toAngularDirective();
    return FormField;
});