angular.module('boilerplate')
	.controller('Todo.View.Controller', ['$routeParams', 'Todos.dataService', function ($routeParams, dataService) {
		'use strict';

		this.item = null;

		dataService.get($routeParams.id)
			.then(function (item) {
				this.item = item;
			}.bind(this));
	}]);
