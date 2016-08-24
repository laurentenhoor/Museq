(function() {

	
	museq.views.HomeView = function(el) {

		/**
		 * Museq
		 */
		museq.mixins.Wrapper.call(this);

		var _self = this;


		var $parent = $(el);
		$parent.append($('<div>').attr('id', 'home-view'));
		var $homeView = $parent.find('#home-view');
		
	
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

		};

		/**
		 * Shows an HTML element
		 * @return {museq.views.VoteView} A reference to this instance.
		 */
		this.show = function() {
			$homeView.show();
			return this;
		};
		
		this.hide = function() {
			$homeView.hide();
			return this;
		};
	
		this.initialize();

	};
}());
