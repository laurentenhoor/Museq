(function() {


	museq.Vote = function(beats_to_vote) {

		museq.mixins.EventTarget.call(this);

		var _self = this;
		var _playableBeats = beats_to_vote;


		this.initialize = function() {

			$.each(_playableBeats, function(beatKey, beat) {
				_playableBeats[beatKey].player = new museq.Player(beat);
			});

		};


		this.stopAllBeats = function() {

			$.each(_playableBeats, function(beatKey, beat){
				beat.player.stop();
			});

		};


		this.vote = function(beat) {

			var data = {beatId:beat._id};

			$.ajax({
				url: "./api/v1/vote/",
				contentType:"application/json; charset=utf-8",
				method: "POST",
				data : JSON.stringify(data),
				context: document.body
			}).done(function(status) {
				console.log(status);
			});


		};


		this.getBeats = function() {

			return _playableBeats;

		};


		this.initialize();

	};


}());