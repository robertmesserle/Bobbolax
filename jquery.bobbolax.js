( function ( $ ) {

	function default_easing ( x, t, b, c, d ) { return ( t /= d / 2 ) < 1 ? c / 2 * t * t + b : -c / 2 * ( --t * ( t - 2 ) - 1 ) + b; }

	function Bobbolax () {
		this.map = [];
		this.$win.bind( {
			scroll: $.proxy( this, 'scroll' )
		} );
	}
	Bobbolax.prototype = {
		$win: $( window ),
		height: $( document ).height(),
		scroll: function ( e ) {

		},
		add: function ( $elem, keyframes ) {
			var max = keyframes.length;
			if ( max < 2 ) return;
			for ( var i = 0, index = 0; i < this.height; i++ ) {
				if ( index + 1 < max && i > keyframes[ index + 1 ].pos ) index++;   // if the position has exceeded the current scope, jump to next keyframes
				this.get_css( i, keyframes, index );
			}
		},
		get_css: function ( pos, keyframes, index ) {
			var prev = keyframes[ index ];                          // get previous keyframe
			if ( pos < prev.pos ) return this.map[ pos ] = prev;    // if not reached yet, return
			var next = keyframes[ index + 1 ];                      // get next keyframe
			if ( !next ) return this.map[ pos ] = prev;             // if already reached, return

			this.map[ pos ] = {};
			for ( var prop in prev.css ) {                          // loop through all css properties being animated
				var t = pos - prev.pos, b = prev.css[ prop ], c = next.css[ prop ] - b, d = next.pos - prev.pos;
				this.map[ pos ][ prop ] = default_easing( null, t, b, c, d );
			}
		}
	};

	$.bobbolax = $.proxy( new Bobbolax(), 'add' );
	$.fn.bobbolax = function ( keyframes ) { $.bobbolax( $( this ), keyframes ); };

} )( jQuery );