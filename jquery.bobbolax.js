( function ( $ ) {

	function default_easing ( x, t, b, c, d ) { return ( t /= d / 2 ) < 1 ? c / 2 * t * t + b : -c / 2 * ( --t * ( t - 2 ) - 1 ) + b; }

	function Bobbolax () {
		this.map = {};
		this.$win.bind( {
			scroll: $.proxy( this, 'scroll' )
		} );
	}
	Bobbolax.prototype = {
		$win:   $( window ),
		$doc:   $( document ),
		height: $( document ).height(),
		pos:    0,
		scroll: function () {
			this.pos = this.$doc.scrollTop();
			for ( var key in this.map ) {
				this.map[ key ].$elem.css( this.map[ key ].frames[ this.pos ] );
			}
		},
		add: function ( $elem, keyframes, id ) {
			this.map[ id ] = {
				$elem:      $elem,
				keyframes:  keyframes,
				frames:     []
			};
			var max = keyframes.length;
			if ( max < 2 ) return;
			for ( var i = 0, index = 0; i < this.height; i++ ) {
				if ( index + 1 < max && i > keyframes[ index + 1 ].pos ) index++;   // if the position has exceeded the current scope, jump to next keyframes
				this.get_css( i, index, id );
			}
			this.scroll();
		},
		remove_by_id: function ( id ) {
			delete this.map[ id ];
		},
		remove_by_dom: function ( $elem ) {
			for ( var i in this.map ) if ( this.map[ i ].$elem.get( 0 ) == $elem.get( 0 ) ) delete this.map[ i ];
		},
		get_css: function ( pos, index, id ) {
			var keyframes = this.map[ id ].keyframes;                       // get keyframes by id
			var prev = keyframes[ index ];                                  // get previous keyframe
			if ( pos < prev.pos ) return this.map[ id ].frames[ pos ] = prev.css;  // if not reached yet, return
			var next = keyframes[ index + 1 ];                              // get next keyframe
			if ( !next ) return this.map[ id ].frames[ pos ] = prev.css;    // if already reached, return

			this.map[ id ].frames[ pos ] = {};
			for ( var prop in prev.css ) {                              // loop through all css properties being animated
				var t = pos - prev.pos, b = prev.css[ prop ], c = next.css[ prop ] - b, d = next.pos - prev.pos;
				this.map[ id ].frames[ pos ][ prop ] = default_easing( null, t, b, c, d );
			}
		}
	};

	var bobbolax = new Bobbolax();
	$.fn.bobbolax = $.bobbolax = function () {
		var id          = false,
			$elem       = $( this ),
			keyframes   = false,
			i           = arguments.length,
			arg         = false;
		while ( i-- ) {
			arg = arguments[ i ];
			switch ( typeof arg ) {
				case 'string': id = arg; break;
				case 'object':
					if ( arg.jquery ) $elem = arg;
					else if ( arg.nodeType ) $elem = $( arg );
					else keyframes = arg;
					break;
			}
		}
		//-- if keyframes, add listener; otherwise, remove listener
		if ( keyframes ) {
			if ( id === false ) id = +new Date();
			bobbolax.add( $elem, keyframes, id );
		} else {
			if ( id !== false ) bobbolax.remove_by_id( id );
			else bobbolax.remove_by_dom( $elem );
		}
	};

} )( jQuery );