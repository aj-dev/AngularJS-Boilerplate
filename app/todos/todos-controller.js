angular.module('boilerplate')
	.controller('Todos.Controller', ['Todos.dataService', function (dataService) {
		'use strict';

		this.isDataLoaded = false;

		this.items = dataService.items;

		if (this.items.length) {
			this.isDataLoaded = true;
			return;
		}

		dataService.getAll()
			.then(function (data) {
				this.isDataLoaded = true;
			}.bind(this));
	}]);
