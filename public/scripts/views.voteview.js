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
		$parent.append($('<div>').attr('id', 'vote-view'));
		var $voteView = $parent.find('#vote-view');
		
	
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
		
		
		var _addButtons = function() {
			
			console.log('_addButtons()');
			
			function btnDefault() {
				$('button.play').text('Play');
				$('button.play').removeClass('playing');
			};
			
			$.each(_voteController.getBeats(), function(beatKey, beat) {
				
				$playBtn = $('<button>').addClass('play').text('Play')
				$voteBtn = $('<button>').addClass('vote').text('Vote')//.prop('disabled', true);
				
				$playBtn.on('click', function(){
					if ($('button.play').hasClass('playing'))
						return;
					
					$currBtn = $(this);
					$currBtn.addClass('playing');
						
					beat.player.startTwoBeats(function() {
						btnDefault();
						$currBtn.addClass('played');
						if ($('button.play').length == $('button.played').length) {
							$('button.vote').prop('disabled', false);
						}
					});
					$currBtn.text('...');
				});
				
				$voteBtn.on('click', function(){
					_voteController.stopAllBeats();
					btnDefault();
					_voteController.vote(beat);
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
	
		this.initialize();

	};
}());
