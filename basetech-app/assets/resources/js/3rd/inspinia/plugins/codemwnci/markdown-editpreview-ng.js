/* ===================================================
 * markdown-editpreview-ng.js v1.0.0
 * http://github.com/codemwnci/markdown-editpreview-ng.js
 * ===================================================
 * Copyright 2013-2014 Wayne Ellis
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

// directive 
(function() { 'use strict';
  angular.module('codemwnci.markdown-edit-preview', [])

  .directive('markdown', ['$window', '$sce', function($window, $sce) {
    var converter = $window.Markdown.getSanitizingConverter();

    return {
      template: "<div ng-bind-html='sanitisedHtml' />",
      restrict: 'E',
      replace: true,
      scope: {   
        markdown: '=bindFrom' ,
        class: '='
      },
      link: function(scope, element, attrs) {  
        scope.$watch('markdown', function(value) {
          if (value != undefined && value != '') {                        
            scope.html = converter.makeHtml(value); 
          	scope.sanitisedHtml = $sce.trustAsHtml(scope.html);
          }
        });
      }
    };
  }])

  .directive('markdownedit', ['$modal', function($modal) {
    return {
      restrict: 'A',
      replace: false,
      link: function(scope, element, attrs) {  
        var hiddenButtons = attrs.markdownHiddenButtons ? attrs.markdownHiddenButtons.split(",") : new Array();
        hiddenButtons.push('cmdPreview');
        hiddenButtons.push('cmdImage');
        element.markdown({hiddenButtons: hiddenButtons, additionalButtons: [[getImageExtButton($modal, attrs.uploadPathPrefix, attrs.uploadApiUrl)]]});        
      },
    };
  }])
  
  .controller('UploadImageCtrl', function ($scope, $modalInstance, $upload, uploadApiUrl) {
      $scope.uploadError = false;
	  $scope.uploadingLocally = true;
	  $scope.outlink= 'http://';
	  $scope.validate = function(f) {return true;}
	  $scope.onFileChange = function(f) { $scope.uploadError = false; }
	  $scope.upload = function () {
		  if (!$scope.uploadingLocally) {
			  $modalInstance.close($scope.outlink);
			  return;
		  }
		  
		  if ($scope.files && $scope.files.length) {
  	        for (var i = 0; i < $scope.files.length; i++) {
  	            var file = $scope.files[i];
  	            $upload.upload({
  	                url: uploadApiUrl,
  	                file: file
  	            }).progress(function (evt) {
  	                //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
  	                //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
  	            }).success(function (data, status, headers, config) {
  	            	if (!data) {
  	            		$scope.uploadError = true;
  	  	            	$scope.errorMsg = '系统异常';
  	            		console.debug(data, status, headers, config);
  	            		return;
  	            	}
  	            	if (!data.success) {
  	            		$scope.uploadError = true;
  	  	            	$scope.errorMsg = '' || data.errorMessage;
  	            		console.debug(data, status, headers, config);
  	            		return;
  	            	}
                    /*
  	            	if (!data.result) {
  	            		$scope.uploadError = true;
  	  	            	$scope.errorMsg = '系统异常';
  	            		console.debug(data, status, headers, config);
  	            		return;
  	            	}
                    */
  	            	$modalInstance.close(data.url);
  	            	
  	            }).error(function(data, status, headers, config) {
  	            	$scope.uploadError = true;
  	            	$scope.errorMsg = '系统异常';
  	            	console.debug(data, status, headers, config);
  	            });
  	        }
  	    }
	};

	$scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	};
	$scope.onTabSelected = function() {
		$scope.uploadingLocally = !$scope.uploadingLocally;
	};
  })
  

  .run(['$templateCache', function ($templateCache) {
      $templateCache.put('template/markdown/upload.html',
	      '<div class="modal-header">' +
	      '	<h3 class="modal-title">插入图片</h3>' +
	      '</div>' +
	      '<div class="modal-body">' +
	      '	<div class="row">' +
	      '		<div class="col-md-3">' +
	      '			<ul class="nav nav-pills nav-stacked">' +
	      '				<li ng-class="{active: uploadingLocally}"><a ng-click="onTabSelected()">本地上传</a></li>' +
	      '				<li ng-class="{active: !uploadingLocally}"><a ng-click="onTabSelected()">外链引用</a></li>' +
	      '			</ul>' +
	      '		</div>' +
	      '		<div class="col-md-9" style="padding-left:0;">' +
	      '			<div ng-show="uploadingLocally" ng-file-drop ng-file-select ng-model="files" ng-multiple="false" allow-dir="true"' +
	      '				ng-accept="validate($file)" drop-available="dropAvailable"' +
	      '				ng-file-change="onFileChange($file)"' +
	      '				drag-over-class="{accept:\'dragover\', reject:\'dragover-err\', delay:100}" ' +
	      '				class="upload-drop-box">' +
	      '				<div ng-hide="dropAvailable" class="tips">当前浏览器不支持拖曳方式上传文件</div>' +
	      '				<div ng-show="dropAvailable" class="tips">拖曳图片文件到这里<br/>或</div>' +
	      '				<div class="tips">点击这里选择文件</div>' +
	      '			</div>' +
	      '			<div ng-show="uploadingLocally && files.length>0 && !uploadError" class="tips-selected">已选择文件: {{files[0].name}}</div>' +
	      '			<div ng-if="uploadError && uploadingLocally" ng-bind="errorMsg" class="upload-error"></div>' +
	      '			<div ng-hide="uploadingLocally">' +
	      '				<textarea ng-model="outlink" class="form-control text-28"' +
	      '					style="height: 128px; padding: 8px 12px; font-size: 16px; color: #777;"></textarea>' +
	      '			</div>' +
	      '		</div>' +
	      '	</div>	' +
	      '</div>' +
	      '<div class="modal-footer">' +
	      '	<button class="btn btn-primary" ng-click="upload()">插入</button>' +
	      '	<button class="btn btn-warning" ng-click="cancel()">取消</button>' +
	      '</div>' +
	      '<style>' +
	      '.upload-drop-box {' +
	      '	background: rgb(248, 248, 248);' +
	      '	border: 3px dashed rgb(221, 221, 221);' +
	      '	border-image-source: initial;' +
	      '	border-image-slice: initial;' +
	      '	border-image-width: initial;' +
	      '	border-image-outset: initial;' +
	      '	border-image-repeat: initial;' +
	      '	text-align: center;' +
	      '	padding: 25px;' +
	      '	color: #999;' +
	      '	font-size: 16px;' +
	      '}' +
	      '.modal-footer {' +
	      '	margin-top: 0;' +
	      '}' +
	      '.nav>li>a, label{' +
	      '	font-size:14px;' +
	      '}' +
	      '.tips-selected {padding: 15px 0 0; font-size: 14px;}' +
	      '.upload-error {padding: 15px 0 0; color: #FA290F;}' +
	      '</style>'
      );
	}])
	;
  
	function getImageExtButton($modal, pathPrefix, uploadApiUrl) {
	
		function onImageClick(e) {
			  var chunk, cursor, selected = e.getSelection(), content = e.getContent(), link;
		    if (selected.length == 0) {
		        chunk = '此处填写图片描述';
		    } else {
		        chunk = selected.text;
		    }
		    $modal.open({
		        templateUrl: 'template/markdown/upload.html',
		        controller: 'UploadImageCtrl',
		        resolve: {
		    	    uploadApiUrl: function () {
		                return uploadApiUrl;
		            }
		        }
		    })
		    .result.then(function (path) {
		        if (path != null) {
		            if (/http[s]?:\/\//i.test(path)) {
		                e.replaceSelection('\n!['+chunk+']('+path+' "此处填写图片标题")\n');
		            } else {
		                e.replaceSelection('\n!['+chunk+']('+pathPrefix+path+' "此处填写图片标题")\n');
		            }
		            cursor = selected.start+2;
		            e.setSelection(cursor,cursor+chunk.length);
                    
                    // bugfix: ng-model doesn't update after inserting image 
                    e.$element.trigger('change');
		        } 
		    });
		}
		
		return {
			name: 'groupLink',
			data: [{
				name: 'cmdExtImage',
				callback: onImageClick,
				title: 'Image',
				icon: { glyph: 'glyphicon glyphicon-picture', fa: 'fa fa-picture-o', 'fa-3': 'icon-picture' }
			}]
		};
	}

}).call(this);
