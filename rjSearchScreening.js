/*global angular */
(function () {
   'use strict';

	angular.module('rjSearchScreening', [])
	.service('Search', ['$http', '$q', function($http, $q){
		return function(url){
			var _this = this;
			_this.deferred = $q.defer();
			this.search = function(query){
				_this.deferred.resolve();
				_this.deferred = $q.defer();
				return $http({
					url: url,
					method:'GET',
					timeout: _this.deferred.promise,
					params: query,
					cache:true
				});
			};
			return this;
		};
	}])
	.directive('rjSearch', ['Search', '$window', '$timeout', function(Search, $window, $timeout){
		return {
			scope: true,
			controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs){
				var _this = this;
				this.power = new Search($attrs.rjSearch);
				this.search = function(term){
					$scope.selected = 0;
					return _this.power.search({
						"searchString": term
					});
				};
				this.selector = function(dir){
					if (dir === 'down' && $scope.selected < $scope.searchRes.length-1) $scope.selected++;
					if (dir === 'up' && $scope.selected > 0) $scope.selected--;
					return this;
				};
				this.poster = function(key){
					$element.find('[value="'+key+'"]').click();
					return this;
				};
				return this;
			}],
			link: function(scope, element, attr){
				scope.showSearch = true;
				$($window).on('keydown', function(e){
					if ($(e.target).is(':input')) return;
					var code = e.keyCode || e.which;
					if(code === 83) { // s
						//$($window).scrollTop(0);
						scope.$apply(function(){
							scope.showSearch = true;
						});
						$timeout(function(){
							$('[rj-search-input]', element).val('').focus();
						},0, false);
						e.preventDefault();
						return;
					}
				});
			}
		};
	}])
	.directive('rjSearchInput', ['$window', function($window){
		return {
			require: '^rjSearch',
			link: function(scope, element, attr, controller){
				scope.searchRes = [];
				scope.search = function(){
					scope.err = null;
					var term = element.val().replace(/^\s+|\s+$/g,'');
					if (term.length < 3) {
						scope.searchRes = [];
						return;
					}
					controller.search(term).then(function (resp) {
					    scope.searchRes = resp.data;
					}, function (err) {
						if (err.status === 0) return;
						scope.err = err;
					});
				};
				element.on('focus', function(e) {
					scope.showSearch = true;
				})
				element.on('keyup', function(e) {
					var code = e.keyCode || e.which;
					if (code === 13) { //enter
						e.preventDefault();
						controller.poster(scope.searchRes[scope.selected].Key);
						return false;
					}
					if (code === 40) { //down
						scope.$apply(function(){
							controller.selector('down');
						});
						e.preventDefault();
						return;
					}
					if (code === 38) { //up
						scope.$apply(function(){
							controller.selector('up');
						});
						e.preventDefault();
						return;
					}
					if (code === 27) { //esc
						scope.$apply(function(){
							element.blur();
							scope.showSearch = false;
						});
						e.preventDefault();
						return;
					}

					scope.$apply(function(){
						scope.search();
					});

				});


			}
		};
	}]);

}());