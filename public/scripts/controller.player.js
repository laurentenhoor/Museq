(function() {

  museq.Player = function(beat) {

    /**
     * Mixins
     */
    museq.mixins.EventTarget.call(this);

    var _clients = {};
    var _instruments = [];
    
    var _tracks = {};
    var _context = null;
    var _masterGainNode = null;

    var _currentTime = 0;
    var _noteTime = 1;
    var _noteIndex = 0;
    var _startTime = 0;
    var _startTimeDraw = 0;
    var _tempo = 120;
    var _loopLength = 16;
    var _started = false;
    var _lastDrawTime = -1;

    var _self = this;

    var _stopCallback = null;
    var _twoBeatsIndex = 0;

    var samplesPath = '';

    this._playbackRate = 1;

    
    this.initialize = function() {

        // Create context.
    	try {
    		window.AudioContext = window.AudioContext || window.webkitAudioContext;
    		_context = new window.AudioContext();
    	} catch (e) {
    	    alert("No Web Audio API support");
    	}
		
        // Create master gain control.
        _masterGainNode = _context.createGain();
        _masterGainNode.gain.value = 0.7;

        this.createInstruments();
    };



    this.createInstruments = function() {
        _instruments = [];
        var instrumentsConfig = beat.instruments;
        
        for (var i = 0; i < instrumentsConfig.length; i++) {
            var tracks = this.createTracks(i, instrumentsConfig[i].tracks, instrumentsConfig[i].type);
            var instrument = new museq.models.Instrument(i, instrumentsConfig[i].name, tracks, 1.0, instrumentsConfig[i].type, instrumentsConfig[i].color);
            instrument.setup(_context);
            _instruments.push(instrument);
        };

        _availableInstruments = _instruments.concat();
    };

    this.createTracks = function(instrumentId, tracksConfig, type) {
        console.log('createTracks');
        var tracks = [];
        for (var i = 0; i < tracksConfig.length; i++) {
            var config = tracksConfig[i];

            if (type === 'samples') {
                var track = new museq.models.Track(instrumentId + '-' + i, config.name, null, samplesPath + config.sampleUrl, 1.0);
            } else {
                var track = new museq.models.Track(instrumentId + '-' + i, config.name, null, null, 1.0);
                track.note = config.note;
                console.log('track', track);
            };
            tracks.push(track);
        }

        return tracks;
    };
    
    
    this.stop = function() {

    	_started = false;
    	_noteIndex = 0;
    };
 
    
    this.startTwoBeats = function(stopCallback) {
    	this.start();
    	_stopCallback = stopCallback;
    };
    
    function increaseTwoBeatsIndex() {
    	_twoBeatsIndex++;
        if (_twoBeatsIndex > 1) {
        	_twoBeatsIndex = 0;
        	if (_stopCallback) {
        		_stopCallback()
        		_self.stop();
            	_stopCallback = null;
        	}
        }
        
    }


    this.start = function() {
        
        if (_started) return;
        
        console.log('Started!', this);
        _self.loadBeat();
        
        _started = true;
        _noteTime = 0.0;
        // _startTime = _context.currentTime + 0.160;	
        _startTime = _context.currentTime + 0.005;
        _startTimeDraw = Date.now()/1000 + 0.005;
        _self.schedule();
        
    };

    this.schedule = function() {
        var currentTime = _context.currentTime;
        
        var currentTimeDraw = Date.now()/1000;

        // The sequence starts at startTime, so normalize currentTime so that it's 0 at the start of the sequence.
        currentTime -= _startTime;
        currentTimeDraw -= _startTimeDraw;

        while (_noteTime < (currentTime + 0.200)) {
        	
//        	alert('currentTime: ' + currentTime + "; noteTime: "+ _noteTime +"; startTime: "  + _startTime)	
        	
            // Convert noteTime to context time.
            var contextPlayTime = _noteTime + _startTime;

            for (var i = 0; i < _instruments.length; i++) {
                for (var j = 0; j < _instruments[i].tracks.length; j++) {
                    var track = _instruments[i].tracks[j];
                    var volume = track.notes[_noteIndex];
                    if (_instruments[i].type === 'samples' && _instruments[i].isLoaded()) {
                        if (volume > 0) {
                            _self.playNote(track, contextPlayTime, volume);
                        }
                    } else if (_instruments[i].type === 'synth') {

                        if (volume > 0) {
                            _instruments[i].play(track.note);
                        } else {
                            _instruments[i].stop();
                        }
                    }
                }
            }

            // Attempt to synchronize drawing time with sound
            if (_noteTime != _lastDrawTime) {
                _lastDrawTime = _noteTime;
//                setInterval(function(){
//                	_self.emit(museq.enums.Events.SEQUENCER_BEAT, _noteIndex);
//                }, 5);
                _self.emit(museq.enums.Events.SEQUENCER_BEAT, _noteIndex);
                
            }
            _self.step();
            
        }
        
        if (_started) {
        	requestAnimationFrame(_self.schedule);
        };
        
    };

    this.playNote = function(track, noteTime, volume) {
        // Create the note
        var voice = _context.createBufferSource();
        voice.buffer = track.getBuffer();
        
//        alert(voice.buffer.length)
        
//        alert(voice.buffer);

//        // Create a gain node.
        var gainNode = _context.createGain();
//        // Connect the source to the gain node.
        voice.connect(gainNode);

        voice.playbackRate.value = this._playbackRate;

        // Connect the gain node to the destination.
//        gainNode.connect(_masterGainNode);
        

        // Reduce the volume.
//        gainNode.gain.value = volume;
        gainNode.connect(_context.destination);

        voice.connect(_context.destination);
        
        if (!voice.start) {
        	voice.start = voice.noteOn;
        }
        voice.start(noteTime);
    };

    this.step = function() {
        // Advance time by a 16th note...
        var secondsPerBeat = 60.0 / _tempo;
        _noteTime = _noteTime + 0.25 * secondsPerBeat;
        _noteIndex++;
        

        if (_noteIndex == _loopLength) {
            _noteIndex = 0;
            increaseTwoBeatsIndex();
            
            // pattern++;
        }
    };
       
    this.loadBeat = function() {
    	
		var instruments = beat.instruments;
		
  		$.each(instruments, function(instrument_key, instrument) {
  			$.each(instrument.tracks, function(track_key, track) {
  				_instruments[instrument_key].tracks[track_key].notes = track.notes;
  			})
  		});
    	
    };
    
    this.initialize();
    
  };

}());


