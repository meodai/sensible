/*
    Usage:

    mediaQuery.onEnter('mobile tablet', function(querry){
      console.log(querry);
    },true);

    mediaQuery.onLeave('mobile', function(querry){
      console.log(querry);
    },true);

    if ( mediaQuery.is('mobile') ){
      console.log('I'm a mobile)
    }

    if ( mediaQuery.isNot('mobile') ){
      console.log('I'm a mobile)
    }

    todo:
      - optional debounce
      - use: window.matchMedia('all').addListener
        https://github.com/paulirish/matchMedia.js/blob/master/matchMedia.addListener.js
      - include Modernizr fallback .mq() for non supported browsers
*/

(function (root, factory) {
    // optional AMD https://github.com/umdjs/umd/blob/master/amdWeb.js
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        root.mediaQuery = factory(root.$);
    }
}(this, function ($) {
  'use strict';

  var mediaQuery,
  // vars
      nameSpace, querryJSONString, querries, events, $ref,
  // functions
      parseJSONString, addEvent, match, callEvents;

  //  namespace for jQueryevents
  nameSpace = 'mediaQuery';

  // will contain all the media queries:
  // {'mobile': 'only screen and (min-width: 500px)', ...}
  querries = {};

  // callbacks for enter and leave
  events = {};

  // parses the JSON given fromt the CSS
  parseJSONString = function (querryJSONString) {
    return $.parseJSON(querryJSONString.substring(1, querryJSONString.length-1) );
  };

  // checks if queryKey exists in querries and if matchMedia matches
  match = function (queryKey) {
    return querries.hasOwnProperty(queryKey) && window.matchMedia( querries[queryKey] ).matches;
  };

  // triggers the callbacks and updates the current matches

  callEvents = function (callback) {
    var wasCalled = [];

    $.each(events, function (queryKey, callbacks) {

      $.each(callbacks, function () {
        // used for the callOnRegister option in addEvent
        if (callback && callback !== this) {
          return;
        }

        // makes sure callback was not already called
        if ($.inArray(this, wasCalled) !== -1) {
          return;
        }

        // handles the actual callback
        if ((match(queryKey) && this.type === "enter" && !this.current) || (!match(queryKey) && this.type === "leave" && !this.current)) {
          this.current = true;
          this.callback(queryKey);
          wasCalled.push(this);
        } else if ((!match(queryKey) && this.type === "enter" && this.current) || (match(queryKey) && this.type === "leave" && this.current)) {
          this.current = false;
          return;
        }

      });
    });
  };

  //adds an event to the callbacks to the events object
  addEvent = function( type,queryKey,callback,callOnAdd ){
    var i, triggers, trigger;

    triggers = queryKey.split(" ");
    for (i = 0; i < triggers.length; ++i ){
      trigger = triggers[i];
      if( !events.hasOwnProperty(trigger) ) {
        events[trigger] = [];
      }
      events[trigger].push({callback: callback, type: type, current: match(queryKey)});
    }

    if( callOnAdd ) {
      callEvents(callback);
    }
  };

  $(window).on('resize.' + nameSpace, function(){
    callEvents();
  });

  //creationg a dom element to read the content set by the CSS
  $ref = $('<div />', {class:'js-breakpoint', css:{'display': 'none'}});
  $ref.appendTo($('body'));

  //get the json from the css
  querryJSONString = $ref.css('content');

  // parse the the json from the css
  querries = parseJSONString(querryJSONString);

  // expose main functions
  mediaQuery = {
    onEnter: function (queryKey,callback,callOnRegister) {
      addEvent( 'enter',queryKey,callback,callOnRegister );
    },
    onLeave: function (queryKey,callback,callOnRegister) {
      addEvent( 'leave',queryKey,callback,callOnRegister );
    },
    is: function (queryKey) {
      return match(queryKey);
    },
    isNot: function (queryKey) {
      return !match(queryKey);
    }
  };

  return mediaQuery;
}));
