(function() {


	museq.views.LoginView = function(el) {

		/**
		 * Museq
		 */
		museq.mixins.Wrapper.call(this);

		var _self = this;

		var $parent = $(el);
		$parent.append($('<div>').attr('id', 'home-view'));
		var $loginView = $parent.find('#home-view');


		/**
		 * Initializes the component
		 *
		 * @private
		 * @function
		 * @return {museq.views.VoteView} A reference to this instance.
		 */
		this.initialize = function() {
			_addEventListeners();

			this.show();

			return this;
		};


		/**
		 * Adds all the listeners to the elements.
		 *
		 * @private
		 * @function
		 */
		var _addEventListeners = function() {
			$('#login').show();	
			
			$('#login-btn').on('click', function() {

				$('#login-message').text("");
				var username = $('#username-input').val();
				var password = $('#password-input').val();
				
				login(username, password);

			});

			$('#join-btn').on('click', function() {

				$('#login-message').text("");
				var username = $('#username-input').val();
				var password = $('#password-input').val();

				var data = {
						name : username,
						password : password
				};

				console.log(data);

				$.ajax({
					url: "./api/v1/signup/",
					contentType:"application/json; charset=utf-8",
					method: "POST",
					data: JSON.stringify(data)
				}).done(function(response) {

					if (response.success) {
						fbq('track', "CompleteRegistration");
						login(username, password);
					} else {
						$('#login-message').text(response.msg);
					} 

				});

			});

			function login(username, password) {

				var data = {
					name : username,
					password : password
				};
				
				$.ajax({
					url: "./api/v1/authenticate/",
					contentType:"application/json; charset=utf-8",
					method: "POST",
					data: JSON.stringify(data)
				}).done(function(response) {
					if (response.success) {
					
						$.cookie("token", response.token, {expires : 365});
						window.scrollTo(1,1);
					
						fbq('track', 'Lead');
						
						location.reload();
						
					} else {
						$('#login-message').text(response.msg);
					}

				});
			}

		};

		/**
		 * Shows an HTML element
		 * @return {museq.views.VoteView} A reference to this instance.
		 */
		this.show = function() {
			$loginView.show();
			return this;
		};

		this.hide = function() {
			$loginView.hide();
			return this;
		};

		this.initialize();

	};
}());
