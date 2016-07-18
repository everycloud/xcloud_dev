/*! jQuery UI - v1.10.3 - 2013-07-24
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.datepicker.js
* Copyright 2013 jQuery Foundation and other contributors Licensed MIT */

(function( $, undefined ) {

var uuid = 0,
    runiqueId = /^ui-id-\d+$/;

// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
    version: "1.10.3",

    keyCode: {
        BACKSPACE: 8,
        COMMA: 188,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        NUMPAD_ADD: 107,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        NUMPAD_ENTER: 108,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_SUBTRACT: 109,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38
    }
});

// plugins
$.fn.extend({
    focus: (function( orig ) {
        return function( delay, fn ) {
            return typeof delay === "number" ?
                this.each(function() {
                    var elem = this;
                    setTimeout(function() {
                        $( elem ).focus();
                        if ( fn ) {
                            fn.call( elem );
                        }
                    }, delay );
                }) :
                orig.apply( this, arguments );
        };
    })( $.fn.focus ),

    scrollParent: function() {
        var scrollParent;
        if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
            scrollParent = this.parents().filter(function() {
                return (/(relative|absolute|fixed)/).test($.css(this,"position")) && (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
            }).eq(0);
        } else {
            scrollParent = this.parents().filter(function() {
                return (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
            }).eq(0);
        }

        return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
    },

    zIndex: function( zIndex ) {
        if ( zIndex !== undefined ) {
            return this.css( "zIndex", zIndex );
        }

        if ( this.length ) {
            var elem = $( this[ 0 ] ), position, value;
            while ( elem.length && elem[ 0 ] !== document ) {
                // Ignore z-index if position is set to a value where z-index is ignored by the browser
                // This makes behavior of this function consistent across browsers
                // WebKit always returns auto if the element is positioned
                position = elem.css( "position" );
                if ( position === "absolute" || position === "relative" || position === "fixed" ) {
                    // IE returns 0 when zIndex is not specified
                    // other browsers return a string
                    // we ignore the case of nested elements with an explicit value of 0
                    // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
                    value = parseInt( elem.css( "zIndex" ), 10 );
                    if ( !isNaN( value ) && value !== 0 ) {
                        return value;
                    }
                }
                elem = elem.parent();
            }
        }

        return 0;
    },

    uniqueId: function() {
        return this.each(function() {
            if ( !this.id ) {
                this.id = "ui-id-" + (++uuid);
            }
        });
    },

    removeUniqueId: function() {
        return this.each(function() {
            if ( runiqueId.test( this.id ) ) {
                $( this ).removeAttr( "id" );
            }
        });
    }
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
    var map, mapName, img,
        nodeName = element.nodeName.toLowerCase();
    if ( "area" === nodeName ) {
        map = element.parentNode;
        mapName = map.name;
        if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
            return false;
        }
        img = $( "img[usemap=#" + mapName + "]" )[0];
        return !!img && visible( img );
    }
    return ( /input|select|textarea|button|object/.test( nodeName ) ?
        !element.disabled :
        "a" === nodeName ?
            element.href || isTabIndexNotNaN :
            isTabIndexNotNaN) &&
        // the element and all of its ancestors must be visible
        visible( element );
}

function visible( element ) {
    return $.expr.filters.visible( element ) &&
        !$( element ).parents().addBack().filter(function() {
            return $.css( this, "visibility" ) === "hidden";
        }).length;
}

$.extend( $.expr[ ":" ], {
    data: $.expr.createPseudo ?
        $.expr.createPseudo(function( dataName ) {
            return function( elem ) {
                return !!$.data( elem, dataName );
            };
        }) :
        // support: jQuery <1.8
        function( elem, i, match ) {
            return !!$.data( elem, match[ 3 ] );
        },

    focusable: function( element ) {
        return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
    },

    tabbable: function( element ) {
        var tabIndex = $.attr( element, "tabindex" ),
            isTabIndexNaN = isNaN( tabIndex );
        return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
    }
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
    $.each( [ "Width", "Height" ], function( i, name ) {
        var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
            type = name.toLowerCase(),
            orig = {
                innerWidth: $.fn.innerWidth,
                innerHeight: $.fn.innerHeight,
                outerWidth: $.fn.outerWidth,
                outerHeight: $.fn.outerHeight
            };

        function reduce( elem, size, border, margin ) {
            $.each( side, function() {
                size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
                if ( border ) {
                    size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
                }
                if ( margin ) {
                    size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
                }
            });
            return size;
        }

        $.fn[ "inner" + name ] = function( size ) {
            if ( size === undefined ) {
                return orig[ "inner" + name ].call( this );
            }

            return this.each(function() {
                $( this ).css( type, reduce( this, size ) + "px" );
            });
        };

        $.fn[ "outer" + name] = function( size, margin ) {
            if ( typeof size !== "number" ) {
                return orig[ "outer" + name ].call( this, size );
            }

            return this.each(function() {
                $( this).css( type, reduce( this, size, true, margin ) + "px" );
            });
        };
    });
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
    $.fn.addBack = function( selector ) {
        return this.add( selector == null ?
            this.prevObject : this.prevObject.filter( selector )
        );
    };
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
    $.fn.removeData = (function( removeData ) {
        return function( key ) {
            if ( arguments.length ) {
                return removeData.call( this, $.camelCase( key ) );
            } else {
                return removeData.call( this );
            }
        };
    })( $.fn.removeData );
}





// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.support.selectstart = "onselectstart" in document.createElement( "div" );
$.fn.extend({
    disableSelection: function() {
        return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
            ".ui-disableSelection", function( event ) {
                event.preventDefault();
            });
    },

    enableSelection: function() {
        return this.unbind( ".ui-disableSelection" );
    }
});

$.extend( $.ui, {
    // $.ui.plugin is deprecated. Use $.widget() extensions instead.
    plugin: {
        add: function( module, option, set ) {
            var i,
                proto = $.ui[ module ].prototype;
            for ( i in set ) {
                proto.plugins[ i ] = proto.plugins[ i ] || [];
                proto.plugins[ i ].push( [ option, set[ i ] ] );
            }
        },
        call: function( instance, name, args ) {
            var i,
                set = instance.plugins[ name ];
            if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
                return;
            }

            for ( i = 0; i < set.length; i++ ) {
                if ( instance.options[ set[ i ][ 0 ] ] ) {
                    set[ i ][ 1 ].apply( instance.element, args );
                }
            }
        }
    },

    // only used by resizable
    hasScroll: function( el, a ) {

        //If overflow is hidden, the element might have extra content, but the user wants to hide it
        if ( $( el ).css( "overflow" ) === "hidden") {
            return false;
        }

        var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
            has = false;

        if ( el[ scroll ] > 0 ) {
            return true;
        }

        // TODO: determine which cases actually cause this to happen
        // if the element doesn't have the scroll set, see if it's possible to
        // set the scroll
        el[ scroll ] = 1;
        has = ( el[ scroll ] > 0 );
        el[ scroll ] = 0;
        return has;
    }
});

})( jQuery );
(function( $, undefined ) {

$.extend($.ui, { datepicker: { version: "1.10.3" } });

var PROP_NAME = 'datepicker';
var dpuuid = new Date().getTime();
var instActive;

/* Date picker manager.
   Use the singleton instance of this class, $.datepicker, to interact with the date picker.
   Settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */

function Datepicker() {
    this._curInst = null; // The current instance in use
    this._keyEvent = false; // If the last event was a key event
    this._disabledInputs = []; // List of date picker inputs that have been disabled
    this._datepickerShowing = false; // True if the popup picker is showing , false if not
    this._inDialog = false; // True if showing within a "dialog", false if not
    this._mainDivId = "ui-datepicker-div"; // The ID of the main datepicker division
    this._inlineClass = "ui-datepicker-inline"; // The name of the inline marker class
    this._appendClass = "ui-datepicker-append"; // The name of the append marker class
    this._triggerClass = "ui-datepicker-trigger calendarimage"; // The name of the trigger marker class
    this._dialogClass = "ui-datepicker-dialog"; // The name of the dialog marker class
    this._disableClass = "ui-datepicker-disabled"; // The name of the disabled covering marker class
    this._unselectableClass = "ui-datepicker-unselectable"; // The name of the unselectable cell marker class
    this._currentClass = "ui-datepicker-current-day"; // The name of the current day marker class
    this._dayOverClass = "ui-datepicker-days-cell-over"; // The name of the day hover marker class
    this.regional = []; // Available regional settings, indexed by language code
    this.regional[""] = { // Default regional settings
        okBtn: "OK",
        closeText: "Done", // Display text for close link
        prevText: "Prev", // Display text for previous month link
        nextText: "Next", // Display text for next month link
        currentText: "Today", // Display text for current month link
        monthNames: ["January","February","March","April","May","June",
            "July","August","September","October","November","December"], // Names of months for drop-down and formatting
        monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // For formatting
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // For formatting
        dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // For formatting
        dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"], // Column headings for days starting at Sunday
        weekHeader: "Wk", // Column header for week of the year
        dateFormat: "mm/dd/yy", // See format options on parseDate
        firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
        isRTL: false, // True if right-to-left language, false if left-to-right
        showMonthAfterYear: false, // True if the year select precedes month, false for month then year
        yearSuffix: "", // Additional text to append to the year in the month headers
        monthSuffix: ""
    };
    this._defaults = { // Global defaults for all the date picker instances
        showOn: "focus", // "focus" for popup on focus,
            // "button" for trigger button, or "both" for either
        showAnim: "fadeIn", // Name of jQuery animation for popup
        showOptions: {}, // Options for enhanced animations
        defaultDate: null, // Used when field is blank: actual date,
            // +/-number for offset from today, null for today
        appendText: "", // Display text following the input box, e.g. showing the format
        buttonText: "...", // Text for trigger button
        buttonImage: "", // URL for trigger button image
        disable : false,
        buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
        hideIfNoPrevNext: false, // True to hide next/previous month links
            // if not applicable, false to just disable them
        navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
        gotoCurrent: false, // True if today link goes back to current selection instead
        changeMonth: false, // True if month can be selected directly, false if only prev/next
        changeYear: false, // True if year can be selected directly, false if only prev/next
        yearRange: "c-10:c+10", // Range of years to display in drop-down,
            // either relative to today's year (-nn:+nn), relative to currently displayed year
            // (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
        showOtherMonths: false, // True to show dates in other months, false to leave blank
        selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
        showWeek: false, // True to show week of the year, false to not show it
        calculateWeek: this.iso8601Week, // How to calculate the week of the year,
            // takes a Date and returns the number of the week for it
        shortYearCutoff: "+10", // Short year values < this are in the current century,
            // > this are in the previous century,
            // string value starting with "+" for current year + value
        minDate: new Date("1970/01/01"), // The earliest selectable date, or null for no limit
        maxDate: new Date("2099/12/31"), // The latest selectable date, or null for no limit
        duration: "fast", // Duration of display/closure
        beforeShowDay: null, // Function that takes a date and returns an array with
            // [0] = true if selectable, false if not, [1] = custom CSS class name(s) or "",
            // [2] = cell title (optional), e.g. $.datepicker.noWeekends
        beforeShow: null, // Function that takes an input field and
            // returns a set of custom settings for the date picker
        onSelect: null, // Define a callback function when a date is selected
        onSelectTime: null,
        onChangeMonthYear: null, // Define a callback function when the month or year is changed
        onClose: null, // Define a callback function when the datepicker is closed
        numberOfMonths: 1, // Number of months to show at a time
        showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
        stepMonths: 1, // Number of months to step back/forward
        stepBigMonths: 12, // Number of months to step back/forward for the big links
        altField: "", // Selector for an alternate field to store selected dates into
        altFormat: "", // The date format to use for the alternate field
        constrainInput: true, // The input is constrained by the current date format
        showButtonPanel: false, // True to show button panel, false to not show it
        autoSize: false, // True to size the input for the date format, false to leave as is
        disabled: false, // The initial disabled state
        isTimeVisible : false,
        showStyle : "left", // "left" to pop up the datepicker left-aligned with the input, "right" if right-aligned
        timeDiv : "",
        timeformat : 'hh:mm'
    };
    $.extend(this._defaults, this.regional[""]);
    this.dpDiv = bindHover($("<div id='" + this._mainDivId + "' class='tiny-ui-widget-content tiny-ui-datepicker tiny-ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"));
}

$.extend(Datepicker.prototype, {
    /* Class name added to elements to indicate already configured with a date picker. */
    markerClassName: "hasDatepicker",

    //Keep track of the maximum number of rows displayed (see #7043)
    maxRows: 4,

    // TODO rename to "widget" when switching to widget factory
    _widgetDatepicker: function() {
        return this.dpDiv;
    },

    /* Override the default settings for all instances of the date picker.
     * @param  settings  object - the new settings to use as defaults (anonymous object)
     * @return the manager object
     */
    setDefaults: function(settings) {
        extendRemove(this._defaults, settings || {});
        return this;
    },

    /* Attach the date picker to a jQuery selection.
     * @param  target    element - the target input field or division or span
     * @param  settings  object - the new settings to use for this date picker instance (anonymous)
     */
    _attachDatepicker: function(target, settings) {
        var nodeName, inline, inst;
        nodeName = target.nodeName.toLowerCase();
        inline = (nodeName === "div" || nodeName === "span");
        if (!target.id) {
            this.uuid += 1;
            target.id = "dp" + this.uuid;
        }
        inst = this._newInst($(target), inline);
        inst.settings = $.extend({}, settings || {});
        if (nodeName === "input") {
            this._connectDatepicker(target, inst);
        } else if (inline) {
            this._inlineDatepicker(target, inst);
        }
    },

    /* Create a new instance object. */
    _newInst: function(target, inline) {
        var id = target[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"); // escape jQuery meta chars
        return {id: id, input: target, // associated target
            selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
            drawMonth: 0, drawYear: 0, // month being drawn
            inline: inline, // is datepicker inline or not
            dpDiv: (!inline ? this.dpDiv : // presentation div
            bindHover($("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")))};
    },

    /* Attach the date picker to an input field. */
    _connectDatepicker: function(target, inst) {
        var input = $(target);
        inst.append = $([]);
        inst.trigger = $([]);
        if (input.hasClass(this.markerClassName)) {
            return;
        }
        this._attachments(input, inst);
        input.addClass(this.markerClassName).keydown(this._doKeyDown).
            keypress(this._doKeyPress).keyup(this._doKeyUp);
        this._autoSize(inst);
        $.data(target, PROP_NAME, inst);
        //If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
        if( inst.settings.disabled ) {
            this._disableDatepicker( target );
        }
    },

    /* Make attachments based on settings. */
    _attachments: function(input, inst) {
        var showOn, buttonText, buttonImage,
            appendText = this._get(inst, "appendText"),
            isRTL = this._get(inst, "isRTL");

        if (inst.append) {
            inst.append.remove();
        }
        if (appendText) {
            inst.append = $("<span class='" + this._appendClass + "'>" + appendText + "</span>");
            input[isRTL ? "before" : "after"](inst.append);
        }

        input.unbind("focus", this._showDatepicker);

        if (inst.trigger) {
            inst.trigger.remove();
        }

        showOn = this._get(inst, "showOn");
        if (showOn === "focus" || showOn === "both") { // pop-up date picker when in the marked field
            input.focus(this._showDatepicker);
        }
        if (showOn === "button" || showOn === "both") { // pop-up date picker when button clicked
            buttonText = this._get(inst, "buttonText");
            buttonImage = this._get(inst, "buttonImage");
            inst.trigger = $(this._get(inst, "buttonImageOnly") ?
                $('<span></span>').addClass(this._triggerClass):
                $("<button type='button'></button>").addClass(this._triggerClass).
                    html(!buttonImage ? buttonText : $('<span></span>').attr(
                    {alt:buttonText, title:buttonText })));
            input[isRTL ? "before" : "after"](inst.trigger);
            inst.trigger.click(function() {                
                var isDisable = (String(inst.input[0].disable) === "true");
                if(isDisable){
                    return;
                }
                if ($.datepicker._datepickerShowing) {
                    return false;
                } else {
                    $.datepicker._showDatepicker(input[0]);
                }
                return false;
            });
        }
    },

    /* Apply the maximum length for the date format. */
    _autoSize: function(inst) {
        if (this._get(inst, "autoSize") && !inst.inline) {
            var findMax, max, maxI, i,
                date = new Date(2009, 12 - 1, 20), // Ensure double digits
                dateFormat = this._get(inst, "dateFormat");

            if (dateFormat.match(/[DM]/)) {
                findMax = function(names) {
                    max = 0;
                    maxI = 0;
                    for (i = 0; i < names.length; i++) {
                        if (names[i].length > max) {
                            max = names[i].length;
                            maxI = i;
                        }
                    }
                    return maxI;
                };
                date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
                    "monthNames" : "monthNamesShort"))));
                date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
                    "dayNames" : "dayNamesShort"))) + 20 - date.getDay());
            }
            inst.input.attr("size", this._formatDate(inst, date).length);
        }
    },

    /* Attach an inline date picker to a div. */
    _inlineDatepicker: function(target, inst) {
        var divSpan = $(target);
        if (divSpan.hasClass(this.markerClassName)) {
            return;
        }
        divSpan.addClass(this.markerClassName).append(inst.dpDiv);
        $.data(target, PROP_NAME, inst);
        this._setDate(inst, this._getDefaultDate(inst), true);
        this._updateDatepicker(inst);
        this._updateAlternate(inst);
        //If disabled option is true, disable the datepicker before showing it (see ticket #5665)
        if( inst.settings.disabled ) {
            this._disableDatepicker( target );
        }
        // Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
        // http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
        inst.dpDiv.css( "display", "block" );
    },

    /* Pop-up the date picker in a "dialog" box.
     * @param  input element - ignored
     * @param  date    string or Date - the initial date to display
     * @param  onSelect  function - the function to call when a date is selected
     * @param  settings  object - update the dialog date picker instance's settings (anonymous object)
     * @param  pos int[2] - coordinates for the dialog's position within the screen or
     *                    event - with x/y coordinates or
     *                    leave empty for default (screen centre)
     * @return the manager object
     */
    _dialogDatepicker: function(input, date, onSelect, settings, pos) {
        var id, browserWidth, browserHeight, scrollX, scrollY,
            inst = this._dialogInst; // internal instance

        if (!inst) {
            this.uuid += 1;
            id = "dp" + this.uuid;
            this._dialogInput = $("<input type='text' id='" + id +
                "' style='position: absolute; top: -100px; width: 0px;'/>");
            this._dialogInput.keydown(this._doKeyDown);
            $("body").append(this._dialogInput);
            inst = this._dialogInst = this._newInst(this._dialogInput, false);
            inst.settings = {};
            $.data(this._dialogInput[0], PROP_NAME, inst);
        }
        extendRemove(inst.settings, settings || {});
        date = (date && date.constructor === Date ? this._formatDate(inst, date) : date);
        this._dialogInput.val(date);

        this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
        if (!this._pos) {
            browserWidth = document.documentElement.clientWidth;
            browserHeight = document.documentElement.clientHeight;
            scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            this._pos = // should use actual width/height below
                [(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
        }

        // move input on screen for focus, but hidden behind dialog
        this._dialogInput.css("left", (this._pos[0]) + "px").css("top", this._pos[1] + "px");
        inst.settings.onSelect = onSelect;
        this._inDialog = true;
        this.dpDiv.addClass(this._dialogClass);
        this._showDatepicker(this._dialogInput[0]);
        if ($.blockUI) {
            $.blockUI(this.dpDiv);
        }
        $.data(this._dialogInput[0], PROP_NAME, inst);
        return this;
    },

    /* Detach a datepicker from its control.
     * @param  target    element - the target input field or division or span
     */
    _destroyDatepicker: function(target) {
        var nodeName,
            $target = $(target),
            inst = $.data(target, PROP_NAME);

        if (!$target.hasClass(this.markerClassName)) {
            return;
        }

        nodeName = target.nodeName.toLowerCase();
        $.removeData(target, PROP_NAME);
        if (nodeName === "input") {
            inst.append.remove();
            inst.trigger.remove();
            $.datepicker.dpDiv.remove();
            $target.removeClass(this.markerClassName).
                unbind("focus", this._showDatepicker).
                unbind("keydown", this._doKeyDown).
                unbind("keypress", this._doKeyPress).
                unbind("keyup", this._doKeyUp);
        } else if (nodeName === "div" || nodeName === "span") {
            $target.removeClass(this.markerClassName).empty();
        }
    },

    /* Enable the date picker to a jQuery selection.
     * @param  target    element - the target input field or division or span
     */
    _enableDatepicker: function(target) {
        var nodeName, inline,
            $target = $(target),
            inst = $.data(target, PROP_NAME);

        if (!$target.hasClass(this.markerClassName)) {
            return;
        }

        nodeName = target.nodeName.toLowerCase();
        if (nodeName === "input") {
            target.disabled = false;
            inst.trigger.filter("button").
                each(function() { this.disabled = false; }).end().
                filter("img").css({opacity: "1.0", cursor: ""});
        } else if (nodeName === "div" || nodeName === "span") {
            inline = $target.children("." + this._inlineClass);
            inline.children().removeClass("ui-state-disabled");
            inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
                prop("disabled", false);
        }
        this._disabledInputs = $.map(this._disabledInputs,
            function(value) { return (value === target ? null : value); }); // delete entry
    },

    /* Disable the date picker to a jQuery selection.
     * @param  target    element - the target input field or division or span
     */
    _disableDatepicker: function(target) {
        var nodeName, inline,
            $target = $(target),
            inst = $.data(target, PROP_NAME);

        if (!$target.hasClass(this.markerClassName)) {
            return;
        }

        nodeName = target.nodeName.toLowerCase();
        if (nodeName === "input") {
            target.disabled = true;
            inst.trigger.filter("button").
                each(function() { this.disabled = true; }).end().
                filter("img").css({opacity: "0.5", cursor: "default"});
        } else if (nodeName === "div" || nodeName === "span") {
            inline = $target.children("." + this._inlineClass);
            inline.children().addClass("ui-state-disabled");
            inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
                prop("disabled", true);
        }
        this._disabledInputs = $.map(this._disabledInputs,
            function(value) { return (value === target ? null : value); }); // delete entry
        this._disabledInputs[this._disabledInputs.length] = target;
    },

    /* Is the first field in a jQuery collection disabled as a datepicker?
     * @param  target    element - the target input field or division or span
     * @return boolean - true if disabled, false if enabled
     */
    _isDisabledDatepicker: function(target) {
        if (!target) {
            return false;
        }
        for (var i = 0; i < this._disabledInputs.length; i++) {
            if (this._disabledInputs[i] === target) {
                return true;
            }
        }
        return false;
    },

    /* Retrieve the instance data for the target control.
     * @param  target  element - the target input field or division or span
     * @return  object - the associated instance data
     * @throws  error if a jQuery problem getting data
     */
    _getInst: function(target) {
        try {
            return $.data(target, PROP_NAME);
        }
        catch (err) {
            throw "Missing instance data for this datepicker";
        }
    },

    /* Update or retrieve the settings for a date picker attached to an input field or division.
     * @param  target  element - the target input field or division or span
     * @param  name    object - the new settings to update or
     *                string - the name of the setting to change or retrieve,
     *                when retrieving also "all" for all instance settings or
     *                "defaults" for all global defaults
     * @param  value   any - the new value for the setting
     *                (omit if above is an object or to retrieve a value)
     */
    _optionDatepicker: function(target, name, value) {
        var settings, date, minDate, maxDate,
            inst = this._getInst(target);

        if (arguments.length === 2 && typeof name === "string") {
            return (name === "defaults" ? $.extend({}, $.datepicker._defaults) :
                (inst ? (name === "all" ? $.extend({}, inst.settings) :
                this._get(inst, name)) : null));
        }

        settings = name || {};
        if (typeof name === "string") {
            settings = {};
            settings[name] = value;
        }

        if (inst) {
            if (this._curInst === inst) {
                this._hideDatepicker();
            }

            date = this._getDateDatepicker(target, true);
            minDate = this._getMinMaxDate(inst, "min");
            maxDate = this._getMinMaxDate(inst, "max");
            extendRemove(inst.settings, settings);
            // reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
            if (minDate !== null && settings.dateFormat !== undefined && settings.minDate === undefined) {
                inst.settings.minDate = this._formatDate(inst, minDate);
            }
            if (maxDate !== null && settings.dateFormat !== undefined && settings.maxDate === undefined) {
                inst.settings.maxDate = this._formatDate(inst, maxDate);
            }
            if ( "disabled" in settings ) {
                if ( settings.disabled ) {
                    this._disableDatepicker(target);
                } else {
                    this._enableDatepicker(target);
                }
            }
            this._attachments($(target), inst);
            this._autoSize(inst);
            this._setDate(inst, date);
            this._updateAlternate(inst);
            this._updateDatepicker(inst);
        }
    },

    // change method deprecated
    _changeDatepicker: function(target, name, value) {
        this._optionDatepicker(target, name, value);
    },

    /* Redraw the date picker attached to an input field or division.
     * @param  target  element - the target input field or division or span
     */
    _refreshDatepicker: function(target) {
        var inst = this._getInst(target);
        if (inst) {
            this._updateDatepicker(inst);
        }
    },

    /* Set the dates for a jQuery selection.
     * @param  target element - the target input field or division or span
     * @param  date    Date - the new date
     */
    _setDateDatepicker: function(target, date) {
        var inst = this._getInst(target);
        if (inst) {
            this._setDate(inst, date);
            this._updateDatepicker(inst);
            this._updateAlternate(inst);
        }
    },

    /* Get the date(s) for the first entry in a jQuery selection.
     * @param  target element - the target input field or division or span
     * @param  noDefault boolean - true if no default date is to be used
     * @return Date - the current date
     */
    _getDateDatepicker: function(target, noDefault) {
        var inst = this._getInst(target);
        if (inst && !inst.inline) {
            this._setDateFromField(inst, noDefault);
        }
        return (inst ? this._getDate(inst) : null);
    },

    /* Handle keystrokes. */
    _doKeyDown: function(event) {
        var onSelect, dateStr, sel,
            inst = $.datepicker._getInst(event.target),
            handled = true,
            isRTL = inst.dpDiv.is(".ui-datepicker-rtl");

        inst._keyEvent = true;
        if ($.datepicker._datepickerShowing) {
            switch (event.keyCode) {
                case 9: $.datepicker._hideDatepicker();
                        handled = false;
                        break; // hide on tab out
                case 13: sel = $("td." + $.datepicker._dayOverClass + ":not(." +
                                    $.datepicker._currentClass + ")", inst.dpDiv);
                        if (sel[0]) {
                            $.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
                        }

                        onSelect = $.datepicker._get(inst, "onSelect");
                        if (onSelect) {
                            dateStr = $.datepicker._formatDate(inst);

                            // trigger custom callback
                            onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
                        } else {
                            $.datepicker._hideDatepicker();
                        }

                        return false; // don't submit the form
                case 27: $.datepicker._hideDatepicker();
                        break; // hide on escape
                case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                            -$.datepicker._get(inst, "stepBigMonths") :
                            -$.datepicker._get(inst, "stepMonths")), "M");
                        break; // previous month/year on page up/+ ctrl
                case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                            +$.datepicker._get(inst, "stepBigMonths") :
                            +$.datepicker._get(inst, "stepMonths")), "M");
                        break; // next month/year on page down/+ ctrl
                case 35: if (event.ctrlKey || event.metaKey) {
                            $.datepicker._clearDate(event.target);
                        }
                        handled = event.ctrlKey || event.metaKey;
                        break; // clear on ctrl or command +end
                case 36: if (event.ctrlKey || event.metaKey) {
                            $.datepicker._gotoToday(event.target);
                        }
                        handled = event.ctrlKey || event.metaKey;
                        break; // current on ctrl or command +home
                case 37: if (event.ctrlKey || event.metaKey) {
                            $.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), "D");
                        }
                        handled = event.ctrlKey || event.metaKey;
                        // -1 day on ctrl or command +left
                        if (event.originalEvent.altKey) {
                            $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                                -$.datepicker._get(inst, "stepBigMonths") :
                                -$.datepicker._get(inst, "stepMonths")), "M");
                        }
                        // next month/year on alt +left on Mac
                        break;
                case 38: //for date
                        if (event.ctrlKey || event.metaKey) {
                            $.datepicker._adjustDate(event.target, -7, "D");
                        }
                        handled = event.ctrlKey || event.metaKey;
                        break; // -1 week on ctrl or command +up
                case 39: if (event.ctrlKey || event.metaKey) {
                            $.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), "D");
                        }
                        handled = event.ctrlKey || event.metaKey;
                        // +1 day on ctrl or command +right
                        if (event.originalEvent.altKey) {
                            $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                                +$.datepicker._get(inst, "stepBigMonths") :
                                +$.datepicker._get(inst, "stepMonths")), "M");
                        }
                        // next month/year on alt +right
                        break;
                case 40: if (event.ctrlKey || event.metaKey) {
                            $.datepicker._adjustDate(event.target, +7, "D");
                        }
                        handled = event.ctrlKey || event.metaKey;
                        break; // +1 week on ctrl or command +down
                default: handled = false;
            }
        } else if (event.keyCode === 36 && event.ctrlKey) { // display the date picker on ctrl+home
            $.datepicker._showDatepicker(this);
        } else {
            handled = false;
        }

        if (handled) {
            event.preventDefault();
            event.stopPropagation();
        }
    },

    /* Filter entered characters - based on date format. */
    _doKeyPress: function(event) {
        var chars, chr,
            inst = $.datepicker._getInst(event.target);
    },

    /* Synchronise manual entry and field/alternate field. */
    _doKeyUp: function(event) {
        var date,
            inst = $.datepicker._getInst(event.target);

        if (inst.input.val() !== inst.lastVal) {
            try {
                date = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
                    (inst.input ? inst.input.val() : null),
                    $.datepicker._getFormatConfig(inst));

                if (date) { // only if valid
                    $.datepicker._setDateFromField(inst);
                    $.datepicker._updateAlternate(inst);
                    $.datepicker._updateDatepicker(inst);
                }
            }
            catch (err) {
            }
        }
        return true;
    },

    /* Pop-up the date picker for a given input field.
     * If false returned from beforeShow event handler do not show.
     * @param  input  element - the input field attached to the date picker or
     *                    event - if triggered by focus
     */
    _showDatepicker: function(input) {
        input = input.target || input;
        if (input.nodeName.toLowerCase() !== "input") { // find from button/image trigger
            input = $("input", input.parentNode)[0];
        }

        if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput === input) { // already here
            return;
        }

        var inst, beforeShow, beforeShowSettings, isFixed,
            offset, showAnim, duration;

        inst = $.datepicker._getInst(input);
        if ($.datepicker._curInst && $.datepicker._curInst !== inst) {
            $.datepicker._curInst.dpDiv.stop(true, true);
            if ( inst && $.datepicker._datepickerShowing ) {
                $.datepicker._hideDatepicker( $.datepicker._curInst.input[0] );
            }
        }
        beforeShow = $.datepicker._get(inst, "beforeShow");
        beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
        if(beforeShowSettings === false){
            return;
        }
        extendRemove(inst.settings, beforeShowSettings);

        inst.lastVal = null;
        $.datepicker._lastInput = input;
        $.datepicker._setDateFromField(inst);

        if ($.datepicker._inDialog) { // hide cursor
            input.value = "";
        }
        if (!$.datepicker._pos) { // position below input
            $.datepicker._pos = $.datepicker._findPos(input);
            $.datepicker._pos[1] += input.offsetHeight; // add the height
        }

        isFixed = false;
        $(input).parents().each(function() {
            isFixed |= $(this).css("position") === "fixed";
            return !isFixed;
        });

        offset = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
        $.datepicker._pos = null;
        //to avoid flashes on Firefox
        inst.dpDiv.empty();
        // determine sizing offscreen
        inst.dpDiv.css({position: "absolute", display: "block", top: "-1000px"});
        $.datepicker._updateDatepicker(inst);
        // fix width for dynamic number of date pickers
        // and adjust position before showing
        offset = $.datepicker._checkOffset(inst, offset, isFixed);
        var offsetLeft = offset.left;
        //Pop-up the datepicker right-aligned with the input
        if ("right" == $.datepicker._get(inst, 'showStyle')) {
            var dpWidth = inst.dpDiv.outerWidth(),
                inputWidth = inst.input ? inst.input.parent().outerWidth() : 0;
            var shiftDist = dpWidth - inputWidth;
            offsetLeft -= shiftDist;
        }
        inst.dpDiv.css({position: ($.datepicker._inDialog && $.blockUI ?
            "static" : (isFixed ? "fixed" : "absolute")), display: "none",
            left: offsetLeft + "px", top: offset.top + "px"});

        if (!inst.inline) {
            showAnim = $.datepicker._get(inst, "showAnim");
            duration = $.datepicker._get(inst, "duration");
            inst.dpDiv.zIndex($(input).zIndex()+1);
            $.datepicker._datepickerShowing = true;

            if ( $.effects && $.effects.effect[ showAnim ] ) {
                inst.dpDiv.show(showAnim, $.datepicker._get(inst, "showOptions"), duration);
            } else {
                inst.dpDiv[showAnim || "show"](showAnim ? duration : null);
            }

            if ( $.datepicker._shouldFocusInput( inst ) ) {
                inst.input.focus();
            }

            $.datepicker._curInst = inst;
        }
    },
    
    /* Generate the date picker content. */
    _updateDatepicker: function(inst) {
         var self = this;
         self.maxRows = 4; //Reset the max number of rows being displayed (see #7043)
         var borders = $.datepicker._getBorders(inst.dpDiv);
         instActive = inst; // for delegate hover events
         inst.dpDiv.empty().append(this._generateHTML(inst));
         inst.inputDiv = inst.dpDiv.find(".tiny-time-input");
         inst.focusInput = [];
         inst.expendedMonthYearData = false;
         $dpTitle=inst.dpDiv.find(".ui-datepicker-title");
         $("#img" + inst.id).on("click", function() {
             if (inst.expendedMonthYearData === true) {
                  $($dpTitle[0].lastChild).remove();
                 // After the 3rd index element is removed, the 4th index element becomes the
                 //  3rd element. Hence the same remove two times.
                 $($dpTitle[0].lastChild).remove();
                 $dpTitle.find("input").css({"color":"#666"});
                 $("#img" + inst.id).removeClass("upbtn").addClass("downbtn");
                 var downBtnImgDiv = $('<div>');
                 downBtnImgDiv[0].className = 'tiny_widgets_charts_downbuttonbright_image';
                 document.body.appendChild(downBtnImgDiv[0]);
                 var styl = downBtnImgDiv[0].currentStyle || window.getComputedStyle(downBtnImgDiv[0], null);
                 var path = styl.backgroundImage.substring(4, styl.backgroundImage.length-1);
                 path = path.split('"');
                 if (path.length > 1){
                     path = path[1];
                 }
                 downBtnImgDiv.remove();
                 inst.expendedMonthYearData = false;
                 $($dpTitle).removeClass("tiny-ui-title-expand");
           } else {               
                 inst.isMove = false;
                   $dpTitle.append(inst.yearMonthData);
                   // Retain the size of the header. Otherwise the header will stretch to contain the drop-down
                   $(inst.dpDiv.find(".ui-datepicker-header")[0]);
                   $($dpTitle).addClass("tiny-ui-title-expand");
                                       
                $dpTitle.find("input").css({"color":"#4896c6"});
            
                var yearList = inst.dpDiv.find('.tiny_Date_Select_Year')[0].childNodes;
                for(var y=0; y<yearList.length; y++) {
                    if(yearList[y].value === inst.selectedYear)
                    {
                        $(yearList[y]).css({"color":"#FFFFFF","background-color": "#5ecc49"});
                    }
                }
                var $monthSelect = inst.dpDiv.find('.tiny_Date_Select_Month');
                var monthList = $monthSelect[0].childNodes;
                var counter = 0;                        
                $monthSelect.find("[value =" +(inst.selectedMonth-counter)+"]").css({"color":"#FFFFFF","background-color": "#5ecc49"});
                $("#img" + inst.id).removeClass("downbtn").addClass("upbtn");
                var upBtnImgDiv = $('<div>');
                upBtnImgDiv[0].className = 'tiny_widgets_charts_upbuttonbright_image';
                document.body.appendChild(upBtnImgDiv[0]);
                var styl = upBtnImgDiv[0].currentStyle || window.getComputedStyle(upBtnImgDiv[0], null);
                var path = styl.backgroundImage.substring(4, styl.backgroundImage.length-1);
                path = path.split('"');
                if (path.length > 1)
                {
                    path = path[1];
                }
                upBtnImgDiv.remove();
                inst.expendedMonthYearData = true;
                
                inst.dpDiv.find('.tiny_Date_Select_Year')[0].onclick = function(e)
                {
                    evt = (window.event)? event : e;
                    var yearValue = evt.target ? evt.target.innerHTML : 
                             evt.srcElement.innerHTML;
                    
                    inst['drawYear'] = parseInt(yearValue,10);
                    
                    if (isNaN(inst.drawYear))
                     {
                        e.preventDefault();
                        return false;
                     }
                    $.datepicker._notifyChange(inst);
                    $.datepicker._adjustDate($('#' + inst.id));
                };
                $monthSelect[0].onclick = function(e)
                {
                    evt = (window.event)? event : e;
                    var monthName = evt.target ? evt.target.innerHTML : 
                             evt.srcElement.innerHTML;
                    var totalMonthDisplayed = 
                        $monthSelect[0].childNodes.length;
                    var monthValue;
                    for (var i =0; i < totalMonthDisplayed; i++)
                    {
                        if ($monthSelect[0].childNodes[i].innerHTML === monthName)
                        {
                            monthValue = i;
                            break;
                        }
                    }
                    inst['drawMonth'] = 12 - totalMonthDisplayed + monthValue;
                    if (isNaN(inst.drawYear))
                    {
                        $dpTitle.find('input').each(function(index,elm)
                        {
                            if (index === 0)
                            {
                                inst['drawYear'] = parseInt(elm.value);
                                return;
                            }
                        }
                        );
                    }
                   $.datepicker._notifyChange(inst);
                   $.datepicker._adjustDate($('#' + inst.id));
                }
           }
            
           //生成的年份选择头部全内容的高
          var overviewHeight = (inst.maxYear - inst.minYear+1)*21;
          //展示块的高
          var viewportHeight = 250;
          //滑块的高
          var sliderHeight = 60;
         //滑块当前位置=鼠标当前位置-鼠标开始位置+滑块开始位置  或 0
         // 或viewportHeight-sliderHeight;            
         inst.maxSize = viewportHeight - sliderHeight - 7;
         inst.ratio = (overviewHeight - viewportHeight) / inst.maxSize;
 
         var diff = (inst.drawYear - inst.minYear)*21;
         var overviewTop = diff;
         var sliderTop = overviewTop/inst.ratio;
         if(sliderTop > inst.maxSize) {
            sliderTop = inst.maxSize;
            overviewTop = sliderTop*inst.ratio;
         }
         inst.sliderElement = inst.dpDiv.find("#DP_jQuery_" + dpuuid +"dv_scroll_bar3").find(".eviewDatetime_Scrollbar-Handle");
         inst.overview = inst.dpDiv.find("#DP_jQuery_" + dpuuid +"dv_scroll3").find(".Scroller-Container");
         //UI为规避日期选择年份问题，当年分数量小于整个展示块能够展示的数量时，滑块会向上漂移。给用户造成只能选择今年的错觉。
         if(inst.maxYear - inst.minYear > 11)
         {
             inst.sliderElement.css("top", sliderTop + "px");
             inst.overview.css("top", -overviewTop);
         }
         else{
             inst.sliderElement.css("top", -1000 + "px");
         }
        });
              var cover = inst.dpDiv.find('iframe.ui-datepicker-cover'); // IE6- only
         if( !!cover.length ){ //avoid call to outerXXXX() when not in IE6
                  cover.css({left: -borders[0], top: -borders[1], width: inst.dpDiv.outerWidth(), height: inst.dpDiv.outerHeight()})
         }
         inst.dpDiv.find('.' + this._dayOverClass + ' a').mouseover();
         var numMonths = this._getNumberOfMonths(inst);
         var cols = numMonths[1];
         var width = 17;
         inst.dpDiv.removeClass('ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4').width('');
         if (cols > 1)
                  inst.dpDiv.addClass('ui-datepicker-multi-' + cols).css('width', (width * cols) + 'em');
         inst.dpDiv[(numMonths[0] != 1 || numMonths[1] != 1 ? 'add' : 'remove') +
                  'Class']('ui-datepicker-multi');
         inst.dpDiv[(this._get(inst, 'isRTL') ? 'add' : 'remove') +
                  'Class']('ui-datepicker-rtl');
         if (inst == $.datepicker._curInst && $.datepicker._datepickerShowing && inst.input &&
                           // #6694 - don't focus the input if it's already focused
                           // this breaks the change event in IE
                           inst.input.is(':visible') && !inst.input.is(':disabled') && inst.input[0] != document.activeElement)
                  inst.input.focus();
         // deffered render of the years select (to avoid flashes on Firefox) 
         if( inst.yearshtml ){
                  var origyearshtml = inst.yearshtml;
                  setTimeout(function(){
                           //assure that inst.yearshtml didn't change.
                           if( origyearshtml === inst.yearshtml && inst.yearshtml ){
                                    inst.dpDiv.find('select.ui-datepicker-year:first').replaceWith(inst.yearshtml);
                           }
                           origyearshtml = inst.yearshtml = null;
                  }, 0);
         }
    },
    /* Retrieve the size of left and top borders for an element.
            @param  elem  (jQuery object) the element of interest
            @return  (number[2]) the left and top borders */
         _getBorders: function(elem) {
                  var convert = function(value) {
                           return {thin: 1, medium: 2, thick: 3}[value] || value;
                  };
                  return [parseFloat(convert(elem.css('border-left-width'))),
                           parseFloat(convert(elem.css('border-top-width')))];
         },

    // #6694 - don't focus the input if it's already focused
    // this breaks the change event in IE
    // Support: IE and jQuery <1.9
    _shouldFocusInput: function( inst ) {
        return inst.input && inst.input.is( ":visible" ) && !inst.input.is( ":disabled" ) && !inst.input.is( ":focus" );
    },

    /* Check positioning to remain on screen. */
    _checkOffset: function(inst, offset, isFixed) {
        var dpWidth = inst.dpDiv.outerWidth(),
            dpHeight = inst.dpDiv.outerHeight(),
            inputWidth = inst.input ? inst.input.parent().outerWidth() : 0,
            inputHeight = inst.input ? inst.input.parent().outerHeight() : 0,
            viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft()),
            viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());

        offset.left -= (this._get(inst, "isRTL") ? (dpWidth - inputWidth) : 0);
        offset.left -= (isFixed && offset.left === inst.input.offset().left) ? $(document).scrollLeft() : 0;
        offset.top -= (isFixed && offset.top === (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

        // now check if datepicker is showing outside window viewport - move to a better place if so.
        offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
            Math.abs(offset.left + dpWidth - viewWidth) : 2);
        offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
            Math.abs(dpHeight + inputHeight) : -8);

        return offset;
    },

    /* Find an object's position on the screen. */
    _findPos: function(obj) {
        var position,
            inst = this._getInst(obj),
            isRTL = this._get(inst, "isRTL");

        while (obj && (obj.type === "hidden" || obj.nodeType !== 1 || $.expr.filters.hidden(obj))) {
            obj = obj[isRTL ? "previousSibling" : "nextSibling"];
        }

        position = $(obj).offset();
        return [position.left, position.top];
    },

    /* Hide the date picker from view.
     * @param  input  element - the input field attached to the date picker
     */
    _hideDatepicker: function(input) {
        var showAnim, duration, postProcess, onClose,
            inst = this._curInst;

        if (!inst || (input && inst !== $.data(input, PROP_NAME))) {
            return;
        }

        if (this._datepickerShowing) {
            showAnim = this._get(inst, "showAnim");
            duration = this._get(inst, "duration");
            postProcess = function() {
                $.datepicker._tidyDialog(inst);
            };

            // DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
            if ( $.effects && ( $.effects.effect[ showAnim ] || $.effects[ showAnim ] ) ) {
                inst.dpDiv.hide(showAnim, $.datepicker._get(inst, "showOptions"), duration, postProcess);
            } else {
                inst.dpDiv[(showAnim === "slideDown" ? "slideUp" :
                    (showAnim === "fadeIn" ? "fadeOut" : "hide"))]((showAnim ? duration : null), postProcess);
            }

            if (!showAnim) {
                postProcess();
            }
            this._datepickerShowing = false;
            onClose = this._get(inst, "onClose");
            if (onClose) {
                onClose.apply((inst.input ? inst.input[0] : null), [(inst.input ? inst.input.val() : ""), inst]);
            }

            this._lastInput = null;
            if (this._inDialog) {
                this._dialogInput.css({ position: "absolute", left: "0", top: "-100px" });
                if ($.blockUI) {
                    $.unblockUI();
                    $("body").append(this.dpDiv);
                }
            }
            this._inDialog = false;
        }
    },

    /* Tidy up after a dialog display. */
    _tidyDialog: function(inst) {
        inst.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar");
    },

    /* Close date picker if clicked elsewhere. */
    _checkExternalClick: function(event) {
        if (!$.datepicker._curInst) {
            return;
        }

        var $target = $(event.target),
            inst = $.datepicker._getInst($target[0]);

        if ( ( ( $target[0].id !== $.datepicker._mainDivId &&
                $target.parents("#" + $.datepicker._mainDivId).length === 0 &&
                !$target.hasClass($.datepicker.markerClassName) &&
                !$target.closest(".ui-datepicker-trigger").length &&
                $.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI) ) ) ||
            ( $target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst !== inst ) ) {
                $.datepicker._hideDatepicker();
        }
    },

    /* Adjust one of the date sub-fields. */
    _adjustDate: function(id, offset, period) {
        var target = $(id),
            inst = this._getInst(target[0]);

        if (this._isDisabledDatepicker(target[0])) {
            return;
        }
        this._adjustInstDate(inst, offset +
            (period === "M" ? this._get(inst, "showCurrentAtPos") : 0), // undo positioning
            period);
        this._updateDatepicker(inst);
    },

    /* Action for current link. */
    _gotoToday: function(id) {
        var date,
            target = $(id),
            inst = this._getInst(target[0]);

        if (this._get(inst, "gotoCurrent") && inst.currentDay) {
            inst.selectedDay = inst.currentDay;
            inst.drawMonth = inst.selectedMonth = inst.currentMonth;
            inst.drawYear = inst.selectedYear = inst.currentYear;
        } else {
            date = new Date();
            inst.selectedDay = date.getDate();
            inst.drawMonth = inst.selectedMonth = date.getMonth();
            inst.drawYear = inst.selectedYear = date.getFullYear();
        }
        this._notifyChange(inst);
        this._adjustDate(target);
    },

    /* Action for selecting a new month/year. */
    _selectMonthYear: function(id, select, period) {
        var target = $(id),
            inst = this._getInst(target[0]);

        inst["selected" + (period === "M" ? "Month" : "Year")] =
        inst["draw" + (period === "M" ? "Month" : "Year")] =
            parseInt(select.options[select.selectedIndex].value,10);

        this._notifyChange(inst);
        this._adjustDate(target);
    },
    
    "_isValidTimeKey" : function(e) {
        var valid = [
            8,        // backspace
            9,        //tab
            13,       // enter
            27,       // escape
            35,       // end
            36,       // home
            37,       // left arrow
            39,       // right arrow
            46,       // delete
            38,       // up Arrow
            40,       // down Arrow
            48, 96,   // 0
            49, 97,   // 1
            50, 98,   // 2
            51, 99,   // 3
            52, 100,  // 4
            53, 101,  // 5
            54, 102,  // 6
            55, 103,  // 7
            56, 104,  // 8
            57, 105,  // 9
        ];
        for (var i = 0, c; c = valid[i]; i++) {
            if (e.keyCode == c) return true;
        }
        return false;
    },    
    _eventPrevent : function(evt) {        
        // If preventDefault exists, run it on the original event
        if ( evt.preventDefault ) {
            evt.preventDefault();

        // Support: IE
        // Otherwise set the returnValue property of the original event to false
        } else {
            evt.returnValue = false;
        }
    },
    
    _eventStop : function(evt) {
        if (evt.stopPropagation) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }
    },
    
    _timeFocusEvt : function(id,e) {
        var target = $(id),
        inst = this._getInst(target[0]);
        if(window.event) { // IE
            var $targetinput = $(e.srcElement);
        }
        else { // Netscape/Firefox/Opera
            var $targetinput = $(e.target);
        }
        inst.focusInput = $targetinput;
    },
    
    _timeKeydownEvt : function(id,e) {
        var target = $(id),
        inst = this._getInst(target[0]),
        keyNum,action, dateStr;
        if(window.event) // IE
        {
            keyNum = e.keyCode;
        }
        else  // Netscape/Firefox/Opera
        {
            keyNum = e.which;
        }
        if(e.target) {
            var inputElement = $(e.target);
        } else {
            var inputElement = $(e.srcElement);
        }
        //输入有效性验证
        if (!this._isValidTimeKey(e)) {
            this._eventPrevent(e);
        };
        //输入数字个数限制
        if (((keyNum >= 48) && (keyNum <= 57)) || 
            ((keyNum >= 96) && (keyNum <= 105))) {
            var inputLength = inputElement.val().length;
            var format = inputElement.attr("format");
            var maxLength = 2;
            //IE
            if (document.selection) {
                var sel = document.selection.createRange(); 
                if (sel.text.length > 0) { 
                    return;
                } 
            } 
            //标准浏览器
            if(inputElement[0].selectionEnd !== inputElement[0].selectionStart) {
                return;
            }
            if("SSS" === format) {
                maxLength = 3;
            } 
            if(maxLength === inputLength) {
                this._eventPrevent(e);
            }
        }
        switch(keyNum){
            case 38: {//向上键
                this._eventPrevent(e);
                this._eventStop(e);
                this._selectTime(id,1);
                break;
            }
            case 40: {//向下键
                this._eventPrevent(e);
                this._eventStop(e);
                this._selectTime(id,0);
                break;
            } 
            case 9: {//Tab键
                this._eventPrevent(e);
                this._eventStop(e);
                this._tabRange(id);    
                break;
            }  
            default : break;
        }
    },
    
    _setTimeEditorValue : function(inst) {
        var timeValue = inst.input[0].timeValue;            
        var $timeEditor = inst.dpDiv.find(".tiny-time-editor");
            if(this._get(inst, "ampm")) {
                var timeValueArray = timeValue.split(" ");                
                $timeEditor.find("[format = AMPM]").val(timeValueArray[1]);    
                var timeArray = timeValueArray[0].split(":");
            } else {
                var timeArray = timeValue.split(":");
            }
            var timeLength = timeArray.length;
            if(1 === timeLength) {
                $timeEditor.find("[format = HH],[format = H]").val(timeArray[0]);
            }
            if(2 === timeLength) {
                $timeEditor.find("[format = HH],[format = H]").val(timeArray[0]);
                $timeEditor.find("[format = MM]").val(timeArray[1]);
            }
            if(3 === timeLength) {
                $timeEditor.find("[format = HH],[format = H]").val(timeArray[0]);
                $timeEditor.find("[format = MM]").val(timeArray[1]);
                $timeEditor.find("[format = SSS],[format = SS]").val(timeArray[2]);
            }
    },
    
    _timeblurEvt : function(id,e) {
    	var target = $(id),
            inst = this._getInst(target[0]);
        if(e.target) {
            var inputElement = $(e.target);
        } else {
            var inputElement = $(e.srcElement);
        }
        //输入数字格式限制
        var inputNum = inputElement.val(), value;
        var format = inputElement.attr("format");
        var maxNum = inputElement.attr("maxNum");
        if(maxNum !== "PM") {
            var inputNum = parseInt(inputNum, 10);
            maxNum = parseInt(maxNum, 10);
            if(isNaN(inputNum) || (inputNum > maxNum)) {
                inputNum = maxNum;
             } else if((12 === maxNum)&&(inputNum === 0)) {
                 inputNum = 1;
             }
        }
        inputNum = inputNum +"";
        if("AMPM" === format) {
            if(("AM" !== inputNum) && ("PM" !== inputNum)){
                value = "AM";
            } else {
                value = inputNum;
            }
        } else if("H" === format) {
            value = inputNum;
        } else if("SSS" === format) {
            value = inputNum.length < 2 ? ("00" + inputNum) : inputNum.length < 3 ? (
                                "0" + inputNum) : inputNum;
        } else {
            value = inputNum.length <2 ? ("0" + inputNum) : inputNum;
        }
        inputElement.val(value);
        this._conformTime(id);
        //如果最大/最小值定义,且此时日期值为该最大/最小值    
        if(inst.input[0].minMaxDate === inst.dateStr) {
            this._restrictDateTime(inst);
        }
    },
    _clearTime : function(id) {
		var target = $(id),
			inst = this._getInst(target[0]);
			inst.input.val("");
			this._hideDatepicker();
	},
    _selectTime : function(id,action){
        var target = $(id),
            inst = this._getInst(target[0]);
        if(0 === inst.focusInput.length) {
            inst.focusInput = $(inst.inputDiv[0]);
        }
        inst.focusInput.select();
        var focusElement = inst.focusInput;
        if(1 == action) {
            onSelectTime = this._get(inst, "onSelectTimeUp");
            onSelectTime.apply((inst.input ? inst.input[0] : null), [focusElement, inst]);  // trigger custom callback
        }
        if(0 == action){
            onSelectTime = this._get(inst, "onSelectTimeDown");
            onSelectTime.apply((inst.input ? inst.input[0] : null), [focusElement, inst]);  // trigger custom callback
        }
        //先整合时间，再做OK点击处理，以防第一次点击OK时，date取不到#1565
        this._conformTime(id);
        if(2 == action){//OK
            this._hideDatepicker();
        }        
        //如果最大/最小值定义,且此时日期值为该最大/最小值
        if(inst.input[0].minMaxDate === inst.dateStr) {
            this._restrictDateTime(inst);
        }
    },
    
    //整合时间具体值
    "_conformTime" : function(id) {
        var target = $(id),
        inst = this._getInst(target[0]),
        inputValues = [], 
        num = inst.inputDiv.length;
        if(this._get(inst, "ampm")) {
            num -= 1;
        }
        for(var i = 0; i < num; i++) {
            inputValues.push(inst.inputDiv[i].value);
        }
        inst.editorValue = inputValues.join(':');
        if(this._get(inst, "ampm")) {
            inst.editorValue = inst.editorValue + " " +inst.inputDiv[num].value;
        }
        inst.input[0].timeValue = inst.editorValue;
        inst.input.val(inst.dateStr+" "+inst.editorValue);
    },

    //tab键事件
    "_tabRange" : function(id) {
        var target = $(id),
        inst = this._getInst(target[0]),
        inputsNum = inst.inputDiv.length;
        if(!inst.focusInput) {
            inst.focusInput = $(inst.inputDiv[0]);
        }
        for(var i = 0; i < inputsNum; i++) {
            if(inst.focusInput[0] === inst.inputDiv[i])
            break;
        }
        if(inputsNum-1 == i) {
            inst.inputDiv[0].focus();            
            inst.focusInput = $(inst.inputDiv[0]);
        } else {
            inst.inputDiv[i+1].focus();
            inst.focusInput = $(inst.inputDiv[i+1]);
        }
    },
    /* Action for selecting a day. */
    _selectDay: function(id, month, year, td) {
        var inst,
            target = $(id);
        if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
            return;
        }
        inst = this._getInst(target[0]);
        inst.selectedDay = inst.currentDay = $("a", td).html();
        instActive.dpDiv.find(".ui-datepicker-current-day").removeClass("ui-datepicker-current-day").addClass("tiny-ui-state-default");
        $("a", td).removeClass("tiny-ui-state-default").addClass("ui-datepicker-current-day");
        inst.selectedMonth = inst.currentMonth = month;
        inst.selectedYear = inst.currentYear = year;
        this._selectDate(id, this._formatDate(inst,
            inst.currentDay, inst.currentMonth, inst.currentYear));
    },

    /* Erase the input field and hide the date picker. */
    _clearDate: function(id) {
        var target = $(id);
        this._selectDate(target, "");
    },

    /* Update the input field with the selected date. */
    _selectDate: function(id, dateStr) {
        var onSelect,
            target = $(id),
            inst = this._getInst(target[0]);
        var onSelectTime,
        dateStr = (dateStr != null ? dateStr : this._formatDate(inst)),
        onSelect = this._get(inst, "onSelect");
        if (onSelect) {
            onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
        } else if (inst.input) {
            inst.input.trigger("change"); // fire the change event
        }
        if (inst.input) {
            if(this._get(inst, 'isTimeVisible')){
                if(!inst.editorValue) {
                    this._conformTime(id);
                }
                inst.dateStr = dateStr;
                inst.input[0].dateStr = dateStr;
                var time = inst.editorValue;
                inst.input.val(dateStr+" "+time);
                //限制时间日期范围
                if(inst.input[0].minMaxDate === dateStr) {
                	this._restrictDateTime(inst);
                }
            }
            else{
                inst.input.val(dateStr);
            }            
        }
        this._updateAlternate(inst);

        if (inst.inline){
            this._updateDatepicker(inst);
        } else {
            if(!this._get(inst, 'isTimeVisible')){
                this._hideDatepicker();
            }
            this._lastInput = inst.input[0];
            if (typeof(inst.input[0]) !== "object") {
                inst.input.focus(); // restore focus
            }
            this._lastInput = null;
        }
    },
    
    _restrictDateTime : function(inst) {
        var onDateTimeRestict = this._get(inst, "onDateTimeRestict");
        if (onDateTimeRestict) {
            onDateTimeRestict.apply((inst.input ? inst.input[0] : null), []);  // trigger custom callback
        }
        this._setTimeEditorValue(inst);
    },
    
    /* Update any alternate field to synchronise with the main field. */
    _updateAlternate: function(inst) {
        var altFormat, date, dateStr,
            altField = this._get(inst, "altField");

        if (altField) { // update alternate field too
            altFormat = this._get(inst, "altFormat") || this._get(inst, "dateFormat");
            date = this._getDate(inst);
            dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
            $(altField).each(function() { $(this).val(dateStr); });
        }
    },

    /* Set as beforeShowDay function to prevent selection of weekends.
     * @param  date  Date - the date to customise
     * @return [boolean, string] - is this date selectable?, what is its CSS class?
     */
    noWeekends: function(date) {
        var day = date.getDay();
        return [(day > 0 && day < 6), ""];
    },

    /* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
     * @param  date  Date - the date to get the week for
     * @return  number - the number of the week within the year that contains this date
     */
    iso8601Week: function(date) {
        var time,
            checkDate = new Date(date.getTime());

        // Find Thursday of this week starting on Monday
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

        time = checkDate.getTime();
        checkDate.setMonth(0); // Compare with Jan 1
        checkDate.setDate(1);
        return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
    },

    /* Parse a string value into a date object.
     * See formatDate below for the possible formats.
     *
     * @param  format string - the expected format of the date
     * @param  value string - the date in the above format
     * @param  settings Object - attributes include:
     *                    shortYearCutoff  number - the cutoff year for determining the century (optional)
     *                    dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
     *                    dayNames        string[7] - names of the days from Sunday (optional)
     *                    monthNamesShort string[12] - abbreviated names of the months (optional)
     *                    monthNames        string[12] - names of the months (optional)
     * @return  Date - the extracted date value or null if value is blank
     */
    parseDate: function (format, value, settings) {
        if (format == null || value == null) {
            throw "Invalid arguments";
        }

        value = (typeof value === "object" ? value.toString() : value + "");
        if (value === "") {
            return null;
        }

        var iFormat, dim, extra,
            iValue = 0,
            shortYearCutoffTemp = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff,
            shortYearCutoff = (typeof shortYearCutoffTemp !== "string" ? shortYearCutoffTemp :
                new Date().getFullYear() % 100 + parseInt(shortYearCutoffTemp, 10)),
            dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
            dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
            monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
            monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
            year = -1,
            month = -1,
            day = -1,
            doy = -1,
            literal = false,
            date,
            // Check whether a format character is doubled
            lookAhead = function(match) {
                var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                if (matches) {
                    iFormat++;
                }
                return matches;
            },
            // Extract a number from the string value
            getNumber = function(match) {
                var isDoubled = lookAhead(match),
                    size = (match === "@" ? 14 : (match === "!" ? 20 :
                    (match === "y" && isDoubled ? 4 : (match === "o" ? 3 : 2)))),
                    digits = new RegExp("^\\d{1," + size + "}"),
                    num = value.substring(iValue).match(digits);
                if (!num) {
                    throw "Missing number at position " + iValue;
                }
                iValue += num[0].length;
                return parseInt(num[0], 10);
            },
            // Extract a name from the string value and convert to an index
            getName = function(match, shortNames, longNames) {
                var index = -1,
                    names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
                        return [ [k, v] ];
                    }).sort(function (a, b) {
                        return -(a[1].length - b[1].length);
                    });

                $.each(names, function (i, pair) {
                    var name = pair[1];
                    if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
                        index = pair[0];
                        iValue += name.length;
                        return false;
                    }
                });
                if (index !== -1) {
                    return index + 1;
                } else {
                    throw "Unknown name at position " + iValue;
                }
            },
            // Confirm that a literal character matches the string value
            checkLiteral = function() {
                if (value.charAt(iValue) !== format.charAt(iFormat)) {
                    throw "Unexpected literal at position " + iValue;
                }
                iValue++;
            };

        for (iFormat = 0; iFormat < format.length; iFormat++) {
            if (literal) {
                if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                    literal = false;
                } else {
                    checkLiteral();
                }
            } else {
                switch (format.charAt(iFormat)) {
                    case "d":
                        day = getNumber("d");
                        break;
                    case "D":
                        getName("D", dayNamesShort, dayNames);
                        break;
                    case "o":
                        doy = getNumber("o");
                        break;
                    case "m":
                        month = getNumber("m");
                        break;
                    case "M":
                        month = getName("M", monthNamesShort, monthNames);
                        break;
                    case "y":
                        year = getNumber("y");
                        break;
                    case "@":
                        date = new Date(getNumber("@"));
                        year = date.getFullYear();
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        break;
                    case "!":
                        date = new Date((getNumber("!") - this._ticksTo1970) / 10000);
                        year = date.getFullYear();
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        break;
                    case "'":
                        if (lookAhead("'")){
                            checkLiteral();
                        } else {
                            literal = true;
                        }
                        break;
                    default:
                        checkLiteral();
                }
            }
        }

        if (iValue < value.length){
            extra = value.substr(iValue);
            if (!/^\s+/.test(extra)) {
                throw "Extra/unparsed characters found in date: " + extra;
            }
        }

        if (year === -1) {
            year = new Date().getFullYear();
        } else if (year < 100) {
            year += new Date().getFullYear() - new Date().getFullYear() % 100 +
                (year <= shortYearCutoff ? 0 : -100);
        }

        if (doy > -1) {
            month = 1;
            day = doy;
            do {
                dim = this._getDaysInMonth(year, month - 1);
                if (day <= dim) {
                    break;
                }
                month++;
                day -= dim;
            } while (true);
        }

        date = this._daylightSavingAdjust(new Date(year, month - 1, day));
        if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
            throw "Invalid date"; // E.g. 31/02/00
        }
        return date;
    },

    /* Standard date formats. */
    ATOM: "yy-mm-dd", // RFC 3339 (ISO 8601)
    COOKIE: "D, dd M yy",
    ISO_8601: "yy-mm-dd",
    RFC_822: "D, d M y",
    RFC_850: "DD, dd-M-y",
    RFC_1036: "D, d M y",
    RFC_1123: "D, d M yy",
    RFC_2822: "D, d M yy",
    RSS: "D, d M y", // RFC 822
    TICKS: "!",
    TIMESTAMP: "@",
    W3C: "yy-mm-dd", // ISO 8601

    _ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
        Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),

    /* Format a date object into a string value.
     * The format can be combinations of the following:
     * d  - day of month (no leading zero)
     * dd - day of month (two digit)
     * o  - day of year (no leading zeros)
     * oo - day of year (three digit)
     * D  - day name short
     * DD - day name long
     * m  - month of year (no leading zero)
     * mm - month of year (two digit)
     * M  - month name short
     * MM - month name long
     * y  - year (two digit)
     * yy - year (four digit)
     * @ - Unix timestamp (ms since 01/01/1970)
     * ! - Windows ticks (100ns since 01/01/0001)
     * "..." - literal text
     * '' - single quote
     *
     * @param  format string - the desired format of the date
     * @param  date Date - the date value to format
     * @param  settings Object - attributes include:
     *                    dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
     *                    dayNames        string[7] - names of the days from Sunday (optional)
     *                    monthNamesShort string[12] - abbreviated names of the months (optional)
     *                    monthNames        string[12] - names of the months (optional)
     * @return  string - the date in the above format
     */
    formatDate: function (format, date, settings) {
        if (!date) {
            return "";
        }

        var iFormat,
            dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
            dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
            monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
            monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
            // Check whether a format character is doubled
            lookAhead = function(match) {
                var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                if (matches) {
                    iFormat++;
                }
                return matches;
            },
            // Format a number, with leading zero if necessary
            formatNumber = function(match, value, len) {
                var num = "" + value;
                if (lookAhead(match)) {
                    while (num.length < len) {
                        num = "0" + num;
                    }
                }
                return num;
            },
            // Format a name, short or long as requested
            formatName = function(match, value, shortNames, longNames) {
                return (lookAhead(match) ? longNames[value] : shortNames[value]);
            },
            output = "",
            literal = false;

        if (date) {
            for (iFormat = 0; iFormat < format.length; iFormat++) {
                if (literal) {
                    if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                        literal = false;
                    } else {
                        output += format.charAt(iFormat);
                    }
                } else {
                    switch (format.charAt(iFormat)) {
                        case "d":
                            output += formatNumber("d", date.getDate(), 2);
                            break;
                        case "D":
                            output += formatName("D", date.getDay(), dayNamesShort, dayNames);
                            break;
                        case "o":
                            output += formatNumber("o",
                                Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
                            break;
                        case "m":
                            output += formatNumber("m", date.getMonth() + 1, 2);
                            break;
                        case "M":
                            output += formatName("M", date.getMonth(), monthNamesShort, monthNames);
                            break;
                        case "y":
                            output += (lookAhead("y") ? date.getFullYear() :
                                (date.getYear() % 100 < 10 ? "0" : "") + date.getYear() % 100);
                            break;
                        case "@":
                            output += date.getTime();
                            break;
                        case "!":
                            output += date.getTime() * 10000 + this._ticksTo1970;
                            break;
                        case "'":
                            if (lookAhead("'")) {
                                output += "'";
                            } else {
                                literal = true;
                            }
                            break;
                        default:
                            output += format.charAt(iFormat);
                    }
                }
            }
        }
        return output;
    },

    /* Extract all possible characters from the date format. */
    _possibleChars: function (format) {
        var iFormat,
            chars = "",
            literal = false,
            // Check whether a format character is doubled
            lookAhead = function(match) {
                var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                if (matches) {
                    iFormat++;
                }
                return matches;
            };

        for (iFormat = 0; iFormat < format.length; iFormat++) {
            if (literal) {
                if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                    literal = false;
                } else {
                    chars += format.charAt(iFormat);
                }
            } else {
                switch (format.charAt(iFormat)) {
                    case "d": case "m": case "y": case "@":
                        chars += "0123456789";
                        break;
                    case "D": case "M":
                        return null; // Accept anything
                    case "'":
                        if (lookAhead("'")) {
                            chars += "'";
                        } else {
                            literal = true;
                        }
                        break;
                    default:
                        chars += format.charAt(iFormat);
                }
            }
        }
        return chars;
    },

    /* Get a setting value, defaulting if necessary. */
    _get: function(inst, name) {
        return inst.settings[name] !== undefined ?
            inst.settings[name] : this._defaults[name];
    },

    /* Parse existing date and initialise date picker. */
    _setDateFromField: function(inst, noDefault) {
        if (inst.input.val() === inst.lastVal) {
            return;
        }

        var dateFormat = this._get(inst, "dateFormat"),
            dates = inst.lastVal = inst.input ? inst.input.val() : null,
            defaultDate = this._getDefaultDate(inst),
            date = defaultDate,
            settings = this._getFormatConfig(inst);

        try {
            date = this.parseDate(dateFormat, dates, settings) || defaultDate;
        } catch (event) {
            dates = (noDefault ? "" : dates);
        }
        inst.selectedDay = date.getDate();
        inst.drawMonth = inst.selectedMonth = date.getMonth();
        inst.drawYear = inst.selectedYear = date.getFullYear();
        inst.currentDay = (dates ? date.getDate() : 0);
        inst.currentMonth = (dates ? date.getMonth() : 0);
        inst.currentYear = (dates ? date.getFullYear() : 0);
        this._adjustInstDate(inst);
    },

    /* Retrieve the default date shown on opening. */
    _getDefaultDate: function(inst) {
        return this._restrictMinMax(inst,
            this._determineDate(inst, this._get(inst, "defaultDate"), new Date()));
    },

    /* A date may be specified as an exact value or a relative one. */
    _determineDate: function(inst, date, defaultDate) {
        var offsetNumeric = function(offset) {
                var date = new Date();
                date.setDate(date.getDate() + offset);
                return date;
            },
            offsetString = function(offset) {
                try {
                    return $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
                        offset, $.datepicker._getFormatConfig(inst));
                }
                catch (e) {
                    // Ignore
                }

                var date = (offset.toLowerCase().match(/^c/) ?
                    $.datepicker._getDate(inst) : null) || new Date(),
                    year = date.getFullYear(),
                    month = date.getMonth(),
                    day = date.getDate(),
                    pattern = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
                    matches = pattern.exec(offset);

                while (matches) {
                    switch (matches[2] || "d") {
                        case "d" : case "D" :
                            day += parseInt(matches[1],10); break;
                        case "w" : case "W" :
                            day += parseInt(matches[1],10) * 7; break;
                        case "m" : case "M" :
                            month += parseInt(matches[1],10);
                            day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
                            break;
                        case "y": case "Y" :
                            year += parseInt(matches[1],10);
                            day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
                            break;
                    }
                    matches = pattern.exec(offset);
                }
                return new Date(year, month, day);
            },
            newDate = (date == null || date === "" ? defaultDate : (typeof date === "string" ? offsetString(date) :
                (typeof date === "number" ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));

        newDate = (newDate && newDate.toString() === "Invalid Date" ? defaultDate : newDate);
        if (newDate) {
            newDate.setHours(0);
            newDate.setMinutes(0);
            newDate.setSeconds(0);
            newDate.setMilliseconds(0);
        }
        return this._daylightSavingAdjust(newDate);
    },

    /* Handle switch to/from daylight saving.
     * Hours may be non-zero on daylight saving cut-over:
     * > 12 when midnight changeover, but then cannot generate
     * midnight datetime, so jump to 1AM, otherwise reset.
     * @param  date  (Date) the date to check
     * @return  (Date) the corrected date
     */
    _daylightSavingAdjust: function(date) {
        if (!date) {
            return null;
        }
        date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
        return date;
    },

    /* Set the date(s) directly. */
    _setDate: function(inst, date, noChange) {
        var clear = !date,
            origMonth = inst.selectedMonth,
            origYear = inst.selectedYear,
            newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));

        inst.selectedDay = inst.currentDay = newDate.getDate();
        inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
        inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
        if ((origMonth !== inst.selectedMonth || origYear !== inst.selectedYear) && !noChange) {
            this._notifyChange(inst);
        }
        this._adjustInstDate(inst);
        if (!this._get(inst, "isTimeVisible")) {
            inst.input.val(clear ? "" : this._formatDate(inst));
        }
    },

    /* Retrieve the date(s) directly. */
    _getDate: function(inst) {
        var startDate = (!inst.currentYear || (inst.input && inst.input.val() === "") ? null :
            this._daylightSavingAdjust(new Date(
            inst.currentYear, inst.currentMonth, inst.currentDay)));
            return startDate;
    },

    /* Attach the onxxx handlers.  These are declared statically so
     * they work with static code transformers like Caja.
     */
    _attachHandlers: function(inst) {
        var stepMonths = this._get(inst, "stepMonths"),
            id = "#" + inst.id.replace( /\\\\/g, "\\" );
        inst.dpDiv.find("[data-handler]").map(function () {
            var handler = {
                prev: function () {
                    $.datepicker._adjustDate(id, -stepMonths, "M");
                },
                next: function () {
                    $.datepicker._adjustDate(id, +stepMonths, "M");
                },
                hide: function () {
                    $.datepicker._hideDatepicker();
                },
                today: function () {
                    $.datepicker._gotoToday(id);
                },
                selectDay: function () {
                    $.datepicker._selectDay(id, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this);
                    return false;
                },
                selectMonth: function () {
                    $.datepicker._selectMonthYear(id, this, "M");
                    return false;
                },
                selectYear: function () {
                    $.datepicker._selectMonthYear(id, this, "Y");
                    return false;
                }
            };
            $(this).bind(this.getAttribute("data-event"), handler[this.getAttribute("data-handler")]);
        });
    },

    /* Generate the HTML for the current state of the date picker. */
    _generateHTML: function(inst) {
        var maxDraw, prevText, prev, nextText, next, currentText, gotoDate,
            controls, buttonPanel, firstDay, showWeek, dayNames, dayNamesMin,
            monthNames, monthNamesShort, beforeShowDay, showOtherMonths,
            selectOtherMonths, defaultDate, html, dow, row, group, col, selectedDate,
            cornerClass, calender, thead, day, daysInMonth, leadDays, curRows, numRows,
            printDate, dRow, tbody, daySettings, otherMonth, unselectable,
            tempDate = new Date(),
            today = this._daylightSavingAdjust(
                new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate())), // clear time
            isRTL = this._get(inst, "isRTL"),
            showButtonPanel = this._get(inst, "showButtonPanel"),
            hideIfNoPrevNext = this._get(inst, "hideIfNoPrevNext"),
            navigationAsDateFormat = this._get(inst, "navigationAsDateFormat"),
            numMonths = this._getNumberOfMonths(inst),
            showCurrentAtPos = this._get(inst, "showCurrentAtPos"),
            stepMonths = this._get(inst, "stepMonths"),
            isMultiMonth = (numMonths[0] !== 1 || numMonths[1] !== 1),
            currentDateSelect = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
                new Date(inst.currentYear, inst.currentMonth, inst.currentDay))),
            defaultDate = this._getDefaultDate(inst);
            if(9999 == currentDateSelect.getFullYear()){
                currentDate = defaultDate;
            }else{
                currentDate = currentDateSelect;
            }
            minDate = this._getMinMaxDate(inst, "min"),
            maxDate = this._getMinMaxDate(inst, "max"),
            drawMonth = inst.drawMonth - showCurrentAtPos,
            drawYear = inst.drawYear;

        if (drawMonth < 0) {
            drawMonth += 12;
            drawYear--;
        }
        if (maxDate) {
            maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
                maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
            maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
            while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
                drawMonth--;
                if (drawMonth < 0) {
                    drawMonth = 11;
                    drawYear--;
                }
            }
        }
        inst.drawMonth = drawMonth;
        inst.drawYear = drawYear;

        prevText = this._get(inst, "prevText");
        prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
            this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
            this._getFormatConfig(inst)));

        prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
            "<a class='ui-datepicker-prev ui-corner-all' onclick='DP_jQuery_" + dpuuid +
             ".datepicker._adjustDate(\"#" + inst.id + "\", -" + stepMonths + ", \"M\");'" +
            " title='" + prevText + "'><span class='ui-icon tiny-datepicker-icon-" + ( isRTL ? "next" : "prev") + "'></span></a>" :
            (hideIfNoPrevNext ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+ prevText +"'><span class='ui-icon tiny-datepicker-icon-" + ( isRTL ? "next" : "prev") + "'></span></a>"));

        nextText = this._get(inst, "nextText");
        nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
            this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
            this._getFormatConfig(inst)));

        next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
            "<a class='ui-datepicker-next ui-corner-all' onclick='DP_jQuery_" + dpuuid +
             ".datepicker._adjustDate(\"#" + inst.id + "\", +" + stepMonths + ", \"M\");'"  +
            " title='" + nextText + "'><span class='ui-icon tiny-datepicker-icon-" + ( isRTL ? "prev" : "next") + "'></span></a>" :
            (hideIfNoPrevNext ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+ nextText + "'><span class='ui-icon tiny-datepicker-icon-" + ( isRTL ? "prev" : "next") + "'></span></a>"));

        currentText = this._get(inst, "currentText");
        gotoDate = (this._get(inst, "gotoCurrent") && inst.currentDay ? currentDate : today);
        inst.defalultstr = this._formatDate(inst, currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear());
        currentText = (!navigationAsDateFormat ? currentText :
            this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));

        controls = (!inst.inline ? "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" +
            this._get(inst, "closeText") + "</button>" : "");

        buttonPanel = (showButtonPanel) ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (isRTL ? controls : "") +
            (this._isInRange(inst, gotoDate) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'" +
            ">" + currentText + "</button>" : "") + (isRTL ? "" : controls) + "</div>" : "";

        firstDay = parseInt(this._get(inst, "firstDay"),10);
        firstDay = (isNaN(firstDay) ? 0 : firstDay);

        showWeek = this._get(inst, "showWeek");
        dayNames = this._get(inst, "dayNames");
        dayNamesMin = this._get(inst, "dayNamesMin");
        monthNames = this._get(inst, "monthNames");
        monthNamesShort = this._get(inst, "monthNamesShort");
        beforeShowDay = this._get(inst, "beforeShowDay");
        showOtherMonths = this._get(inst, "showOtherMonths");
        selectOtherMonths = this._get(inst, "selectOtherMonths");        
        html = "";
        dow;
        for (row = 0; row < numMonths[0]; row++) {
            group = "";
            this.maxRows = 4;
            for (col = 0; col < numMonths[1]; col++) {
                selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
                cornerClass = " ui-corner-all";
                calender = "";
                if (isMultiMonth) {
                    calender += "<div class='ui-datepicker-group";
                    if (numMonths[1] > 1) {
                        switch (col) {
                            case 0: calender += " ui-datepicker-group-first";
                                cornerClass = " ui-corner-" + (isRTL ? "right" : "left"); break;
                            case numMonths[1]-1: calender += " ui-datepicker-group-last";
                                cornerClass = " ui-corner-" + (isRTL ? "left" : "right"); break;
                            default: calender += " ui-datepicker-group-middle"; cornerClass = ""; break;
                        }
                    }
                    calender += "'>";
                }
                calender += "<div class='ui-datepicker-header tiny-ui-widget-header ui-helper-clearfix" + cornerClass + "'>" +
                    (/all|left/.test(cornerClass) && row === 0 ? (isRTL ? next : prev) : "") +
                    (/all|right/.test(cornerClass) && row === 0 ? (isRTL ? prev : next) : "") +
                    this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
                    row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
                    "</div><table class='tiny-ui-datepicker-calendar'><thead>" +
                    "<tr>";
                thead = (showWeek ? "<th class='ui-datepicker-week-col'>" + this._get(inst, "weekHeader") + "</th>" : "");
                for (dow = 0; dow < 7; dow++) { // days of the week
                    day = (dow + firstDay) % 7;
                    thead += "<th" + ((dow + firstDay + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" +
                        "<span title='" + dayNames[day] + "'>" + dayNamesMin[day] + "</span></th>";
                }
                calender += thead + "</tr></thead><tbody>";
                daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
                if (drawYear === inst.selectedYear && drawMonth === inst.selectedMonth) {
                    inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
                }
                leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
                curRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
                numRows = (isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows); //If multiple months, use the higher number of rows (see #7043)
                this.maxRows = numRows;
                printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
                for (dRow = 0; dRow < numRows; dRow++) { // create date picker rows
                    calender += "<tr>";
                    tbody = (!showWeek ? "" : "<td class='ui-datepicker-week-col'>" +
                        this._get(inst, "calculateWeek")(printDate) + "</td>");
                    for (dow = 0; dow < 7; dow++) { // create date picker days
                        daySettings = (beforeShowDay ?
                            beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, ""]);
                        otherMonth = (printDate.getMonth() !== drawMonth);
                        unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] ||
                            (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
                        tbody += "<td class='" +
                            ((dow + firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + // highlight weekends
                            (otherMonth ? " ui-datepicker-other-month  tiny-ui-state-disabled" : "") + // highlight days from other months
                            ((printDate.getTime() === selectedDate.getTime() && drawMonth === inst.selectedMonth && inst._keyEvent) || // user pressed key
                            (defaultDate.getTime() === printDate.getTime() && defaultDate.getTime() === selectedDate.getTime()) ?
                            // or defaultDate is current printedDate and defaultDate is selectedDate
                            " " + this._dayOverClass : "") + // highlight selected day
                            (unselectable ? " " + this._unselectableClass + " ui-state-disabled": "") +  // highlight unselectable days
                            (otherMonth && !showOtherMonths ? "" : " " + daySettings[1] + // highlight custom dates
                            (printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")) + "'" + // highlight today (if different)
                            ((!otherMonth || showOtherMonths) && daySettings[2] ? " title='" + daySettings[2].replace(/'/g, "&#39;") + "'" : "") + // cell title
                            (unselectable ? "" : ' onclick="DP_jQuery_' + dpuuid + '.datepicker._selectDay(\'#' +
                               inst.id + '\',' + printDate.getMonth() + ',' + printDate.getFullYear() + ', this);return false;"') + '>' + // actions
                            (otherMonth && !showOtherMonths ? "&#xa0;" : // display for other months
                            (unselectable ? "<span class='tiny-ui-state-default'>" + printDate.getDate() + 
                            "</span>" : "<a class='" + (printDate.getTime() == currentDate.getTime() ? this._currentClass : "tiny-ui-state-default")  +
                            (printDate.getTime() == today.getTime() ? ' tiny-ui-state-highlight' : '') +
                             // highlight selected day
                            (otherMonth ? " ui-priority-secondary" : "") + // distinguish dates from other months
                            "' href='#' draggable='false'>" + printDate.getDate() + "</a>")) + "</td>"; // display selectable date
                        printDate.setDate(printDate.getDate() + 1);
                        printDate = this._daylightSavingAdjust(printDate);
                    }
                    calender += tbody + "</tr>";
                }

                drawMonth++;
                if (drawMonth > 11) {
                    drawMonth = 0;
                    drawYear++;
                }
                calender += "</tbody></table>" + (isMultiMonth ? "</div>" +
                            ((numMonths[0] > 0 && col === numMonths[1]-1) ? "<div class='ui-datepicker-row-break'></div>" : "") : "");
                group += calender;
            }
            html += group;
        }
        html += buttonPanel;
        if(this._get(inst, 'isTimeVisible')){
            var timeEditorHtml = this._generateTimeEditor(inst);
            html += 
            '<div class = "tiny-datetime-time">'+
            '<div class="tiny-time-container">'+
            '<div class="tiny-time-editor">'+
             timeEditorHtml+
             '</div>'+
             '<div id="time_button_up" class="tiny-time-upbtn tiny-time-updownbutt-style" onclick="DP_jQuery_' + dpuuid +'.datepicker._selectTime(\'#' +
                               inst.id + '\',1)"></div>'+
             '<div id="time_button_down" class="tiny-time-downbtn tiny-time-updownbutt-style" onclick="DP_jQuery_' + dpuuid +'.datepicker._selectTime(\'#' +
                               inst.id + '\',0)"></div>'+
             '</div>';
	     if(this._get(inst, 'showClear')){
              html +=  '<a href="javascript:void(0)" class="tiny-button-buttonClass tiny-button-buttonDefault" onclick="DP_jQuery_' + dpuuid +'.datepicker._clearTime(\'#' +
		 		 		 	inst.id + '\')">'
		      +'<div class="tiny-time-clearbutton tiny-button tiny-button-buttonInnerClass">'
		      +'<div class="tiny-right">'
		      +'<div class= "tiny-center"><div class="tiny-leftImg" style="display: none;"></div><span class="tiny-button-buttonCenterText">Clear</span><div class="tiny-rightImg" style="display: none;"></div></div></div></div></a>'
          }
              html += '<a href="javascript:void(0)" class="tiny-button-buttonClass tiny-button-buttonDefault" onclick="DP_jQuery_' + dpuuid +'.datepicker._selectTime(\'#' +
                            inst.id + '\',2)">'
              +'<div class="tiny-time-okbutton tiny-button tiny-button-buttonInnerClass">'
              +'<div class="tiny-right">'
              +'<div class= "tiny-center"><div class="tiny-leftImg" style="display: none;"></div><span class="tiny-button-buttonCenterText">OK</span><div class="tiny-rightImg" style="display: none;"></div></div></div></div></a>'
		  +'</div>'
        }
        inst._keyEvent = false;
        return html;
    },
    
    /* Generate the time editor. */
    _generateTimeEditor : function(inst) {
        var octets = [];   
        var maxHour = 23, timeAMPM = false;
        
        //获取已选时间值,并记录
        inst.dateStr = this._formatDate(inst);
        inst.input[0].dateStr = inst.dateStr;
            if(this._get(inst, "ampm")) {
                maxHour = 12;
                timeAMPM = true;
            }
            var TimeFormatArray = this._get(inst, "timeFormatArray");
            var timeEditorHtml = "";
            var inputStr = inst.input[0].value;
            
            //如果输入框中有内容,取其时间值,进行设置
            if(inputStr) {    
                inst.editorValue = inst.input[0].timeValue;
                var timeAMPMArray = (inst.editorValue+"" || "").split(" ");
                if(timeAMPM){
                    inst.AMPM = timeAMPMArray[1];
                }
                var timeArray = timeAMPMArray[0].split(":");
                var timeArrayLength = timeArray.length;
                for(var i = 0; i < timeArrayLength; i++) {
                    switch(i) {
                        case 0 : 
                            inst.HOURS = timeArray[0];
                            break;
                        case 1 : 
                            inst.MINU = timeArray[1];
                            break;
                        case 2 : 
                            inst.SECS = timeArray[2];
                            break;
                        case 3 : 
                            inst.MSECS = timeArray[1];
                            break;  
                        default:
                            break;  
                    }
                }
            }             
            
            //如果输入框中无内容,1.判断是否有最大最小值的临界点;2.如果有,选择的该日期是否是临界日期;3.如果是,进行处理
            else {
                if((inst.input[0].minMaxDate === inst.dateStr)) {
                    
                    //当前显示值获取
                    var currDateTime = new Date(inst.dateStr +" "+ (this._get(inst, "defaultTimeValue")).toTimeString());
                    
                    //如果设置了最大值,并且该值大于最大值
                    if(inst.input[0].maxDateTime && (currDateTime > inst.input[0].maxDateTime)) {
                        inst.HOURS = inst.input[0].MAXHOURS;
                        inst.MINU = inst.input[0].MAXMINU;
                        inst.SECS = inst.input[0].MAXSECS;
                        inst.MSECS = inst.input[0].MAXMSECS;
                        inst.AMPM = inst.input[0].MAXAMPM;
                    }
                    
                    //如果设置了最小值,并且该值小于最小值
                    if(inst.input[0].minDateTime && (currDateTime < inst.input[0].minDateTime)) {
                        inst.HOURS = inst.input[0].MINHOURS;
                        inst.MINU = inst.input[0].MINMINU;
                        inst.SECS = inst.input[0].MINSECS;
                        inst.MSECS = inst.input[0].MINMSECS;
                        inst.AMPM = inst.input[0].MINAMPM;
                    }
                };
            }
            
            //小时 HH
            if( 2 == TimeFormatArray[0].length ) {
                if(void 0 === inst.HOURS){
                    inst.HOURS = this._get(inst, "HOURS");
                }
                
                //先转换 去掉"0**"的情况
                inst.HOURS = parseInt(inst.HOURS, 10);
                inst.HOURS = inst.HOURS < 10 ? ("0" + inst.HOURS) : inst.HOURS;
                octets.push('<input type="text" maxlength = "2" class="tiny-time-input" format = "HH" maxNum = "' + maxHour + '" value="' + inst.HOURS + '" onfocus = "DP_jQuery_' 
                + dpuuid +'.datepicker._timeFocusEvt(\'#' +
                               inst.id + '\',event)"  onkeydown = "DP_jQuery_' 
                + dpuuid +'.datepicker._timeKeydownEvt(\'#' +
                               inst.id + '\',event)" onblur = "DP_jQuery_' + dpuuid +'.datepicker._timeblurEvt(\'#' +
                               inst.id + '\',event)"/>')
            }
            //小时 H
            if( 1 == TimeFormatArray[0].length ) {
                if(void 0 === inst.HOURS){
                    inst.HOURS = this._get(inst, "HOURS");
                }
                
                //先转换 去掉"0**"的情况
                inst.HOURS = parseInt(inst.HOURS, 10);
                octets.push('<input type="text" maxlength = "2" class="tiny-time-input" format = "H" maxNum = "' + maxHour + '" value="' + inst.HOURS + '"onfocus = "DP_jQuery_' 
                + dpuuid +'.datepicker._timeFocusEvt(\'#' +
                               inst.id + '\',event)"  onkeydown = "DP_jQuery_' 
                + dpuuid +'.datepicker._timeKeydownEvt(\'#' +
                               inst.id + '\',event)" onblur = "DP_jQuery_' + dpuuid +'.datepicker._timeblurEvt(\'#' +
                               inst.id + '\',event)"/>')
            }
            //分钟 MM
            if( (TimeFormatArray.length >= 2) && (2 == TimeFormatArray[1].length) ) {
                if(void 0 === inst.MINU){
                    inst.MINU = this._get(inst, "MINU");
                }
                
                //先转换 去掉"0**"的情况
                inst.MINU = parseInt(inst.MINU, 10);
                inst.MINU = inst.MINU < 10 ? ("0" + inst.MINU) : inst.MINU;
                octets.push('<input type="text" maxlength = "2" class="tiny-time-input" format = "MM" maxNum = "59" value="' + inst.MINU + '"onfocus = "DP_jQuery_' 
                + dpuuid +'.datepicker._timeFocusEvt(\'#' +
                               inst.id + '\',event)"  onkeydown = "DP_jQuery_' 
                + dpuuid +'.datepicker._timeKeydownEvt(\'#' +
                               inst.id + '\',event)" onblur = "DP_jQuery_' + dpuuid +'.datepicker._timeblurEvt(\'#' +
                               inst.id + '\',event)"/>')
            }
            //秒 SS
            if( (TimeFormatArray.length >= 3 ) && ( 2 == TimeFormatArray[2].length )) {
                if(void 0 === inst.SECS){
                    inst.SECS = this._get(inst, "SECS");
                }
                
                //先转换 去掉"0**"的情况
                inst.SECS = parseInt(inst.SECS, 10);
                inst.SECS = inst.SECS < 10 ? ("0" + inst.SECS) : inst.SECS;
                octets.push('<input type="text" maxlength = "2" class="tiny-time-input" format = "SS" maxNum = "59" value="' + inst.SECS + '"onfocus = "DP_jQuery_' 
                + dpuuid +'.datepicker._timeFocusEvt(\'#' +
                               inst.id + '\',event)"  onkeydown = "DP_jQuery_' 
                + dpuuid +'.datepicker._timeKeydownEvt(\'#' +
                               inst.id + '\',event)" onblur = "DP_jQuery_' + dpuuid +'.datepicker._timeblurEvt(\'#' +
                               inst.id + '\',event)"/>')
            }
            //微秒 MS
            if( 4 == TimeFormatArray.length ) {
                if(void 0 === inst.MSECS){
                    inst.MSECS = this._get(inst, "MSECS");
                }
                
                //先转换 去掉"0**"的情况
                inst.MSECS = parseInt(inst.MSECS, 10);
                inst.MSECS = inst.MSECS < 10 ? ("00" + inst.MSECS) : inst.MSECS;
                octets.push('<input type="text" maxlength = "3" class="tiny-time-input" format = "SSS" maxNum = "999" value="' + inst.MSECS + '"onfocus = "DP_jQuery_' 
                + dpuuid +'.datepicker._timeFocusEvt(\'#' +
                               inst.id + '\',event)"  onkeydown = "DP_jQuery_' 
                + dpuuid +'.datepicker._timeKeydownEvt(\'#' +
                               inst.id + '\',event)" onblur = "DP_jQuery_' + dpuuid +'.datepicker._timeblurEvt(\'#' +
                               inst.id + '\',event)"/>')
            }
            timeEditorHtml = octets.join(':');
            if(this._get(inst, "ampm")) {
                if(void 0 === inst.AMPM){
                    inst.AMPM = this._get(inst, "AMPM");
                }
                timeEditorHtml = '<div>'+timeEditorHtml
                +'<input type="text" class="tiny-time-input" format = "AMPM" maxNum = "PM" value="' + inst.AMPM + '"onfocus = "DP_jQuery_' 
                + dpuuid +'.datepicker._timeFocusEvt(\'#' +
                               inst.id + '\',event)"  onkeydown = "DP_jQuery_' 
                + dpuuid +'.datepicker._timeKeydownEvt(\'#' +
                               inst.id + '\',event)" onblur = "DP_jQuery_' + dpuuid +'.datepicker._timeblurEvt(\'#' +
                               inst.id + '\',event)"/></div>'
            } else {
                timeEditorHtml = '<div>' +timeEditorHtml +'</div>'
            }
            return timeEditorHtml;
    },
    
    /* Generate the month and year header. */
    _generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate,
            secondary, monthNames, monthNamesShort) {
        var changeMonth = this._get(inst, 'changeMonth');
        var changeYear = this._get(inst, 'changeYear');
        var showMonthAfterYear = this._get(inst, 'showMonthAfterYear');
        var html = '<div class="ui-datepicker-title" style="float:center">';
        var monthHtml = '';
        var yearMonthData = $('<div>');
        yearMonthData.css({"border":"1px solid gray", "width":"170px"});
        var monthList,addedMonths = 0;
        
        if (secondary || !changeMonth)
        {
            monthHtml += '<span class="ui-datepicker-month">' + monthNames[drawMonth] + '</span>';
        }
        else
        {
            var inMinYear = (minDate && minDate.getFullYear() == drawYear);
            var inMaxYear = (maxDate && maxDate.getFullYear() == drawYear);
            var monthDiv = $('<div>');
            var monthData = '<input type="text" readonly="readonly" value="' + monthNames[drawMonth] + '" style="width:30px; outline:none; border:1px solid #ffffff;" class="ui-datepicker-month" ' +
                            'onchange="DP_jQuery_' + dpuuid + '.datepicker._selectMonthYear(\'#' + inst.id + '\', this, \'M\');" ' +
                            '>';
            monthDiv[0].innerHTML = monthData;                    
            monthList = $('<div class="tiny_Date_Select_Month">');
            
             for (var month = 0; month < 12; month++) {
                 if ((!inMinYear || month >= minDate.getMonth()) &&
                    (!inMaxYear || month <= maxDate.getMonth())) {
                   addedMonths++;
                   var listItem = $('<li value="' + month + '"' + '>' + monthNamesShort[month]+' '+this._get(inst, 'monthSuffix')+ '</li>');
                   monthList.append(listItem);
                 }
             }
        }

        // year selection
        if ( !inst.yearshtml ) {
            inst.yearshtml = "";
            if (secondary || !changeYear) {
                html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
            } else {
                var year = 1970;
                var endYear = 2099;
                year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
                endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
                inst.minYear = year;
                inst.maxYear = endYear;    
                var yearsDiv = $('<div>');
                var yearsData = '<input type="text" readonly="readonly" value="' + drawYear + '" style="text-align:right; border:1px solid #ffffff; width:40px; outline:none;" class="ui-datepicker-year" ' +
                                            'onchange="DP_jQuery_' + dpuuid + '.datepicker._selectMonthYear(\'#' + inst.id + '\', this, \'Y\');" ' +
                                            '>';
                yearsDiv[0].innerHTML = yearsData;
                var yearList = $('<div class="tiny_Date_Select_Year" >');
                        
                for (var year = year; year <= endYear; year++) {
                    var yrLi = $('<li value="' + year + '"' +'>' + year +' '+this._get(inst, 'yearSuffix')+ '</li>');                                
                    yearList.append(yrLi);
                }
                var pare1 = $('<div id="DP_jQuery_' + dpuuid + 'dv_scroll3" class="tiny-datetime_date_sel_box_scroll">');
                var pare2 = $('<div class="Scroller-Container" style=" top: 0px; position:absolute;">');
                var addedStyle = '',addedStyleSTrack = '';
                if (addedMonths === 12)
                {
                    addedStyle = ' style="height:250px"';
                    addedStyleSTrack = ' style="height:240px"';
                }
                var pare3 = $('<div id="DP_jQuery_' + dpuuid + 'dv_scroll_bar3" class="eviewDatetime_iemp_dv_scroll_bar3" '+addedStyle+ '><div class="eviewDatetime_Scrollbar-Track" id="dv_scroll_track" '
                        +addedStyleSTrack+ '><div class="eviewDatetime_Scrollbar-Handle" onmousedown = "DP_jQuery_' + dpuuid +'.datepicker._start(\'#' +
                          inst.id + '\',event)" style="top: 0px; "></div></div></div>');
                pare1.append(pare2);
                pare1.append(pare3);                        
                pare2.append(yearList);
                yearMonthData.append(pare1);
                yearMonthData.append(monthList);
                html += yearsDiv[0].innerHTML;
               }
             }
                 var imgDiv = $('<div>');
                 var image = document.createElement("span");
                 image.id = "img" + inst.id;
                 image.className = "downbtn";
                var downBtnImgDiv = $('<div>');
                downBtnImgDiv[0].className = 'tiny_widgets_charts_downbuttonbright_image';
                document.body.appendChild(downBtnImgDiv[0]);
                var styl = downBtnImgDiv[0].currentStyle || window.getComputedStyle(downBtnImgDiv[0], null);
                var path = styl.backgroundImage.substring(4, styl.backgroundImage.length-1);
                path = path.split('"');
                if (path.length > 1)
                {
                    path = path[1];
                }
                downBtnImgDiv.remove();
                 $(image).css({"height":"8px", "width":"8px", "display": "inline-block"});
                 $(image).css('float', 'center');
                 imgDiv.append(image);
                 var yearStr = this._get(inst, 'yearSuffix');
                 if("" === yearStr){
                     html += "&nbsp";
                 }else{
                 	html += '<input type="text" readonly="readonly" value="' +yearStr + '" style="text-align:right; border:1px solid #ffffff; width:12px;">';
                 }		 		 
		 		 if (true)
                 {
                      html += (secondary || !(changeMonth && changeYear) ? '&#xa0;' : '') + monthDiv[0].innerHTML;
                 } 
                 
                 inst.yearMonthData = yearMonthData[0].innerHTML ;
                 
                 html += imgDiv[0].innerHTML;
                  html += '</div>'; // Close datepicker_header
                  return html;
         },
         
        "_start" : function(id,event) {
            var target = $(id),sliderThis = this,
            inst = sliderThis._getInst(target[0]);
            inst.isMove = true;
            if(event.target){                
                inst.sliderElement = $(event.target);
                inst.mouseStartY = event.pageY;
            } else {
                inst.sliderElement = $(event.srcElement);
                inst.mouseStartY = event.clientY;
            }
            inst.sliderStartY = inst.sliderElement.position().top;
            //防止全选等非拖拽的鼠标事件
            sliderThis._eventPrevent(event);
            sliderThis._eventStop(event);
            $(document).off("mousemove").on("mousemove", function(e) {
                if(inst.isMove){
                  sliderThis._drag(inst,e);
                }
            });
        },
        
        "_drag" : function(inst,event) {
            if(!inst.overview) {
                inst.overview = inst.dpDiv.find("#DP_jQuery_" + dpuuid +"dv_scroll3").find(".Scroller-Container");
            }
            var sliderTop = Math.min(Math.max(0, (event.pageY - inst.mouseStartY) + inst.sliderStartY), inst.maxSize);
            var overviewTop = -sliderTop * inst.ratio;
            inst.sliderElement.css("top", sliderTop + "px");
            inst.overview.css("top", overviewTop);
            inst.sliderTop = sliderTop;
            inst.overviewTop = overviewTop;            
            $(document).off("mouseup").on("mouseup", function(e) {
                inst.isMove = false;
            });
        },
        
    /* Adjust one of the date sub-fields. */
    _adjustInstDate: function(inst, offset, period) {
        var year = inst.drawYear + (period === "Y" ? offset : 0),
            month = inst.drawMonth + (period === "M" ? offset : 0),
            day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) + (period === "D" ? offset : 0),
            date = this._restrictMinMax(inst, this._daylightSavingAdjust(new Date(year, month, day)));

        inst.selectedDay = date.getDate();
        inst.drawMonth = inst.selectedMonth = date.getMonth();
        inst.drawYear = inst.selectedYear = date.getFullYear();
        if (period === "M" || period === "Y") {
            this._notifyChange(inst);
        }
    },

    /* Ensure a date is within any min/max bounds. */
    _restrictMinMax: function(inst, date) {
        var minDate = this._getMinMaxDate(inst, "min"),
            maxDate = this._getMinMaxDate(inst, "max"),
            newDate = (minDate && date < minDate ? minDate : date);
        return (maxDate && newDate > maxDate ? maxDate : newDate);
    },

    /* Notify change of month/year. */
    _notifyChange: function(inst) {
        var onChange = this._get(inst, "onChangeMonthYear");
        if (onChange) {
            onChange.apply((inst.input ? inst.input[0] : null),
                [inst.selectedYear, inst.selectedMonth + 1, inst]);
        }
    },

    /* Determine the number of months to show. */
    _getNumberOfMonths: function(inst) {
        var numMonths = this._get(inst, "numberOfMonths");
        return (numMonths == null ? [1, 1] : (typeof numMonths === "number" ? [1, numMonths] : numMonths));
    },

    /* Determine the current maximum date - ensure no time components are set. */
    _getMinMaxDate: function(inst, minMax) {
        return this._determineDate(inst, this._get(inst, minMax + "Date"), null);
    },

    /* Find the number of days in a given month. */
    _getDaysInMonth: function(year, month) {
        return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
    },

    /* Find the day of the week of the first of a month. */
    _getFirstDayOfMonth: function(year, month) {
        return new Date(year, month, 1).getDay();
    },

    /* Determines if we should allow a "next/prev" month display change. */
    _canAdjustMonth: function(inst, offset, curYear, curMonth) {
        var numMonths = this._getNumberOfMonths(inst),
            date = this._daylightSavingAdjust(new Date(curYear,
            curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));

        if (offset < 0) {
            date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
        }
        return this._isInRange(inst, date);
    },

    /* Is the given date in the accepted range? */
    _isInRange: function(inst, date) {
        var yearSplit, currentYear,
            minDate = this._getMinMaxDate(inst, "min"),
            maxDate = this._getMinMaxDate(inst, "max"),
            minYear = null,
            maxYear = null,
            years = this._get(inst, "yearRange");
            if (years){
                yearSplit = years.split(":");
                currentYear = new Date().getFullYear();
                minYear = parseInt(yearSplit[0], 10);
                maxYear = parseInt(yearSplit[1], 10);
                if ( yearSplit[0].match(/[+\-].*/) ) {
                    minYear += currentYear;
                }
                if ( yearSplit[1].match(/[+\-].*/) ) {
                    maxYear += currentYear;
                }
            }

        return ((!minDate || date.getTime() >= minDate.getTime()) &&
            (!maxDate || date.getTime() <= maxDate.getTime()) &&
            (!minYear || date.getFullYear() >= minYear) &&
            (!maxYear || date.getFullYear() <= maxYear));
    },

    /* Provide the configuration settings for formatting/parsing. */
    _getFormatConfig: function(inst) {
        var shortYearCutoff = this._get(inst, "shortYearCutoff");
        shortYearCutoff = (typeof shortYearCutoff !== "string" ? shortYearCutoff :
            new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
        return {shortYearCutoff: shortYearCutoff,
            dayNamesShort: this._get(inst, "dayNamesShort"), dayNames: this._get(inst, "dayNames"),
            monthNamesShort: this._get(inst, "monthNamesShort"), monthNames: this._get(inst, "monthNames")};
    },

    /* Format the given date for display. */
    _formatDate: function(inst, day, month, year) {
        if (!day) {
            inst.currentDay = inst.selectedDay;
            inst.currentMonth = inst.selectedMonth;
            inst.currentYear = inst.selectedYear;
        }
        var date = (day ? (typeof day === "object" ? day :
            this._daylightSavingAdjust(new Date(year, month, day))) :
            this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
        return this.formatDate(this._get(inst, "dateFormat"), date, this._getFormatConfig(inst));
    }
});

/*
 * Bind hover events for datepicker elements.
 * Done via delegate so the binding only occurs once in the lifetime of the parent div.
 * Global instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
 */
function bindHover(dpDiv) {
    var selector = "button, .tiny-ui-datepicker-calendar td a";
    return dpDiv.bind("mouseout", function(event) {
        var elem = $( event.target ).closest( selector );
        if ( !elem.length ) {
             return;
        }
        elem.removeClass( "tiny-ui-state-default-hover" );    
    })
        .bind("mouseover", function(event){
            var elem = $( event.target ).closest( selector );
            //如果是disabled状态
            if ($.datepicker._isDisabledDatepicker( instActive.inline ? dpDiv.parent()[0] : instActive.input[0]) ||
                !elem.length ) {
                 return;
             }
             //如果无“tiny-ui-state-default”类
             if(!elem.parents('.tiny-ui-datepicker-calendar').find('a').attr("tiny-ui-state-default")) {
                 return;
             }
             elem.parents('.tiny-ui-datepicker-calendar').find('a').removeClass('tiny-ui-state-default-hover');
             elem.addClass('tiny-ui-state-default-hover');
        });
}

/* jQuery extend now ignores nulls! */
function extendRemove(target, props) {
    $.extend(target, props);
    for (var name in props) {
        if (props[name] == null) {
            target[name] = props[name];
        }
    }
    return target;
}

    function eventPrevent(evt) {
        // If preventDefault exists, run it on the original event
        if ( evt.preventDefault ) {
            evt.preventDefault();

        // Support: IE
        // Otherwise set the returnValue property of the original event to false
        } else {
            evt.returnValue = false;
        }
    }
    
    function eventStop(evt) {
        if (evt.stopPropagation) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }
    }

/* Invoke the datepicker functionality.
   @param  options  string - a command, optionally followed by additional parameters or
                    Object - settings for attaching new datepicker functionality
   @return  jQuery object */
$.fn.datepicker = function(options){

    /* Verify an empty collection wasn't passed - Fixes #6976 */
    if ( !this.length ) {
        return this;
    }

    /* Initialise the date picker. */
    if (!$.datepicker.initialized) {
        $(document).mousedown($.datepicker._checkExternalClick);
        $.datepicker.initialized = true;
    }

    /* Append datepicker main container to body if not exist. */
    if ($("#"+$.datepicker._mainDivId).length === 0) {
        $("body").append($.datepicker.dpDiv);
    }
    
    $.datepicker.dpDiv.bind("mousedown click", function(evt) {
        eventStop(evt);
    });

    var otherArgs = Array.prototype.slice.call(arguments, 1);
    if (typeof options === "string" && (options === "isDisabled" || options === "getDate" || options === "widget")) {
        return $.datepicker["_" + options + "Datepicker"].
            apply($.datepicker, [this[0]].concat(otherArgs));
    }
    if (options === "option" && arguments.length === 2 && typeof arguments[1] === "string") {
        return $.datepicker["_" + options + "Datepicker"].
            apply($.datepicker, [this[0]].concat(otherArgs));
    }
    if (options === "option" && arguments.length === 2 && typeof arguments[1] === "string") {
        return $.datepicker["_" + options + "Datepicker"].
            apply($.datepicker, [this[0]].concat(otherArgs));
    }
    return this.each(function() {
        typeof options === "string" ?
            $.datepicker["_" + options + "Datepicker"].
                apply($.datepicker, [this].concat(otherArgs)) :
            $.datepicker._attachDatepicker(this, options);
    });
};

$.datepicker = new Datepicker(); // singleton instance
$.datepicker.initialized = false;
$.datepicker.uuid = new Date().getTime();
$.datepicker.version = "1.10.3";
window['DP_jQuery_' + dpuuid] = $;

})(jQuery);


