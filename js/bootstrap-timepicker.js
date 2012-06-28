/* =========================================================
 * bootstrap-timepicker.js
 * http://www.github.com/jdewit/bootstrap-timepicker
 * =========================================================
 * Copyright 2012
 *
 * Created By:
 * Joris de Wit @joris_dewit
 *
 * Contributions By:
 * Gilbert @mindeavor
 * Koen Punt info@koenpunt.nl
 * Nek
 * Chris Martin
 * Dominic Barnes contact@dominicbarnes.us
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
        this.options = $.extend({}, $.fn.timepicker.defaults, options, this.$element.data());
        this.minuteStep = this.options.minuteStep || this.minuteStep;
        this.showMeridian = this.options.showMeridian || this.showMeridian;
        this.disableFocus = this.options.disableFocus || this.disableFocus;
        this.template = this.options.template || this.template;
        this.defaultTime = this.options.defaultTime || this.defaultTime;
        this.open = false;
        this.init();
    };

    Timepicker.prototype = {

        constructor: Timepicker

        , init: function () {

            this.$element
                .on('click', $.proxy(this.show, this))
                .on('keyup', $.proxy(this.updateFromElementVal, this))
            ;
            
            this.$widget = $(this.getTemplate()).appendTo('body');
            
            this.$widget.on('click', $.proxy(this.click, this));

            this.setDefaultTime(this.defaultTime);
        }

        , show: function(e) {
            e.stopPropagation();
            e.preventDefault();

            this.$element.trigger('show');

            $('html').on('click.timepicker.data-api', $.proxy(this.hide, this));

            if (true === this.disableFocus) {
                this.$element.blur();
            }

            var pos = $.extend({}, this.$element.offset(), {
                height: this.$element[0].offsetHeight
            });

            if (this.options.template === 'modal') {
                this.$widget.modal('show');
            } else {
                this.$widget.css({
                    top: pos.top + pos.height
                    , left: pos.left
                })

                if (!this.open) {
                    this.$widget.addClass('open');
                }
            }

            this.open = true;
            this.$element.trigger('shown');

            return this;
        }

        , hide: function(){
            this.$element.trigger('hide');
            
            $('html').off('click.timepicker.data-api', $.proxy(this.hide, this));

            if (this.options.template === 'modal') {
                this.$widget.modal('hide');
            } else {
                this.$widget.removeClass('open');
            }
            this.open = false;
            this.$element.trigger('hidden');

            return this;
        }

        , setValues: function(time) {
            var meridian, match = time.match(/(AM|PM)/i);
            if (match) {
                meridian = match[1];
            }
            time = $.trim(time.replace(/(PM|AM)/i, ''));
            var timeArray = time.split(':');

            this.meridian = meridian;
            this.hour = parseInt(timeArray[0], 10);
            if (isNaN(this.hour)) {
                this.hour = 0;
                this.updateElement();
            }
            this.minute = parseInt(timeArray[1], 10);
            if (isNaN(this.minute)) {
                this.minute = 0;
                this.updateElement();
            }
        }

        , setDefaultTime: function(defaultTime){
            if (defaultTime) {
                if (defaultTime === 'current') {
                    var dTime = new Date();
                    var hours = dTime.getHours();
                    var minutes = Math.floor(dTime.getMinutes() / this.minuteStep) * this.minuteStep;
                    var meridian = "AM";
                    if ( this.showMeridian ) {
                        if (hours === 0) {
                            hours = 12;
                        } else if (hours >= 12) {
                            if (hours > 12) {
                                hours = hours - 12;
                            }
                            meridian = "PM";
                        } else {
                           meridian = "AM";
                        }
                    }
                    this.hour = hours;
                    this.minute = minutes;
                    this.meridian = meridian;
                } else if (defaultTime === 'value') {
                    this.setValues( this.$element.val() );
                } else {
                    this.setValues(defaultTime);
                }
                this.update();
            } else {
                this.hour = 0;
                this.minute = 0;
            }
        }

        , formatTime: function(hour, minute, meridian) {
            hour = hour < 10 ? '0' + hour : hour;
            minute = minute < 10 ? '0' + minute : minute;

            return hour + ':' + minute + ( this.showMeridian ? ' ' + meridian : '' );
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

            this.$element.val(time).change();
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
            if ( this.showMeridian ) {
                if ( this.hour === 12 ) {
                    this.hour = 1;
                    return this.toggleMeridian();
                }
            }
            if ( this.hour === 23 ) {
                return this.hour = 0;
            }
            this.hour = this.hour + 1;
        }

        , decrementHour: function() {
            if ( this.showMeridian ) {
                if (this.hour === 1) {
                    this.hour = 12;
                    return this.toggleMeridian();
                } 
            }
            if (this.hour === 0) {
                return this.hour = 23;
            }
            this.hour = this.hour - 1;
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
            this.meridian = this.meridian === 'AM' ? 'PM' : 'AM';

            this.update();
        }
        
        , getTemplate: function() {
            if (this.options.templates[this.options.template]) {
                return this.options.templates[this.options.template];
            }
            var template;
            switch(this.options.template) {
                case 'modal':
                    template = '<div class="bootstrap-timepicker modal hide fade in" style="top: 30%; margin-top: 0; width: 200px; margin-left: -100px;" data-backdrop="false">'+
                                   '<div class="modal-header">'+
                                       '<a href="#" class="close" data-action="hide">×</a>'+
                                       '<h3>Pick a Time</h3>'+
                                   '</div>'+
                                   '<div class="modal-content">'+
                                       '<table>'+
                                           '<tr>'+
                                               '<td><a href="#" data-action="incrementHour"><i class="icon-chevron-up"></i></a></td>'+
                                               '<td class="separator"></td>'+
                                               '<td><a href="#" data-action="incrementMinute"><i class="icon-chevron-up"></i></a></td>'+
                                               ( this.showMeridian ? '<td><a href="#" data-action="toggleMeridian"><i class="icon-chevron-up"></i></a></td>' : '' ) +
                                           '</tr>'+
                                           '<tr>'+
                                               '<td class="bootstrap-timepicker-hour"></td> '+
                                               '<td class="separator">:</td>'+
                                               '<td class="bootstrap-timepicker-minute"></td> '+
                                               ( this.showMeridian ? '<td class="bootstrap-timepicker-meridian"></td>' : '' ) +
                                           '</tr>'+
                                           '<tr>'+
                                               '<td><a href="#" data-action="decrementHour"><i class="icon-chevron-down"></i></a></td>'+
                                               '<td class="separator"></td>'+
                                               '<td><a href="#" data-action="decrementMinute"><i class="icon-chevron-down"></i></a></td>'+
                                               ( this.showMeridian ? '<td><a href="#" data-action="toggleMeridian"><i class="icon-chevron-down"></i></a></td>' : '' ) +
                                           '</tr>'+
                                       '</table>'+
                                   '</div>'+
                                   '<div class="modal-footer">'+
                                       '<a href="#" class="btn btn-primary" data-action="hide">Ok</a>'+
                                   '</div>'+
                               '</div>';
                    
                break;
                case 'dropdown':
                    template = '<div class="bootstrap-timepicker dropdown-menu">'+
                                   '<table>'+
                                       '<tr>'+
                                           '<td><a href="#" data-action="incrementHour"><i class="icon-chevron-up"></i></a></td>'+
                                           '<td class="separator"></td>'+
                                           '<td><a href="#" data-action="incrementMinute"><i class="icon-chevron-up"></i></a></td>'+
                                           ( this.showMeridian ? '<td><a href="#" data-action="toggleMeridian"><i class="icon-chevron-up"></i></a></td>' : '' ) +
                                       '</tr>'+
                                       '<tr>'+
                                           '<td class="bootstrap-timepicker-hour"></td> '+
                                           '<td class="separator">:</td>'+
                                           '<td class="bootstrap-timepicker-minute"></td> '+
                                           ( this.showMeridian ? '<td class="bootstrap-timepicker-meridian"></td>' : '' ) +
                                       '</tr>'+
                                       '<tr>'+
                                           '<td><a href="#" data-action="decrementHour"><i class="icon-chevron-down"></i></a></td>'+
                                           '<td class="separator"></td>'+
                                           '<td><a href="#" data-action="decrementMinute"><i class="icon-chevron-down"></i></a></td>'+
                                           ( this.showMeridian ? '<td><a href="#" data-action="toggleMeridian"><i class="icon-chevron-down"></i></a></td>' : '' ) +
                                       '</tr>'+
                                   '</table>'+
                               '</div>';
                break;
                
            }
            return template;
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
    , showMeridian: true
    , template: 'dropdown'
    , templates: {} // set custom templates
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
