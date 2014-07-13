/*jslint browser: true */
/*global require: true, requirejs: true, $: true */

(function(){
    'use strict';

    require(['mymodule'], function () {
        console.log('mymodule is loaded');
    });

    require(['lib/browser/mediaQuery'], function ( mediaQuery ) {

      mediaQuery.onEnter('mobile tablet', function(querry){
        console.log('enter mobile & tablet:', querry);
      },true);


      mediaQuery.onEnter('tablet', function(querry){
        console.log('enter tablet:', querry);
      },true);


      mediaQuery.onLeave('mobile', function(querry){
        //test on leave
        console.log('leave moble:',querry);
      },true);

      console.log( "is mobile:", mediaQuery.is('mobile') );
      console.log( "is not mobile:", mediaQuery.isNot('mobile') );
    });

})();

