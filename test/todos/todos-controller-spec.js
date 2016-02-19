describe('Todos.Controller', function () {
	var $controller, $timeout, controller;

	beforeEach(inject(function ($injector) {
		$controller = $injector.get('$controller');
		$timeout = $injector.get('$timeout');
	}));

	beforeEach(function () {
		controller = $controller('Todos.Controller', {});
	});

	describe('initial state', function () {
		it('should have initial state', function () {
			expect(controller.isDataLoaded).toBe(false);
			expect(controller.items.length).toBe(0);
		});
	});

	describe('data loaded state', function () {
		it('should have updated state', function () {
			$timeout.flush();

			expect(controller.isDataLoaded).toBe(true);
			expect(controller.items.length).toBe(10);
		});
	});
});
