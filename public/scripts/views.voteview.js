(function() {

	/**
	 * The VoteView class is responsible for voting the best beat
	 *
	 * @constructor
	 * @class VoteView
	 * @param {Object} id The id of this specific connection.
	 */
	museq.views.VoteView = function(el, voteController) {

		/**
		 * Museq
		 */
		museq.mixins.Wrapper.call(this);

		var _self = this;
		var _voteController = voteController;

		var $parent = $(el);
		$parent.append($('<div>').attr('id', 'voteView'));
		var $voteView = $parent.find('#voteView');
		
		var _addButtons = function() {
			
			console.log('_addButtons()');
			
			function btnDefault() {
				$('button.play').text('Play')
			};
			
			
			$.each(_voteController.getBeats(), function(beatKey, beat) {
				
				$playBtn = $('<button>').addClass('play').text('Play');
				$voteBtn = $('<button>').addClass('vote').text('Vote');
				
				$playBtn.on('click', function(){
					
					$currBtn = $(this);
					btnDefault();
					_voteController.stopAllBeats();
					
					beat.player.startTwoBeats(function() {
						_voteController.stopAllBeats();
						$currBtn.text('Play');
					});
					$currBtn.text('Stop');
				});
				
				$voteBtn.on('click', function(){
					_voteController.vote(beat);
					_voteController.stopAllBeats();
				});
				
				$voteView.append($playBtn);
				$voteView.append($voteBtn);
				$voteView.append('<br>');
				
			});
			
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
			$voteView.show();
			return this;
		};
		
		this.hide = function() {
			$voteView.hide();
			return this;
		};
		/**
		 * Initializes the component
		 *
		 * @private
		 * @function
		 * @return {museq.views.VoteView} A reference to this instance.
		 */
		this.initialize = function() {
			_addEventListeners();
			_addButtons();
			
			this.show();

			return this;
		};
		
		this.initialize();

	};
}());
