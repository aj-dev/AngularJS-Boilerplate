describe('Todos.Edit.Controller', function () {
	var $controller, $timeout, controller, dataService;

	beforeEach(module('boilerplate'));

	beforeEach(module(function ($provide) {
		dataService = $provide.factory('Todos.dataService');
		dataService.save = jasmine.createSpy('save').and.callThrough();
	}));

	beforeEach(inject(function ($injector) {
		$controller = $injector.get('$controller');
		$timeout = $injector.get('$timeout');
	}));

	beforeEach(function () {
		controller = $controller('Todo.Eit.Controller', {});
	});

	describe('initial state', function () {
		it('should have initial state', function () {
			expect(controller.item).toBeNull();
		});
	});

	describe('data loaded state', function () {
		it('should have updated state', function () {
			$timeout.flush();

			expect(controller.item).toBe(jasmine.any(Object));
		});

		it('should save todo item', function () {
			var item = {id: '2', description: 'Edited todo item'};

			controller.save(item);

			expect(dataService.save).toHaveBeenCalledWith(item);
			expect(dataService.items[2]).toEqual(item);
		});
	});
});
