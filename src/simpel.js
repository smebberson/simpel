/* simpel is a really simple framework for widgets in */
(function () {

	// handly locally scoped reference for _this
	// used within async methods created in s.prototype functions
	var _this;

	// return an initaniated instance of simpel
	window.simpel = function (selector) {

		return _this = new s(selector);

	};

	// constructor for simpel
	function s (selector) {

		this._el = document.querySelector(selector);
		this._state = this._el.getAttribute('data-view');
		this._stateMethods = {};
		this._methods = {};
		this.initViews();

	}

	// set the new state
	s.prototype.state = function (id) {
		// update the internal reference
		this._state = id;
		// actually switch the views, turn all others off
		this.switchViews(this._state);
		// call any functions that need to be executed when moving to the new state
		this.applyMethod(this._state);
	}

	// bind the ballback to an event on the selector
	// or bind a function to a state change
	s.prototype.on = function (selector, event, callback) {

		if (selector === 'state') {
			// event becomes, view and callback becomes either method, or function
			this._stateMethods[event] = this._stateMethods[event] || [];
			this._stateMethods[event].push(callback);
		} else {
			var el = this._el.querySelector(selector);
			el.addEventListener(event, function (event) {
				callback(event);
			});
		}
	};

	// create a method on this, and proxy execution to ensure context
	s.prototype.method = function (prop, fn) {

		// store the reference to the key and function
		this._methods[prop] = fn;

		// create the function on 'this' so it's easily executable
		this[prop] = function () {
			// apply the function, in the context of _this
			_this._methods[prop].apply(_this, arguments)
		};

	};

	// return a reference to a DOM element within the parent selector provided
	s.prototype.el = function (selector) {
		return this._el.querySelector(selector);
	};

	/*
		Internal methods
	*/

	// internal method
	s.prototype.applyMethod = function (state) {

		if (!this._stateMethods[state]) return;

		for (var i = 0; i < this._stateMethods[state].length; i++) {
			var handler = this._stateMethods[state][i];
			if (typeof handler === 'function') {
				handler.call(this);
			} else if (typeof handler === 'string' && this._methods[handler]) {
				this._methods[handler].apply(this);
			}

		}

	};

	// initialise the view state of our app
	s.prototype.initViews = function () {
		this.switchViews(this._state);
	}

	// switch views, simple turn one on and others off
	s.prototype.switchViews = function (id) {

		// loop through all children of this.el
		for (var i = 0; i < this._el.children.length; i++) {

			if (this._el.children[i].id !== id) {
				this._el.children[i].style.display = 'none';
			} else {
				this._el.children[i].style.display = 'block';
			}

		}

	}

})();