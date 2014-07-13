# sensible

Sensible is a toolset of SCSS/CSS and JS that handles responsiveness as painless as possible

## Setup

import **_mediaqueries.scss** to you main scss/sass file.
	
	@import 'mediaqueries';
	
Include **mediaQuery.js** into your html file.
	
	<script src="mediaQuery.js"></script>

Alternatively you can require mediaQuery.js with AMD.

	require(['lib/browser/mediaQuery'], function ( mediaQuery ) {})


## Usage SCSS

### Set up your breakpoints

		$breakpoints: (
  			"mobile"              : "only screen and (max-width:740px)",
  			"tablet"              : "only screen and (max-width:1050px)",
  			"desktop"             : "only screen and (min-width:1051px)",
  			"print"               : "print"
		);
		
### use the magic 
		
		body {
			padding: 40px;
		}
		
		@include breakpoint(tablet) {
			body {
				padding: 20px;
			}
		}
		
		.main {
			margin: 40px;
			@include breakpoint(mobile) {
				margin: 20px;
			}
		}
		


## Usage JS


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


