( function ( $ ) {

	function default_easing ( x, t, b, c, d ) { return ( t /= d / 2 ) < 1 ? c / 2 * t * t + b : -c / 2 * ( --t * ( t - 2 ) - 1 ) + b; }

	function Bobbolax () {
		this.$win.bind( {
			scroll: $.proxy( this, 'scroll' )
		} );
	}
	Bobbolax.prototype = {
		$win: $( window ),
		scroll: function ( e ) {

		},
		add: function ( $elem, keyframes ) {
			if ( keyframes.length < 2 ) return;
		}
	};

	$.bobbolax = $.proxy( new Bobbolax(), 'add' );

} )( jQuery );