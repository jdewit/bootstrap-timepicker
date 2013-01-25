describe("Joris feature", function() {

    it("should be present", function() {
        this.input = $('<input id="timepicker1" type="text">')
                        .appendTo('body')
                        .timepicker();

        expect($('body')).toContain('#timepicker1');
    });
});
