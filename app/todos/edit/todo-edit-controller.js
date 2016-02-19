angular.module('boilerplate')
	.controller('Todo.Edit.Controller', ['$location', '$routeParams', 'Todos.dataService', function ($location, $routeParams, dataService) {
		'use strict';

		this.item = null;

		dataService.get($routeParams.id)
			.then(function (item) {
				this.item = angular.copy(item);
			}.bind(this));

		this.save = function () {
			dataService.save(this.item);
			$location.path('/todos');
		};
	}]);
