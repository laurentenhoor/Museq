(function() {

  /**
   * The SequencerView class is responsible for the search UI component
   *
   * @constructor
   * @class SequencerView
   * @param {Object} id The id of this specific connection.
   */
  museq.views.SequencerView = function($el) {

    /**
     * Mixins
     */
    museq.mixins.Wrapper.call(this);

    var _self = this;

    var trackCount = 0;
    var noteCount = 0;
    
    var _instruments = [0,1,2,3];
    var _instrumentCount = -1;
    var _instrumentMax = 4;
    
//    var $el = $(el);
    var $table = $el.find('table');

    var $playhead = undefined;

    var _onToggleNote = function() {

        var noteIndex = $(this).index();

        if (noteIndex === 0) return;

        noteIndex--; // compensate for label
        
        var isItOn = $(this).toggleClass('active').hasClass('active');
        console.log('You clicked me dude', this, noteIndex, $(this).parent().index(), isItOn ? 1 : 0);
        _self.emit(museq.enums.Events.NOTE, {
          volume: isItOn ? 1 : 0,
          note: noteIndex,
          trackId: $(this).parent().data('trackId')
        });
      };
      

        /**
         * Adds all the listeners to the elements.
         *
         * @private
         * @function
         */
        var _addEventListeners = function() {
          $table.on('click', 'td', _onToggleNote);
          $table.on('click', 'td:nth-child(1)', _self.scrollInstrument)
        };
        
      this.redrawNotes = function(instruments) {
    	  
			$.each(instruments, function(instrument_key, instrument) {
	  			$.each(instrument.tracks, function(track_key, track) {
	  				
	  				var $track = $('tr[data-track-id= ' + instrument_key + '-' +track_key + ']');	
	  				
	  				$.each(track.notes, function(note_key, note) {

	  					 var $note = $track.find('td:nth-child(' + (note_key + 2) + ')');
	  					 
	  					 if (note) {
	  						$note.addClass('active');	 
	  					 } else {
	  						$note.removeClass('active');
	  					 }
	  					 
	  					
	  				});
	  			});
	  		});
    	  
      };


      this.scrollInstrument = function() {
          	
           	_instrumentCount++;      	
           	
           	for (var i in _instruments) {
           		
           		if (i == _instrumentCount) {
           			$('tr[data-instrument-id= ' + i + ']').show();		
           		} else {
           			if (_instrumentCount >= _instrumentMax) {
           				$('tr[data-instrument-id= ' + i + ']').show();
           			} else {
           				$('tr[data-instrument-id= ' + i + ']').hide();	
           			}
           			
           		}
           	}
           	
           	if (_instrumentCount ==_instrumentMax) {
           		_instrumentCount = -1;
           	}
           	
          };

    this.drawPlayhead = function(beat) {
      /*
      var labelWidth = $table.find('h1').width();
      var noteWidth = ($(window).width() - labelWidth) / noteCount;

      var offset = labelWidth + noteWidth * (beat);


      if (!$playhead) {
        $playhead = $('#playhead');
        $playhead.css('width', noteWidth);
      }
      $playhead.css('-webkit-transform', 'translate3d(' + offset + 'px, 0, 0)');;
  */
      var $tds = $('th:nth-child(' + (beat + 2) + ')');
//      $tds.on('animationend webkitAnimationEnd oAnimationEnd', function() {
//        $tds.removeClass('beat');
//      });
//      $tds.addClass('beat');
      $('th').css({'background': 'black'});
      $tds.css({'background':'white'});

    };


    this.addInstrument = function(instrument) {
      for (var i = 0; i < instrument.tracks.length; i++) {
        _addTrack(instrument, instrument.tracks[i]);
      }
    };

    this.updateNote = function(data) {
      $track = $('[data-instrument-id="' + data.id + '"][data-track-id="' + data.trackId + '"]');
      $note = $track.find('td').eq(data.noteId + 1);

      console.log('!updateNote', $note, data);

      $note.toggleClass('active', data.volume > 0);
    };

    var _addTrack = function(instrument, track) {
      console.log('addTrack', track);

      if (trackCount === 0) {
        noteCount = track.notes.length;
        _renderHeader(noteCount);
      }

      var $row = $('<tr>').attr('data-instrument-id', instrument.id)
                          .attr('data-track-id', track.id);

      $row.append($('<td><h1>' + track.name + '</h1></td>'));

      for (var i = 0; i < noteCount; i++) {
        var $td = $('<td>');
        $row.append($td);
      }

      $row.css('background', instrument.color);
      $table.append($row);
      trackCount++;
    };

    var _renderHeader = function(length) {
      var $head = $('<thead>');
      for (var i = 0; i < length + 1; i++) {
        var $th = $('<th>');
        $head.append($th);
      }

      //$head.children().eq(0).attr('id', 'playhead');

      $table.append($head);
    };

    /**
     * Shows an HTML element
     * @return {museq.views.SequencerView} A reference to this instance.
     */
    this.show = function() {
      $table.show();
      
      return this;
    };
    
    this.hide = function() {
    	$table.hide();
    	
    	return this;
    }

    this.removeInstrument = function(instrument) {
      $table.find('tr[data-instrument-id="' + instrument.id + '"]').remove();
    };

    /**
     * Initializes the component
     *
     * @private
     * @function
     * @return {museq.views.SequencerView} A reference to this instance.
     */
    this.initialize = function() {
    	_addEventListeners();
    	
      this.show();
      
      return this;
      
    };

  };
    
// To hide and show instruments
//  $('tr[data-instrument-id=0]').hide();

}());
