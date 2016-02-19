angular.module('boilerplate')
	.factory('Todos.dataService', ['$http', '$q', function ($http, $q) {
		return {
			items: [],

			getAll: function () {
				return $http({url: 'data.json'})
					.then(function (response) {
						this.items.length = 0;
						[].push.apply(this.items, response.data);

						return this.items;
					}.bind(this))
					.catch(function (response) {
						// Log error
					})
			},

			getItem: function (id) {
				return this.items.filter(function (todo) {
					return todo.id === id;
				})[0];
			},

			get: function (id) {
				return this.items.length ? $q.when(this.getItem(id)) : this.getAll()
						.then(function () {
							return this.getItem(id);
						}.bind(this));;
			},

			save: function (item) {
				this.items.forEach(function (todo, index) {
					if (todo.id === item.id) {
						this.items.splice(index, 1, item);
					}
				}, this);
			},

			remove: function (id) {
				this.items.forEach(function (todo, index) {
					if (todo.id === id) {
						this.items.splice(index, 1);
					}
				}, this);
			}
		};
	}]);
