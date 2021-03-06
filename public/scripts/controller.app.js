(function() {

	museq.App = function(el) {
		
		var _instruments = {};
		var _totalInstruments = 0;
		var _sequencer;

		var _sequencerView;
		var _homeView;

		var _voteView;
		var _el = el;

		var _self = this;

		var _appStatus;	

		var _onGetInstrument = function(data) {

			console.log('Got a request for an instrument', data);

			var instrument = _sequencer.getNextInstrument(data.client);

			if (instrument) {
				console.log('>>> Instrument', instrument);
				if (typeof _instruments[data.client] === 'undefined') {
					_totalInstruments++;
					_sequencerView.addInstrument(instrument);
					_instruments[data.client] = instrument;
					$('#roomId').hide();
				}
			} else {
				console.log('No more instruments available.');
			}
		};

		var _onModifierChange = function(data) {
			_sequencer.updateFxParam(data.args);
		};


		this.loadWaiting = function(status) {


			$(".username").text(status.user);
			$(".generation").text(status.generation);

			if (status.voting ) {

				$(".waiting-votes-amount").text(1);
				$.each(status.voters, function(key, user) {
					$('#voters-list').append(user+'<br>')
				});

				$('#waiting-vote').show();
			} else {

				$(".waiting-compositions-amount").text(3-status.variants);
				$('#waiting-sequencer').show();
			}
			$('#waiting-notify').show();
			
			$('#notify-input').val(status.email);
			
			
			$('#notification-email').text(status.email);
			if (status.notification) {
				$('#get-notification-part').hide();
				$('#have-notification-part').show();
			} else {
				$('#get-notification-part').show();
				$('#have-notification-part').hide();
			}
			
			$('#notify-btn').on('click', function() {
				
				var data = {
					email : $('#notify-input').val() 	
				};
			
				$.ajax({
					url: "./api/v1/notify_me/",
					contentType:"application/json; charset=utf-8",
					method: "POST",
					data : JSON.stringify(data),
					beforeSend : function(xhr) {
						xhr.setRequestHeader('Authorization', $.cookie("token"));
					}
				}).done(function(data) {
					if (data.success) {
						$('#get-notification-part').hide();
						$('#have-notification-part').show();
						$('#notification-email').text(data.email);
					} else {
						console.log(data)
						$('#notify-message').text(data.msg);
					}
					
				});	
				
			});
			
			
			$('#play-around-btn').on('click', function() {
				$('#waiting-sequencer').hide();
				$('#waiting-vote').hide();
				$('#waiting-notify').hide();
				_self.loadSequencer(false);
				$('#try-header').hide();
				$('#play-around-header').show();	
				
			});
			

//			setInterval(function() {
//				location.reload();
//			}, 30000)

		};


		this.loadSequencer = function(evolutionStatus) {

			_sequencer = new museq.Sequencer();

			_sequencerView = new museq.views.SequencerView($(_el)).initialize()//.hide();
			_sequencerView.on(museq.enums.Events.NOTE, _sequencer.updateNote)
			

			_sequencer.on(museq.enums.Events.SEQUENCER_BEAT, function(beat) {
				_sequencerView.drawPlayhead(beat);
			});
			_sequencer.on(museq.enums.Events.LOAD_PATTERN, function(instruments) {
				_sequencerView.redrawNotes(instruments);
			});
			
			
			if (evolutionStatus) {
				$('.current-generation').text(evolutionStatus.generation-1);
				$('#sequencer-header').show();
				$('table').show();

				_sequencerView.on(museq.enums.Events.SAVE_BEAT, function(instruments) {

					console.log(evolutionStatus);

					_sequencer.saveBeat(evolutionStatus.generation);
					console.log('Event SAVE BEAT triggered.');
				});

			} else {
				$('#try-header').show();
				$('#login').hide();
			}
			
		
			var dummy = {};
			dummy.client = 1;
			_onGetInstrument(dummy);
			dummy.client = 2;
			_onGetInstrument(dummy);
			dummy.client = 3;
			_onGetInstrument(dummy);
			dummy.client = 4;
			_onGetInstrument(dummy);

//			_sequencerView.scrollInstrument();

			_sequencer.loadBeat();

			_sequencerView.show();

		};
		


		this.loadVote = function(status) {

			$('table').hide();
			$('#vote-header').show();
			$('.current-generation').text(status.generation);

			$.ajax({
				url: "./api/v1/beats_to_vote/",
				contentType:"application/json; charset=utf-8",
				method: "GET",
				beforeSend : function(xhr) {
					xhr.setRequestHeader('Authorization', $.cookie("token"));
				}
			}).done(function(beats_to_vote) {
				_voteView = new museq.views.VoteView(_el, new museq.Vote(beats_to_vote));
			});

		}


		this.loadLogin = function() {
			new museq.views.LoginView();
		};


		this.initialize = function() {

//			console.log(window.localStorage.getItem('token'));
//			console.log($.cookie("token"))
			
			if ($.cookie("token")) {
				
				$.ajax({
					url: "./api/v1/status/",
					contentType:"application/json; charset=utf-8",
					method: "GET",
					beforeSend : function(xhr) {
						xhr.setRequestHeader('Authorization', $.cookie("token"));
					}
				}).done(function(evolutionStatus) {
					
					console.log(evolutionStatus);
					
					if (evolutionStatus.success == false) {
						 window.location = '/logout';
					} else if (evolutionStatus.voting) {
						if (evolutionStatus.voted) {
							_self.loadWaiting(evolutionStatus);
							
						} else {
							_self.loadVote(evolutionStatus);							
						}
					} else {
						if (evolutionStatus.mutated) {
							_self.loadWaiting(evolutionStatus);
						} else {
							$('#sequencer-intro').show();
							
							$('.previous-generation').text(evolutionStatus.generation-1);
							$('#prev-gen-winner').text(evolutionStatus.winnerPrevGen)
							$('#sequencer-start-btn').on('click', function() {
								$('#sequencer-intro').hide();
								_self.loadSequencer(evolutionStatus);
							});
						}
						
					}

				});

			} else {
				
				_self.loadSequencer(false);
				
				$('#join-revolution').on('click', function() {
					_self.loadLogin();
					$('table').hide();
					$('#museq').css('padding-top', 0);
					
					$('#try-header').hide();
					
					fbq('track', 'Lead');
					ga('send', 'event', 'Museq', 'showLogin');
				});
				
//				$('#try-btn').on('click', function() {
//					_self.loadSequencer(false);	
//					fbq('track', 'ViewContent');
//				});
			}

		};
		
		this.initialize();
		
	};

}());


