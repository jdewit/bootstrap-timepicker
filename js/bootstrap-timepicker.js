/* =========================================================
 * bootstrap-timepicker.js
 * http://www.github.com/jdewit/bootstrap-timepicker
 * =========================================================
 * Copyright 2012
 *
 * Created By:
 * Joris de Wit @joris_dewit
 * Gilbert @mindeavor
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

!function($) {

    "use strict"; // jshint ;_;

    /* TIMEPICKER PUBLIC CLASS DEFINITION
     * ================================== */
    var Timepicker = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.timepicker.defaults, options);
        this.minuteStep = this.options.minuteStep || this.minuteStep;
        this.disableFocus = this.options.disableFocus || this.disableFocus;
        this.$widget = $(this.options.template).appendTo('body');
        this.open = false;
        this.listen();
        this.setDefaultTime(this.options.defaultTime || this.defaultTime);
    };

    Timepicker.prototype = {

        constructor: Timepicker

        , listen: function () {
            $('html').on('click.timepicker.data-api', $.proxy(this.hide, this));

            this.$element
                .on('click', $.proxy(this.show, this))
                .on('keyup', $.proxy(this.updateFromElementVal, this))
            ;
            this.$widget.on('click', $.proxy(this.click, this));
        }

        , show: function(e) {
            e.stopPropagation();
            e.preventDefault();

            this.$element.trigger('show');

            if (true === this.disableFocus) {
                this.$element.blur();
            }

            var pos = $.extend({}, this.$element.offset(), {
                height: this.$element[0].offsetHeight
            });

            this.$widget.css({
                top: pos.top + pos.height
                , left: pos.left
            })

            if (!this.open) {
                this.$widget.addClass('open');
            }

            this.open = true;
            this.$element.trigger('shown');

            return this;
        }

        , hide: function(e){
            e.stopPropagation();

            this.$element.trigger('hide');

            this.$widget.removeClass('open');
            this.open = false;
            this.$element.trigger('hidden');

            return this;
        }

        , setValues: function(time) {
            var meridian, match = time.match(/(am|pm)/i);
            if (match) {
                meridian = match[1];
            }
            time = $.trim(time.replace(/(pm|am)/i, ''));
            var timeArray = time.split(':');

            this.meridian = meridian;
            this.hour = parseInt(timeArray[0]);
            this.minute = parseInt(timeArray[1]);
        }

        , setDefaultTime: function(defaultTime){
            if (defaultTime) {
                if (defaultTime === 'current') {
                    var dTime = new Date();
                    var hours = dTime.getHours();
                    var minutes = Math.floor(dTime.getMinutes() / this.minuteStep) * this.minuteStep;

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
                } else {
                    this.setValues(defaultTime);
                }
                this.update();
            }
        }

        , formatTime: function(hour, minute, meridian) {
            hour = hour < 10 ? '0' + hour : hour;
            minute = minute < 10 ? '0' + minute : minute;

            return hour + ':' + minute + ' ' + meridian;
        }

        , getTime: function() {
            return this.formatTime(this.hour, this.minute, this.meridian);
        }

        , setTime: function(time) {
            this.setValues(time);
            this.update();
        }

        , updateElement: function() {
            var time = this.getTime();

            this.$element.val(time);
        }

        , updateWidget: function() {
            this.$widget
                .find('td.bootstrap-timepicker-hour').text(this.hour).end()
                .find('td.bootstrap-timepicker-minute').text(this.minute < 10 ? '0' + this.minute : this.minute).end()
                .find('td.bootstrap-timepicker-meridian').text(this.meridian);
        }

        , update: function() {
            this.updateElement();
            this.updateWidget();
        }

        , updateFromElementVal: function () {
            var time = this.$element.val();
            if (time) {
                this.setValues(time);
                this.updateWidget();
            }
        }

        , click: function(e) {
            e.stopPropagation();
            e.preventDefault();

            if (true !== this.disableFocus) {
                this.$element.focus();
            }

            var action = $(e.target).closest('a').data('action');
            if (action) {
                this[action]();
                this.update();
            }

        }

        , incrementHour: function() {
            if (this.hour === 12) {
                this.hour = 1;
                this.toggleMeridian();
            } else {
                this.hour = this.hour + 1;
            }
        }

        , decrementHour: function() {
            if (this.hour === 1) {
                this.hour = 12;
                this.toggleMeridian();
            } else {
                this.hour = this.hour - 1;
            }
        }

        , incrementMinute: function() {
            var newVal = this.minute + this.minuteStep - (this.minute % this.minuteStep);
            if (newVal > 59) {
                this.incrementHour();
                this.minute = newVal - 60;
            } else {
                this.minute = newVal;
            }
        }

        , decrementMinute: function() {
            var newVal = this.minute - this.minuteStep;
            if (newVal < 0) {
                this.decrementHour();
                this.minute = newVal + 60;
            } else {
                this.minute = newVal;
            }
        }

        , toggleMeridian: function() {
            this.meridian = this.meridian === 'am' ? 'pm' : 'am';

            this.update();
        }
    };


    /* TIMEPICKER PLUGIN DEFINITION
     * =========================== */

    $.fn.timepicker = function (option) {
        return this.each(function () {
            var $this = $(this)
            , data = $this.data('timepicker')
            , options = typeof option == 'object' && option;
            if (!data) {
                $this.data('timepicker', (data = new Timepicker(this, options)));
            }
            if (typeof option == 'string') {
                data[option]();
            }
        })
    }

    $.fn.timepicker.defaults = {
      minuteStep: 15
    , disableFocus: false
    , defaultTime: 'current'
    , template: '<div class="bootstrap-timepicker dropdown-menu">'+
                    '<table>'+
                        '<tr>'+
                            '<td><a href="#" data-action="incrementHour"><i class="icon-chevron-up"></i></a></td>'+
                            '<td></td>'+
                            '<td><a href="#" data-action="incrementMinute"><i class="icon-chevron-up"></i></a></td>'+
                            '<td><a href="#" data-action="toggleMeridian"><i class="icon-chevron-up"></i></a></td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td class="bootstrap-timepicker-hour"></td> '+
                            '<td class="separator">:</td>'+
                            '<td class="bootstrap-timepicker-minute"></td> '+
                            '<td class="bootstrap-timepicker-meridian"></td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td><a href="#" data-action="decrementHour"><i class="icon-chevron-down"></i></a></td>'+
                            '<td></td>'+
                            '<td><a href="#" data-action="decrementMinute"><i class="icon-chevron-down"></i></a></td>'+
                            '<td><a href="#" data-action="toggleMeridian"><i class="icon-chevron-down"></i></a></td>'+
                        '</tr>'+
                    '</table>'+
            '</div>'
    }

    $.fn.timepicker.Constructor = Timepicker

    /* TIMEPICKER DATA-API
     * ================== */

    $(function () {
        $('body').on('focus.timepicker.data-api', '[data-provide="timepicker"]', function (e) {
            var $this = $(this);
            if ($this.data('timepicker')) {
                return;
            }
            e.preventDefault();
            $this.timepicker($this.data());
        })
    })
}(window.jQuery);
