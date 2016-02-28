/*
    Usage:

    mediaQuery.onEnter('mobile tablet', function(query){
      console.log(query);
    },true);

    mediaQuery.onLeave('mobile', function(query){
      console.log(query);
    },true);

    if ( mediaQuery.is('mobile') ){
      console.log('I'm a mobile)
    }

    if ( mediaQuery.isNot('mobile') ){
      console.log('I'm a mobile)
    }

    todo:
      - use: window.matchMedia('all').addListener
        https://github.com/paulirish/matchMedia.js/blob/master/matchMedia.addListener.js
      - include Modernizr fallback .mq() for non supported browsers
*/

(function (root, factory) {
    // optional AMD https://github.com/umdjs/umd/blob/master/amdWeb.js
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals
        root.mediaQuery = factory();
    }
}(this, function () {
  'use strict';
  // vars
  var queryJSONString, queries, events, ref, refCSS, timeoutId,
  // functions
      parseJSONString, addEvent, match, callEvents, handleResize;

  // will contain all the media queries:
  // {'mobile': 'only screen and (min-width: 500px)', ...}
  queries = {};

  // callbacks for enter and leave
  events = {};

  timeoutId = 0;

  // parses the JSON given from the CSS
  parseJSONString = function (queryJSONString) {
    var queriesObject = {};
    queryJSONString = queryJSONString.replace(/^['"]+|\\|(;\s?)+|['"]$/g, '');

    try{
        queriesObject = JSON.parse(queryJSONString);
    }catch(e){
        console.log('Sensible mediaQuery error. The query string in the DOM was not a JSON object: ' + queryJSONString);
    }

    return queriesObject;
  };

  // checks if queryKey exists in queries and if matchMedia matches
  match = function (queryKey) {
    return queries.hasOwnProperty(queryKey) && window.matchMedia( queries[queryKey] ).matches;
  };

  // triggers the callbacks and updates the current matches
  callEvents = function (fn) {
    var queryKey, i, callback, callbacks, wasCalled = [];

    for (queryKey in events) {
      callbacks = events[queryKey];
      for (i in callbacks) {
        callback = callbacks[i];
        // used for the callOnRegister option in addEvent
        if (fn && fn !== callback.callback) {
          return;
        }
        // makes sure callback was not already called
        if (wasCalled.indexOf(callback) !== -1) {
          return;
        }
        // handles the actual callback
        if ((match(queryKey) && callback.type === 'enter' && !callback.current) || (!match(queryKey) && callback.type === 'leave' && !callback.current)) {
          events[queryKey][i].current = true;
          callback.callback(queryKey);
          wasCalled.push(callback);
        } else if ((!match(queryKey) && callback.type === 'enter' && callback.current) || (match(queryKey) && callback.type === 'leave' && callback.current)) {
          events[queryKey][i].current = false;
          return;
        }
      }
    }
  };

  //adds an event to the callbacks to the events object
  addEvent = function(type, queryKey, callback, callOnAdd){
    var i, triggers, trigger;

    triggers = queryKey.split(' ');
    for (i = 0; i < triggers.length; ++i ){
      trigger = triggers[i];
      if( !events.hasOwnProperty(trigger) ) {
        events[trigger] = [];
      }
      events[trigger].push({callback: callback, type: type, current: match(queryKey), queryString: queryKey, query: queries[queryKey]});
    }
    if( callOnAdd ) {
      callEvents(callback);
    }
  };

  handleResize = function(){
    clearTimeout(timeoutId);
    callEvents();
  };

  window.addEventListener('resize', handleResize, true);

  //creating a dom element to read the content set by the CSS
  ref = document.createElement('div');
  ref.className = 'js-breakpoint';
  ref.style.display = 'none';
  document.body.appendChild(ref);
  refCSS = window.getComputedStyle(ref);

  //get the json from the css, IE does not support having content on non :after elements so we use font-family
  if(refCSS.getPropertyValue('content')){
    queryJSONString = refCSS.getPropertyValue('content').toLowerCase() == 'normal' ? refCSS.getPropertyValue('font-family') : refCSS.getPropertyValue('content');
  }else{
    queryJSONString = refCSS.getPropertyValue('font-family');
  }

  document.body.removeChild(ref);

  // parse the the json from the css
  queries = parseJSONString(queryJSONString);

  // expose main functions
  return {
    onEnter: function (queryKey, callback, callOnRegister) {
      addEvent('enter', queryKey, callback, callOnRegister);
    },
    onLeave: function (queryKey, callback, callOnRegister) {
      addEvent('leave', queryKey, callback, callOnRegister);
    },
    is: function (queryKey) {
      return match(queryKey);
    },
    isNot: function (queryKey) {
      return !match(queryKey);
    }
  };
}));
