describe('Keyboard events feature', function() {
  'use strict';

  var $input1,
    $input2,
    $input3,
    $timepicker1,
    $timepicker2,
    $timepicker3,
    tp1,
    tp2,
    tp3;

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
  });

  afterEach(function () {
    $input1.data('timepicker').remove();
    $input2.data('timepicker').remove();
    $input3.data('timepicker').remove();
    $input1.remove();
    $input2.remove();
    $input3.remove();
  });

  it('should be able to be controlled by the arrow keys', function() {
    tp1.setTime('11:30 AM');
    tp1.update();

    $input1.focus();
    $input1.trigger({
      'type': 'keypress',
      'keyCode': 38 //up
    });
    expect(tp1.getTime()).toBe('12:30 PM');

    $input1.trigger({
      'type': 'keypress',
      'keyCode': 40 //down
    });
    expect(tp1.getTime()).toBe('11:30 AM');

    $input1.trigger({
      'type': 'keypress',
      'keyCode': 39 //right
    });

    $input1.trigger({
      'type': 'keypress',
      'keyCode': 38 //up
    });
    expect(tp1.getTime()).toBe('11:45 AM');

    $input1.trigger({
      'type': 'keypress',
      'keyCode': 40 //down
    });
    expect(tp1.getTime()).toBe('11:30 AM');

    $input1.trigger({
      'type': 'keypress',
      'keyCode': 39 //right
    });

    $input1.trigger({
      'type': 'keypress',
      'keyCode': 38 //up
    });
    expect(tp1.getTime()).toBe('11:30 PM');

    $input1.trigger({
      'type': 'keypress',
      'keyCode': 40 //down
    });
    expect(tp1.getTime()).toBe('11:30 AM');

    $input1.trigger({
      'type': 'keypress',
      'keyCode': 37 //left
    });

    $input1.trigger({
      'type': 'keypress',
      'keyCode': 40 //down
    });
    expect(tp1.getTime()).toBe('11:15 AM');

    $input1.trigger({
      'type': 'keypress',
      'keyCode': 37 //left
    });

    $input1.trigger({
      'type': 'keypress',
      'keyCode': 40 //down
    });
    expect(tp1.getTime()).toBe('10:15 AM');

    $input1.trigger({
      'type': 'keypress',
      'keyCode': 37 //left
    });

    $input1.trigger({
      'type': 'keypress',
      'keyCode': 40 //down
    });
    expect(tp1.getTime()).toBe('10:15 PM');
  });

  it('should allow time to be changed via widget inputs in a dropdown', function() {
    tp1.setTime('9:30 AM');
    tp1.update();
    $input1.parents('div').find('.add-on').click();

    var $hourInput = tp1.$widget.find('input.bootstrap-timepicker-hour'),
        $minuteInput = tp1.$widget.find('input.bootstrap-timepicker-minute');

    $hourInput.focus();
    $hourInput.val(2);
    $hourInput.trigger('change');
    expect(tp1.getTime()).toBe('02:30 AM');

    $minuteInput.focus();
    $minuteInput.val(0);
    $minuteInput.trigger('change');

    expect(tp1.getTime()).toBe('02:00 AM');
  });

  it('should allow time to be changed via widget inputs in a modal', function() {
    tp2.setTime('9:30 AM');
    tp2.update();
    $input2.parents('div').find('.add-on').click();

    var $hourInput = tp2.$widget.find('input.bootstrap-timepicker-hour'),
        $minuteInput = tp2.$widget.find('input.bootstrap-timepicker-minute'),
        $secondInput = tp2.$widget.find('input.bootstrap-timepicker-second');

    $hourInput.focus();
    $hourInput.val(2);
    $hourInput.trigger('change');
    expect(tp2.getTime()).toBe('02:30:00 AM');

    $minuteInput.focus();
    $minuteInput.val(0);
    $minuteInput.trigger('change');

    expect(tp2.getTime()).toBe('02:00:00 AM');

    $secondInput.focus();
    $secondInput.val(30);
    $secondInput.trigger('change');

    expect(tp2.getTime()).toBe('02:00:30 AM');
  });
});
