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

			// var instrument = _sequencer.getRandomInstrument(data.client);
			var instrument = _sequencer.getNextInstrument(data.client);

			if (instrument) {
//				_conn.execute(museq.enums.Events.INSTRUMENT, {receiver: data.client, instrument: instrument});
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

		
		this.loadHome = function(status) {
			
		}
		
		
		this.loadSequencer = function(evolutionStatus) {
			
			_sequencer = new museq.Sequencer();

			_sequencerView = new museq.views.SequencerView($(_el)).initialize().hide();
			_sequencerView.on(museq.enums.Events.NOTE, _sequencer.updateNote)
			$('#current-generation').text(evolutionStatus.generation-1);
			$('#sequencer-header').show();
			
			
			_sequencer.on(museq.enums.Events.SEQUENCER_BEAT, function(beat) {
				_sequencerView.drawPlayhead(beat);
//				_conn.execute(museq.enums.Events.SEQUENCER_BEAT, {beat: beat});
			});
			_sequencer.on(museq.enums.Events.LOAD_PATTERN, function(instruments) {
				_sequencerView.redrawNotes(instruments);
			});
			
			_sequencerView.on(museq.enums.Events.SAVE_BEAT, function(instruments) {
				
				console.log(evolutionStatus);
				
				_sequencer.saveBeat(evolutionStatus.generation);
				console.log('Event SAVE BEAT triggered.');
			});

			var dummy = {};
			dummy.client = 1;
			_onGetInstrument(dummy);
			dummy.client = 2;
			_onGetInstrument(dummy);
			dummy.client = 3;
			_onGetInstrument(dummy);
			dummy.client = 4;
			_onGetInstrument(dummy);

			_sequencerView.scrollInstrument();
			
			_sequencer.loadBeat();
			
			_sequencerView.show();
//			_sequencer.start();

		};
		
		this.loadVote = function() {
			
			$('table').hide();
			$('#vote-header').show();
			
			$.ajax({
				url: "./api/v1/beats_to_vote/",
				contentType:"application/json; charset=utf-8",
				method: "GET",
				context: document.body
			}).done(function(beats_to_vote) {
				_voteView = new museq.views.VoteView(_el, new museq.Vote(beats_to_vote));
			});
		}
		

		this.initialize = function() {

			$.ajax({
				url: "./api/v1/status/",
				contentType:"application/json; charset=utf-8",
				method: "GET",
				context: document.body
			}).done(function(evolutionStatus) {
				
				if (evolutionStatus.voting) {
					_self.loadVote();

				} else {
					_self.loadSequencer(evolutionStatus);
				}	
				
			});
			
//			_self.loadHome();
//			_self.loadSequencer();
//			_self.loadVote();

		};
		
		
		this.getAppStatus = function() {
			return _appStatus;
		};

		this.initialize();

	};

}());


