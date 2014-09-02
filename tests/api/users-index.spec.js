var db = require('../../src/api/db');
var User = require('../../src/api/resources/users/model')(db);
describe('users controller', function() {
	var resMock, nextMock;
	var Controller = require('../../src/api/resources/users');
	var controller = new Controller(db);
	beforeEach(function() {
		resMock = jasmine.createSpyObj('res', ['json', 'status']);
		nextMock = jasmine.createSpy('next');
	});
	it('should set correct root', function() {
		expect(controller.root).toEqual('/users');
	});
	it('should set correct route', function() {
		expect(controller.route).toEqual('/:user_id');
	});
	describe('middleware', function() {
		it('should try to find user and return error json if not available', function() {
			var req = {
				params: {
					user_id: 'id'
				}
			};
			spyOn(User, 'findById');
			controller.before[0](req, resMock, nextMock);
			expect(User.findById).toHaveBeenCalledWith('id', jasmine.any(Function));
			User.findById.mostRecentCall.args[1](true);
			expect(req.user).toBeUndefined();
			expect(resMock.json).toHaveBeenCalledWith({ error: 'User id not found.' });
			expect(resMock.status).toHaveBeenCalledWith(404);
		});
		it('should set user if available', function() {
			var req = {
				params: {
					user_id: 'id'
				}
			};
			spyOn(User, 'findById');
			controller.before[0](req, resMock, nextMock);
			User.findById.mostRecentCall.args[1](null, 'user');
			expect(req.user).toEqual('user');
			expect(nextMock).toHaveBeenCalled();
		});
	});
	describe('get', function() {
		it('should return user json if available', function() {
			var req = {
				user: 'user'
			};
			controller.get(req, resMock, nextMock);
			expect(resMock.json).toHaveBeenCalledWith(req.user);
		});
	});
});