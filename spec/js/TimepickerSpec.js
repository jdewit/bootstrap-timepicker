describe("Timepicker init feature", function() {
    var $input,
        tp,
        defaultTimepicker;

    beforeEach(function () {
        loadFixtures('timepicker.html');

        $input1 = $('#timepicker1');
        timepicker1 = $input1.timepicker();
        tp1 = timepicker1.data('timepicker');

        $input2 = $('#timepicker2');
        timepicker2 = $input2.timepicker({
            template: 'modal',
            minuteStep: 30
        });
        tp2 = timepicker2.data('timepicker');
    });

    afterEach(function () {
        $input1.data('timepicker').remove();
        $input1.remove();
        $input2.data('timepicker').remove();
        $input2.remove();
    });

    it("should be available on the jquery object", function() {
        expect($.fn.timepicker).toBeDefined();
    });

    it("should be chainable", function() {
        expect(timepicker1).toBe($input1);
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
            console.log('woopy');
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
