describe('Todos.View.Controller', function () {
	var $controller, $timeout, controller;

	beforeEach(inject(function ($injector) {
		$controller = $injector.get('$controller');
		$timeout = $injector.get('$timeout');
	}));

	beforeEach(function () {
		controller = $controller('Todo.View.Controller', {});
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
	});
});
