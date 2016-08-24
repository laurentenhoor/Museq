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
    	
    	console.log("TODO: Vote for beat with _id: "+ beat._id)
    	
    };
    
    
    this.getBeats = function() {
    	
    	return _playableBeats;
    	
    };
    
    
    this.initialize();

  };

  
}());