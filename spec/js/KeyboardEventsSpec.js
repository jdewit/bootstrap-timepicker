describe('Keyboard events feature', function() {
  'use strict';

  var $input1,
    $input2,
    $input3,
    $input5,
    $timepicker1,
    $timepicker2,
    $timepicker3,
    $timepicker5,
    tp1,
    tp2,
    tp3,
    tp5;

  beforeEach(function () {
    loadFixtures('timepicker.html');

    $input1 = $('#timepicker1');
    $timepicker1 = $input1.timepicker();
    tp1 = $timepicker1.data('timepicker');

    $input2 = $('#timepicker2');
    $timepicker2 = $input2.timepicker({
      template: 'modal',
      showSeconds: true,
      minuteStep: 30,
      secondStep: 30,
      defaultTime: false
    });
    tp2 = $timepicker2.data('timepicker');

    $input3 = $('#timepicker3');
    $timepicker3 = $input3.timepicker({
      defaultTime: '23:15:20',
      showMeridian: false,
      showSeconds: true,
      template: false
    });
    tp3 = $timepicker3.data('timepicker');

    $input5 = $('#timepicker-snapper');
    $timepicker5 = $input5.timepicker({
      snapToStep: true
    });
    tp5 = $timepicker5.data('timepicker');
  });

  afterEach(function () {
    $input1.data('timepicker').remove();
    $input2.data('timepicker').remove();
    $input3.data('timepicker').remove();
    $input5.data('timepicker').remove();
    $input1.remove();
    $input2.remove();
    $input3.remove();
    $input5.remove();
  });

  it('should be able to set time via input', function() {
    $input1.trigger('focus');
    expect(tp1.highlightedUnit).toBe('hour');
    $input1.autotype('{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}9:45a{{tab}}');

    expect(tp1.highlightedUnit).toBe('minute');
    expect(tp1.getTime()).toBe('9:45 AM');
    expect($input1.is(':focus')).toBe(false);
  });

  it('should be able to control element by the arrow keys', function() {
    tp1.setTime('11:30 AM');
    tp1.update();

    $input1.trigger('focus');
    expect(tp1.highlightedUnit).toBe('hour', 'hour should be highlighted by default');
    // hours
    $input1.autotype('{{up}}');
    expect(tp1.getTime()).toBe('12:30 PM', '1');
    $input1.autotype('{{down}}');
    expect(tp1.getTime()).toBe('11:30 AM', '2');
    expect(tp1.highlightedUnit).toBe('hour', 'hour should be highlighted');

    $input1.autotype('{{right}}');
    expect(tp1.highlightedUnit).toBe('minute', 'minute should be highlighted');

    //minutes
    $input1.autotype('{{up}}');
    expect(tp1.getTime()).toBe('11:45 AM', '3');
    expect(tp1.highlightedUnit).toBe('minute', 'minute should be highlighted 1');

    $input1.autotype('{{down}}');
    expect(tp1.getTime()).toBe('11:30 AM', '4');
    expect(tp1.highlightedUnit).toBe('minute', 'minute should be highlighted 2');

    $input1.autotype('{{right}}');
    expect(tp1.highlightedUnit).toBe('meridian', 'meridian should be highlighted');

    //meridian
    $input1.autotype('{{up}}');
    expect(tp1.getTime()).toBe('11:30 PM', '5');
    expect(tp1.highlightedUnit).toBe('meridian', 'meridian should be highlighted');

    $input1.autotype('{{down}}');
    expect(tp1.getTime()).toBe('11:30 AM', '6');
    expect(tp1.highlightedUnit).toBe('meridian', 'meridian should be highlighted');

    $input1.autotype('{{left}}');
    expect(tp1.highlightedUnit).toBe('minute', 'minutes should be highlighted');

    // minutes
    $input1.autotype('{{down}}');
    expect(tp1.getTime()).toBe('11:15 AM', '7');

    $input1.autotype('{{left}}');
    expect(tp1.highlightedUnit).toBe('hour', 'hours should be highlighted');

    // hours
    $input1.autotype('{{down}}');
    expect(tp1.getTime()).toBe('10:15 AM', '8');

    $input1.autotype('{{left}}');
    expect(tp1.highlightedUnit).toBe('meridian', 'meridian should be highlighted');

    // meridian
    $input1.autotype('{{down}}');
    expect(tp1.getTime()).toBe('10:15 PM', '9');
  });

  it('should move the cursor left when shift+tab is pressed', function() {
    $input1.trigger('focus');
    $input1.autotype('{{tab}}{{right}}');
    expect(tp1.highlightedUnit).toBe('meridian');

    $input1.autotype('{{shift}}{{tab}}{{tab}}{{/shift}}');
    expect(tp1.highlightedUnit).toBe('hour');

    $input1.autotype('{{shift}}{{tab}}{{/shift}}');
    expect($input1.is(':focus')).toBe(false);
  });

  it('should be able to control element with arrow keys and tab', function() {
    tp5.setTime('12:00 AM');
    tp5.update();
    $input5.trigger('focus');
    $input5.autotype('{{down}}{{tab}}{{up}}{{tab}}');
    expect(tp5.getTime()).toBe('11:15 PM');
    expect(tp5.highlightedUnit).toBe('meridian', 'tab should have highlighed meridian');

    $input5.autotype('{{shift}}{{tab}}{{/shift}}{{up}}');
    expect(tp5.getTime()).toBe('11:30 PM', 'shift+tab up should have incremented minutes to next step');

    $input5.autotype('{{shift}}{{tab}}{{tab}}{{/shift}}');
    expect($input5.is(':focus')).toBe(false, 'timepicker should not be focused');
  });

  it('should be able to change time via widget inputs in a dropdown', function() {
    var $hourInput = tp1.$widget.find('input.bootstrap-timepicker-hour'),
    $minuteInput = tp1.$widget.find('input.bootstrap-timepicker-minute'),
    $meridianInput = tp1.$widget.find('input.bootstrap-timepicker-meridian'),
    eventCount = 0,
    time;

    tp1.setTime('9:30 AM');
    $input1.parents('div').find('.input-group-addon').click();

    $input1.timepicker().on('changeTime.timepicker', function(e) {
      eventCount++;
      time = e.time.value;
    });

    expect(tp1.isOpen).toBe(true, 'dropdown should be open');

    expect(tp1.getTime()).toBe('9:30 AM', 'should be default time');

    $hourInput.trigger('focus');
    expect(eventCount).toBe(0, 'event count should be 0');
    $hourInput.autotype('{{back}}{{back}}11{{tab}}');

    expect(tp1.getTime()).toBe('11:30 AM');
    expect(eventCount).toBe(4, 'incorrect update events thrown');
    expect(time).toBe('11:30 AM', 'event throwing wrong time');

    $minuteInput.autotype('{{back}}{{back}}45{{tab}}');

    expect(tp1.minute).toBe(45);
    expect(eventCount).toBe(8, 'incorrect update events thrown');
    expect(time).toBe('11:45 AM');

    $meridianInput.autotype('{{back}}{{back}}pm{{tab}}');

    expect(tp1.meridian).toBe('PM');
    expect(eventCount).toBe(12, 'incorrect update events thrown');
    expect(time).toBe('11:45 PM');
  });

  it('should still be empty if input is empty', function() {
    $input1.autotype('{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}{{tab}}');

    expect($input1.val()).toBe('');
  });

  it('should allow time to be changed via widget inputs in a modal', function() {
    tp2.setTime('9:30 AM');
    tp2.update();
    $input2.parents('div').find('.input-group-addon').click();

    var $hourInput = $('body').find('input.bootstrap-timepicker-hour'),
        $minuteInput = $('body').find('input.bootstrap-timepicker-minute'),
        $secondInput = $('body').find('input.bootstrap-timepicker-second'),
        $meridianInput = $('body').find('input.bootstrap-timepicker-meridian');

    $hourInput.autotype('{{back}}{{back}}2{{tab}}');
    expect(tp2.getTime()).toBe('2:30:00 AM');

    $minuteInput.autotype('{{back}}{{back}}0{{tab}}');
    expect(tp2.getTime()).toBe('2:00:00 AM');

    $secondInput.autotype('{{back}}{{back}}30{{tab}}');
    expect(tp2.getTime()).toBe('2:00:30 AM');

    $meridianInput.autotype('{{back}}{{back}}p{{tab}}');
    expect(tp2.getTime()).toBe('2:00:30 PM');
  });

  it('should be 12:00 AM if 00:00 AM is entered', function() {
    $input1.autotype('{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}0:0 AM{{tab}}');

    expect(tp1.getTime()).toBe('12:00 AM');
  });

  it('should snap to nearest step or overflow to zero if snapToStep is true', function() {
    // TODO
    // $input5.trigger('focus');
    // expect(tp5.highlightedUnit).toBe('hour');
    // $input5.autotype('12:43p{{tab}}{{tab}}{{down}}');
    // expect(tp5.getTime()).toBe('12:45 PM');
  });

  it('should validate input', function() {
    var $hourInput = tp1.$widget.find('input.bootstrap-timepicker-hour'),
    $minuteInput = tp1.$widget.find('input.bootstrap-timepicker-minute'),
    $meridianInput = tp1.$widget.find('input.bootstrap-timepicker-meridian'),
    $input3 = tp3.$element;

    tp1.setTime('11:30 AM');
    tp1.update();

    $hourInput.autotype('{{back}}{{back}}10{{tab}}');
    expect(tp1.getTime()).toBe('10:30 AM');

    $minuteInput.autotype('{{back}}{{back}}60{{tab}}');
    expect(tp1.getTime()).toBe('10:59 AM');

    $meridianInput.autotype('{{back}}{{back}}dk{{tab}}');
    expect(tp1.getTime()).toBe('10:59 AM');

    $meridianInput.autotype('{{back}}{{back}}p{{tab}}');
    expect(tp1.getTime()).toBe('10:59 PM');

    $input3.autotype('{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}25:60:60{{tab}}');
    expect(tp3.getTime()).toBe('23:59:59');
  });

  it('should close timepicker widget on TAB out of field', function() {
    $input1.trigger('focus');
    tp1.showWidget();
    expect(tp1.isOpen).toBe(true);
    expect(tp1.highlightedUnit).toBe('hour');

    $input1.autotype('{{tab}}');
    expect(tp1.highlightedUnit).toBe('minute');

    $input1.autotype('{{tab}}');
    expect(tp1.highlightedUnit).toBe('meridian');

    $input1.autotype('{{tab}}');
    expect(tp1.isOpen).toBe(false);
  });

  it('should close timepicker widget on SHIFT+TAB out of field', function() {
    $input1.trigger('focus');
    tp1.showWidget();
    expect(tp1.isOpen).toBe(true);
    expect(tp1.highlightedUnit).toBe('hour');

    $input1.autotype('{{tab}}');
    expect(tp1.highlightedUnit).toBe('minute');

    $input1.autotype('{{tab}}');
    expect(tp1.highlightedUnit).toBe('meridian');

    $input1.autotype('{{shift}}{{tab}}{{/shift}}');
    expect(tp1.highlightedUnit).toBe('minute');

    $input1.autotype('{{shift}}{{tab}}{{/shift}}');
    expect(tp1.highlightedUnit).toBe('hour');

    $input1.autotype('{{shift}}{{tab}}{{/shift}}');
    expect(tp1.isOpen).toBe(false);
  });
});
