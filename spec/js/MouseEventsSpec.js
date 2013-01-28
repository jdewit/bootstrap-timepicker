describe('Mouse events feature', function() {
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
            showSeconds: true
        });
        tp3 = $timepicker3.data('timepicker');
    });

    afterEach(function () {
        $input1.data('timepicker').remove();
        $input1.remove();
        $input2.data('timepicker').remove();
        $input2.remove();
        $input3.data('timepicker').remove();
        $input3.remove();
    });

    it('widget should be shown and trigger show events on input click', function() {
        var showEvent = false,
            shownEvent = false;

        $input1.on('show', function() {
            showEvent = true;
        });
        $input1.on('shown', function() {
            shownEvent = true;
        });

        $input1.trigger('click');

        expect(tp1.isOpen).toBe(true);
        expect(showEvent).toBe(true);
        expect(shownEvent).toBe(true);
    });

    it('widget should be hidden and trigger hide events on click outside of widget', function() {
        var hideEvent = false,
            hiddenEvent = false;

        $input1.on('hide', function() {
            hideEvent = true;
        });
        $input1.on('hidden', function() {
            hiddenEvent = true;
        });

        $('body').trigger('mousedown');
        expect(tp1.isOpen).toBe(false);
        expect(hideEvent).toBe(true);
        expect(hiddenEvent).toBe(true);
    });

});
