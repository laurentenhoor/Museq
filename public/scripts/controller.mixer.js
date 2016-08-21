(function() {

  mixr.Mixer = function() {

    var _room_id = 'Mixr_room_1';

    var _instruments = {};
    var _totalInstruments = 0;
    var _sequencer;
    var _sequencerView;

    var _onGetInstrument = function(data) {
      console.log('Got a request for an instrument', data);

      // var instrument = _sequencer.getRandomInstrument(data.client);
      var instrument = _sequencer.getNextInstrument(data.client);

      if (instrument) {
//        _conn.execute(mixr.enums.Events.INSTRUMENT, {receiver: data.client, instrument: instrument});
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

    this.initialize = function() {

//      .on(mixr.enums.Events.GET_INSTRUMENT, _onGetInstrument)
//      .on(mixr.enums.Events.MODIFIER_CHANGE, _onModifierChange);

      _sequencer = new mixr.Sequencer();

      _sequencerView = new mixr.views.SequencerView(document.getElementById('sequencer-view')).initialize();
      _sequencerView.on(mixr.enums.Events.NOTE, _sequencer.updateNote)
      
      _sequencer.on(mixr.enums.Events.SEQUENCER_BEAT, function(beat) {
        _sequencerView.drawPlayhead(beat);
//        _conn.execute(mixr.enums.Events.SEQUENCER_BEAT, {beat: beat});
      });
      _sequencer.on(mixr.enums.Events.LOAD_PATTERN, function(instruments) {
          _sequencerView.redrawNotes(instruments);
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
      
    };

  };

//  new mixr.Mixer().initialize();

}());


