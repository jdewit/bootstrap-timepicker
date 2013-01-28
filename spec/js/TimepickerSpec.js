describe('Timepicker feature', function() {
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
        $input1.data('timepicker') !== undefined ? $input1.data('timepicker').remove() : '';
        $input2.data('timepicker') !== undefined ? $input2.data('timepicker').remove() : '';
        $input3.data('timepicker') !== undefined ? $input3.data('timepicker').remove() : '';
        $input1.remove();
        $input2.remove();
        $input3.remove();
    });

    it('should be available on the jquery object', function() {
        expect($.fn.timepicker).toBeDefined();
    });

    it('should be chainable', function() {
        expect($timepicker1).toBe($input1);
    });

    it('should have sensible defaults', function() {
        expect(tp1.defaultTime).toBeTruthy();
        expect(tp1.minuteStep).toBe(15);
        expect(tp1.secondStep).toBe(15);
        expect(tp1.disableFocus).toBe(false);
        expect(tp1.showSeconds).toBe(false);
        expect(tp1.showInputs).toBe(true);
        expect(tp1.showMeridian).toBe(true);
        expect(tp1.template).toBe('dropdown');
        expect(tp1.modalBackdrop).toBe(false);
        expect(tp1.modalBackdrop).toBe(false);
        expect(tp1.isOpen).toBe(false);
    });

    it('should allow user to configure defaults', function() {
        expect(tp2.template).toBe('modal');
        expect(tp2.minuteStep).toBe(30);
    });

    it('should have current time by default', function() {
        expect($input1.val()).not.toBe('');
    });

    it('should have no value if defaultTime is set to false', function() {
        expect($input2.val()).toBe('');
    });

    it('should be able to set a specific time by default', function() {
        expect($input3.val()).toBe('23:15:20');
    });

    it('should update the element and widget with the setValues method', function() {
        tp2.setValues('09:15:20 AM');

        expect(tp2.hour).toBe(9);
        expect(tp2.minute).toBe(15);
        expect(tp2.second).toBe(20);
        expect(tp2.meridian).toBe('AM');
        expect($input2.val()).toBe('09:15:20 AM');
        expect(tp2.$widget.find('.bootstrap-timepicker-hour').val()).toBe('09');
        expect(tp2.$widget.find('.bootstrap-timepicker-minute').val()).toBe('15');
        expect(tp2.$widget.find('.bootstrap-timepicker-second').val()).toBe('20');
        expect(tp2.$widget.find('.bootstrap-timepicker-meridian').val()).toBe('AM');
    });

    it('should be able to format time values into a string', function() {
        expect(tp2.formatTime(3, 15, 45, 'PM')).toBe('03:15:45 PM');
    });

    it('should be able get the pickers time', function() {
        expect(tp3.getTime()).toBe('23:15:20');
    });

    it('should be able set the pickers time', function() {
        expect(tp3.getTime()).toBe('23:15:20');
    });

    it('should update picker on blur', function() {
        $input1.val('10:25 AM');
        expect(tp1.getTime()).not.toBe('10:25 AM');
        $input1.trigger('blur');
        expect(tp1.getTime()).toBe('10:25 AM');
    });

    it('should update element with updateElement method', function() {
        tp1.hour = 10;
        tp1.minute = 30;
        tp1.meridian = 'PM';
        expect($input1.val()).not.toBe('10:30 PM');
        tp1.updateElement();
        expect($input1.val()).toBe('10:30 PM');
    });

    it('should update widget with updateWidget method', function() {
        tp3.hour = 10;
        tp3.minute = 30;
        tp3.second = 15;

        expect(tp3.$widget.find('.bootstrap-timepicker-hour').val()).not.toBe('10');
        expect(tp3.$widget.find('.bootstrap-timepicker-minute').val()).not.toBe('30');
        expect(tp3.$widget.find('.bootstrap-timepicker-second').val()).not.toBe('15');

        tp3.updateWidget();

        expect(tp3.$widget.find('.bootstrap-timepicker-hour').val()).toBe('10');
        expect(tp3.$widget.find('.bootstrap-timepicker-minute').val()).toBe('30');
        expect(tp3.$widget.find('.bootstrap-timepicker-second').val()).toBe('15');
    });

    it('should update picker with updateFromElementVal method', function() {
        tp1.hour = 12;
        tp1.minute = 12;
        tp1.meridian = 'PM';
        tp1.update();

        $input1.val('10:30 AM');

        expect(tp1.$widget.find('.bootstrap-timepicker-hour').val()).not.toBe('10');
        expect(tp1.$widget.find('.bootstrap-timepicker-minute').val()).not.toBe('30');
        expect(tp1.$widget.find('.bootstrap-timepicker-meridian').val()).not.toBe('AM');
        expect(tp1.hour).not.toBe(10);
        expect(tp1.minute).not.toBe(30);
        expect(tp1.meridian).not.toBe('AM');

        tp1.updateFromElementVal();

        expect(tp1.$widget.find('.bootstrap-timepicker-hour').val()).toBe('10');
        expect(tp1.$widget.find('.bootstrap-timepicker-minute').val()).toBe('30');
        expect(tp1.$widget.find('.bootstrap-timepicker-meridian').val()).toBe('AM');
        expect(tp1.hour).toBe(10);
        expect(tp1.minute).toBe(30);
        expect(tp1.meridian).toBe('AM');
    });

    it('should update picker with updateFromWidgetInputs method', function() {
        tp1.hour = 12;
        tp1.minute = 12;
        tp1.meridian = 'PM';
        tp1.update();

        tp1.$widget.find('.bootstrap-timepicker-hour').val(10);
        tp1.$widget.find('.bootstrap-timepicker-minute').val(30);
        tp1.$widget.find('.bootstrap-timepicker-meridian').val('AM');

        expect(tp1.hour).not.toBe(10);
        expect(tp1.minute).not.toBe(30);
        expect(tp1.meridian).not.toBe('AM');
        expect($input1.val()).not.toBe('10:30 AM');

        tp1.updateFromWidgetInputs();

        expect(tp1.hour).toBe(10);
        expect(tp1.minute).toBe(30);
        expect(tp1.meridian).toBe('AM');
        expect($input1.val()).toBe('10:30 AM');
    });

    it('should increment hours with incrementHour method', function() {
        tp1.hour = 9;
        tp1.incrementHour();
        expect(tp1.hour).toBe(10);
    });

    it('should decrement hours with decrementHour method', function() {
        tp1.hour = 9;
        tp1.decrementHour();
        expect(tp1.hour).toBe(8);
    });

    it('should toggle meridian if hour goes past 12', function() {
        $input1.val('11:00 AM');
        tp1.updateFromElementVal();
        tp1.incrementHour();

        expect(tp1.hour).toBe(12);
        expect(tp1.minute).toBe(0);
        expect(tp1.meridian).toBe('PM');
    });

    it('should toggle meridian if hour goes below 1', function() {
        $input1.val('11:00 AM');
        tp1.updateFromElementVal();
        tp1.incrementHour();

        expect(tp1.hour).toBe(12);
        expect(tp1.minute).toBe(0);
        expect(tp1.meridian).toBe('PM');
    });

    it('should set hour to 1 if hour increments on 12 for 12h clock', function() {
        $input1.val('11:15 PM');
        tp1.updateFromElementVal();
        tp1.incrementHour();
        tp1.incrementHour();

        expect(tp1.getTime()).toBe('01:15 AM');
    });

    it('should set hour to 0 if hour increments on 23 for 24h clock', function() {
        $input3.val('22:15:30');
        tp3.updateFromElementVal();
        tp3.incrementHour();
        tp3.incrementHour();

        expect(tp3.hour).toBe(0);
        expect(tp3.minute).toBe(15);
        expect(tp3.second).toBe(30);
    });

    it('should increment minutes with incrementMinute method', function() {
        tp1.minute = 10;
        tp1.incrementMinute();

        expect(tp1.minute).toBe(15);

        tp2.minute = 0;
        tp2.incrementMinute();

        expect(tp2.minute).toBe(30);
    });

    it('should decrement minutes with decrementMinute method', function() {
        tp1.hour = 11;
        tp1.minute = 0;
        tp1.decrementMinute();

        expect(tp1.hour).toBe(10);
        expect(tp1.minute).toBe(45);

        tp2.hour = 11;
        tp2.minute = 0;
        tp2.decrementMinute();

        expect(tp2.hour).toBe(10);
        expect(tp2.minute).toBe(30);
    });


    it('should increment hour if minutes increment past 59', function() {
        $input1.val('11:55 AM');
        tp1.updateFromElementVal();
        tp1.incrementMinute();
        tp1.update();

        expect(tp1.getTime()).toBe('12:00 PM');
    });

    it('should toggle meridian with toggleMeridian method', function() {
        tp1.meridian = 'PM';
        tp1.toggleMeridian();

        expect(tp1.meridian).toBe('AM');
    });

    it('should increment seconds with incrementSecond method', function() {
        tp1.second = 0;
        tp1.incrementSecond();

        expect(tp1.second).toBe(15);

        tp2.second = 0;
        tp2.incrementSecond();

        expect(tp2.second).toBe(30);
    });

    it('should decrement seconds with decrementSecond method', function() {
        tp2.hour = 11;
        tp2.minute = 0;
        tp2.second = 0;
        tp2.decrementSecond();

        expect(tp2.minute).toBe(59);
        expect(tp2.second).toBe(30);
    });


    it('should increment minute by 1 if seconds increment past 59', function() {
        $input2.val('11:55:30 AM');
        tp2.updateFromElementVal();
        tp2.incrementSecond();
        tp2.update();

        expect(tp2.getTime()).toBe('11:56:00 AM');
    });

    it('should not have any remaining events if detachEvents is called', function() {
        var showEvent = false;

        $input1.on('show', function() {
            showEvent = true;
        });

        tp1.detachEvents();

        $input1.trigger('click');

        expect(showEvent).toBe(false);
    });

    it('should not have the widget in the DOM if remove method is called', function() {
        expect($('body')).toContain('.bootstrap-timepicker');
        tp1.remove();
        tp2.remove();
        tp3.remove();
        expect($('body')).not.toContain('.bootstrap-timepicker');
    });

});
