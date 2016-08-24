(function() {

	
  museq.Vote = function(beats_to_vote) {

	
    museq.mixins.EventTarget.call(this);

    var _self = this;
    var _playableBeats = null;
    
    
    this.initialize = function() {

    	_playableBeats = beats_to_vote;

    	console.log('initialialize Vote controller')
    	
    	
    	$.each(beats_to_vote, function(beatKey, beat) {
    		console.log(beat)
    		_playableBeats[beatKey].player = new museq.Player(beat);
    	});
    	
    };
    
    
    this.getBeats = function() {
    	return _playableBeats;
    };
    
    
    this.initialize();

  };

  
}());