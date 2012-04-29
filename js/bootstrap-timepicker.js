/* =========================================================
 * bootstrap-timepicker.js
 * http://www.github.com/jdewit/bootstrap-timepicker
 * =========================================================
 * Copyright 2012 Joris de Wit, Stefan Petre, and Andrew Rowls
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

!function( $ ) {

	// Picker object
	var Timepicker = function(element, options){
		this.element = $(element);
        this.step = options.step||this.element.data('time-step')||1;
		this.picker = $('<div class="bootstrap-timepicker dropdown-menu">'+
							'<div class="timepicker-container">'+
                                '<table>'+
                                    '<tr>'+
                                        '<td><a href="#" data-action="incrementHour"><i class="icon-chevron-up"></i></a></td>'+
                                        '<td></td>'+
                                        '<td><a href="#" data-action="incrementMinute"><i class="icon-chevron-up"></i></a></td>'+
                                        '<td><a href="#" data-action="toggleMeridian"><i class="icon-chevron-up"></i></a></td>'+
                                    '</tr>'+
                                    '<tr>'+
                                        '<td id="timepickerHour"></td> '+
                                        '<td class="separator">:</td>'+
                                        '<td id="timepickerMinute"></td> '+
                                        '<td id="timepickerMeridian"></td>'+
                                    '</tr>'+
                                    '<tr>'+
                                        '<td><a href="#" data-action="decrementHour"><i class="icon-chevron-down"></i></a></td>'+
                                        '<td></td>'+
                                        '<td><a href="#" data-action="decrementMinute"><i class="icon-chevron-down"></i></a></td>'+
                                        '<td><a href="#" data-action="toggleMeridian"><i class="icon-chevron-down"></i></a></td>'+
                                    '</tr>'+
                                '</table>' +
							'</div>'+
						'</div>')
            .appendTo('body')
            .on({
                click: $.proxy(this.click, this),
                mousedown: $.proxy(this.mousedown, this)
            });
		this.isInput = this.element.is('input');
		this.component = this.element.is('.time') ? this.element.find('.add-on') : false;

		if (this.component && this.component.length === 0) {
			this.component = false;
        }

		if (this.isInput) {
			this.element.on({
				focus: $.proxy(this.show, this),
				blur: $.proxy(this._hide, this),
				keyup: $.proxy(this.update, this),
				keydown: $.proxy(this.keydown, this)
			});
		} else {
			if (this.component){
				this.component.on('click', $.proxy(this.show, this));
				var element = this.element.find('input');
				element.on({
					blur: $.proxy(this._hide, this)
				})
			} else {
				this.element.on('click', $.proxy(this.show, this));
			}
		}

		this.setDefaultTime(options.defaultTime||this.element.data('time-default-time'));

		this.update();
	};

	Timepicker.prototype = {
		constructor: Timepicker,

		show: function(e) {
			this.picker.show();
			this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
			this.place();
			$(window).on('resize', $.proxy(this.place, this));
			if (e ) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (!this.isInput) {
				$(document).on('mousedown', $.proxy(this.hide, this));
			}
			this.element.trigger({
				type: 'show',
				time: this.time
			});
		},

		_hide: function(e){
			// When going from the input to the picker, IE handles the blur/click
			// events differently than other browsers, in such a way that the blur
			// event triggers a hide before the click event can stop propagation.
			if ($.browser.msie) {
				var t = this, args = arguments;

				function cancel_hide(){
					clearTimeout(hide_timeout);
					e.target.focus();
					t.picker.off('click', cancel_hide);
				}

				function do_hide(){
					t.hide.apply(t, args);
					t.picker.off('click', cancel_hide);
				}

				this.picker.on('click', cancel_hide);
				var hide_timeout = setTimeout(do_hide, 100);
			} else {
				return this.hide.apply(this, arguments);
			}
		},

		hide: function(e){
			this.picker.hide();
			$(window).off('resize', this.place);
			if (!this.isInput) {
				$(document).off('mousedown', this.hide);
			}
			if (e && e.currentTarget.value) {
				this.setValue();
            }
			this.element.trigger({
				type: 'hide',
				time: this.getTime()
			});
		},

		setValue: function(input) {
			if (!this.isInput) {
				if (this.component){
					this.element.find('input').prop('value', input);
				}
				this.element.data('time', input);
			} else {
				this.element.prop('value', input);
			}
            $('.timepicker td#timepickerHour').text(this.hour);
            $('.timepicker td#timepickerMinute').text(this.minute < 10 ? '0' + this.minute : this.minute);
            $('.timepicker td#timepickerMeridian').text(this.meridian);
		},
        
        setValues: function(time) {
            var meridian = time.replace('/am/i', '');
            if (!meridian) {
                meridian = time.replace('/pm/i', '');
            }
            var timeArray = time.split(':');

            this.meridian = meridian;
            this.hour = timeArray[0];
            this.minute = timeArray[1];
        },

		setDefaultTime: function(defaultTime){
            if (!defaultTime || defaultTime == 'current') {
                var dTime = new Date();
                var hours = dTime.getHours();
                var minutes = Math.floor(dTime.getMinutes() / this.step) * this.step;

                var meridian = "am";
                if (hours > 12) {
                    hours = hours - 12;
                    meridian = "pm";
                } else {
                   meridian = "am";
                }

                this.hour = hours;
                this.minute = minutes;
                this.meridian = meridian;

			    this.update();
            } else {
                this.setValues(defaultTime);
            }
		},

		place: function(){
			var offset = this.component ? this.component.offset() : this.element.offset();
			this.picker.css({
				top: offset.top + this.height,
				left: offset.left
			});
		},
        
        formatTime: function(hour, minute, meridian) {
            hour = hour < 10 ? '0' + hour : hour;
            minute = minute < 10 ? '0' + minute : minute;

            return hour + ':' + minute + ' ' + meridian;
        },

        getTime: function() {
            return this.formatTime(this.hour, this.minute, this.meridian);
        },

		update: function(){
			var time = this.getTime();
            this.setValue(time);

            this.element.trigger({
                type: 'changeTime',
                time: time
            });
		},

		click: function(e) {
			e.stopPropagation();
			e.preventDefault();
            var action = $(e.target).closest('a').data('action');
			if (action) {
                switch(action) {
                    case 'incrementHour':
                        this.incrementHour();
                    break;
                    case 'decrementHour':
                        this.decrementHour();
                    break;
                    case 'incrementMinute':
                        this.incrementMinute();
                    break;
                    case 'decrementMinute':
                        this.decrementMinute();
                    break;
                    case 'toggleMeridian':
                        this.toggleMeridian();
                    break;
                }
            }

		},

		mousedown: function(e){
			e.stopPropagation();
			e.preventDefault();
		},

		incrementHour: function(){
            if (this.hour === 12) {
                this.hour = 1;
                this.toggleMeridian();
            } else {
                this.hour = this.hour + 1;
            }
            this.update();
		},

		decrementHour: function(){
            if (this.hour === 1) {
                this.hour = 12;
                this.toggleMeridian();
            } else {
                this.hour = this.hour - 1;
            }

            this.update();
		},

		incrementMinute: function(){
            var newVal = this.minute + this.step;
            if (newVal > 59) {
                this.incrementHour();
                this.minute = newVal - 60;
            } else {
                this.minute = newVal;
            }

            this.update();
		},

		decrementMinute: function() {
            var newVal = this.minute - this.step;
            if (newVal < 0) {
                this.decrementHour();
                this.minute = newVal + 60;
            } else {
                this.minute = newVal;
            }

            this.update();
		},

        toggleMeridian: function() {
            if (this.meridian == 'am') {
                this.meridian = 'pm';
            } else {
                this.meridian = 'am';
            }

            this.update();
        },

		keydown: function(e){
			if (this.picker.is(':not(:visible)')){
				if (e.keyCode == 27) // allow escape to hide and re-show picker
					this.show();
				return;
			}
			var timeChanged = false,
				dir, day, hour;
			switch(e.keyCode){
				case 27: // escape
					this.hide();
					e.preventDefault();
					break;
				case 37: // left
				case 39: // right
				case 38: // up
				case 40: // down
				case 13: // enter
					this.hide();
					e.preventDefault();
					break;
			}
			if (timeChanged){
				this.element.trigger({
					type: 'changeTime',
					time: this.time
				});
				var element;
				if (this.isInput) {
					element = this.element;
				} else if (this.component){
					element = this.element.find('input');
				}
				if (element) {
					element.change();
				}
			}
		},
	};

	$.fn.timepicker = function ( option ) {
		var args = Array.apply(null, arguments);
		args.shift();
		return this.each(function () {
			var $this = $(this),
				data = $this.data('timepicker'),
				options = typeof option == 'object' && option;
			if (!data) {
				$this.data('timepicker', (data = new Timepicker(this, $.extend({}, $.fn.timepicker.defaults,options))));
			}
			if (typeof option == 'string') data[option].apply(data, args);
		});
	};

	$.fn.timepicker.Constructor = Timepicker;
}( window.jQuery )

