/*!
 * Selectify v1.0.0
 * http://github.com/terrasoftlabs/jquery-selectify
 *
 * Copyright © 2012 Gabriel Nahmias.
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

// TODO: Make global defaults possible.
//		 WHEN SELECTIFYING THE BODY THROUGH TARGET, TOGGLE HAS NO BEARING.  Fix.

( function($) {
	
	jQuery.fn.selectify = function(oParams) {
		
		// "Constants."
		
		var CLASS = "selected",
			DEBUG_SELECTED = "Selected.",
			DEBUG_DESELECTED = "Deselected.",
			NAME = "Selectify";
		
		// Variables.
		
		var that = this,				// Copy current object for later use.
			bSelected = false,			// Acts like a more accurate .is(":focus").
			oDoc = document,
			sMsg,
			sSelected = "selected";
		
		this.oSettings = $.extend( {
			
			debug:		false,
			pointer:	true,
			target:		null,
			title:		"Click to select code",
			toggle:		false
			
		}, oParams);
		
		var it = this.oSettings.target;
		
		if ( $(it).length <= 0 && typeof it != 'undefined' && it != null )	
			throw new Error(NAME + ': Invalid target specified with selector "' + it + '" (attached to element selected by ' + this.selector + ').');
		
		if (this.oSettings.pointer)
			this.css("cursor", "pointer");
		
		/* Debugging output */
		
		if (this.oSettings.debug) {
			
			sMsg = "Element selectified:";
			
			if ($.browser.msie) {
				
				console.log(sMsg, this);
				
			} else {
				
				console.debug(sMsg, this);
				console.debug(" ");
				
			}
			
			if (typeof it != 'undefined' && it != null) {
				
				sMsg = "Its target is:";
				
				if ($.browser.msie) {
					
					console.log(sMsg, it);
					
				} else {
					
					console.debug(sMsg, it);
					console.debug(" ");
					
				}
				
			}
			
		}
		
		/* End main debugging output */
		
		function debug() {
			
			// Debug as many different thinks as you'd like.  Maybe use this later?
			
			for (var i = 0; i < arguments.length; i++) {
				
				console.debug( arguments[0] );
				
			}
			
		}
		
		function selectText(element, event) {
			
			var oEl = element[0];
			
			// Need to work in if the element is currently selected or something so all selections
			// sync up.  It varies from input to text... this is fine for now.
			
			bSelected = that.data(sSelected); //( window.getSelection().toString() != "" );
			
			//var sType = oEl.nodeName.toLowerCase();
			
			if ( element.is("input") ) {
				
				// It's an input field so there's a totally different way to select the text.
				
				if (that.oSettings.toggle) {
					
					if (!bSelected) {
						
						if (that.oSettings.debug) {
							
							if ($.browser.msie)
								console.log(DEBUG_SELECTED);
							else
								console.debug(DEBUG_SELECTED);
							
						}
						
						that.data(sSelected, true);
						
						element.select();
						
					} else {
						
						if (that.oSettings.debug) {
							
							if ($.browser.msie)
								console.log(DEBUG_DESELECTED);
							else
								console.debug(DEBUG_DESELECTED);
							
						}
						
						that.data(sSelected, false);
						
						element.blur();
						
					}
					
				} else {
					
					// No toggle.
					
					if (that.oSettings.debug) {
						
						if ($.browser.msie)
							console.log(DEBUG_SELECTED);
						else
							console.debug(DEBUG_SELECTED);
						
					}
					
					that.data(sSelected, true);
					
					element.select();
					
				}
				
			} else {
				
				if (oDoc.body.createTextRange) {
					
					// IE < 9
					
					var oRangeOld = oDoc.body.createTextRange(),
						oSelection = oDoc.selection;
					
					if (that.oSettings.toggle && bSelected) {
						
						if (that.oSettings.debug)
							console.log(DEBUG_DESELECTED);
						
						that.data(sSelected, false);
						
						// I've got to think of a better way to do this if there is one.
						
						//oSelection.removeAllRanges();
						
						oSelection.empty();
						
					} else {
						
						if (that.oSettings.debug)
							console.log(DEBUG_SELECTED);
						
						that.data(sSelected, true);
						
						oRangeOld.moveToElementText(oEl);
						
						oRangeOld.select();
						
					}
					
				} else if (window.getSelection) {
					
					// Mozilla, Opera, WebKit, IE9, etc.					
					
					var oRange = oDoc.createRange(),
						oSelection = window.getSelection();
					
					if ( that.oSettings.toggle && bSelected ) {
						
						if (that.oSettings.debug) {
							
							if ($.browser.msie)
								console.log(DEBUG_DESELECTED);
							else
								console.debug(DEBUG_DESELECTED);
							
						}
						
						that.data(sSelected, false);
						
						oSelection.removeRange(oRange);
						
					} else {
						
						if (that.oSettings.debug) {
							
							if ($.browser.msie)
								console.log(DEBUG_SELECTED);
							else
								console.debug(DEBUG_SELECTED);
							
						}
						
						that.data(sSelected, true);
						
						oRange.selectNodeContents(oEl);
						
						oSelection.removeAllRanges();
						
						oSelection.addRange(oRange);
						
					}
					
					if (that.oSettings.debug) {
						
						console.debug(" ");
						console.debug("Range object: ", oRange);
						console.debug("Selection object: ", oSelection);
						
					}
					
				}
			
			}
			
			// event.preventDefault();
			
		}
		
		this.attr("title", function() {
			
			var $this = $(this);
			
			if ( !$this.attr("title") ) {
				
				if (that.oSettings.debug) {
					
					sMsg = "Adding title.";
					
					if ($.browser.msie)
						console.log(sMsg);
					else
						console.debug(sMsg);
					
				}
				
				$this.attr("title", that.oSettings.title);
			
			}
			
		} ).blur( function() {
			
			// Not sure if this is the best idea but it's along the right path.
			
			that.data(sSelected, false);
			
		} ).click( function(event) {
			
			//event.preventDefault();
			
			var $this = $(this);
			
			if (that.oSettings.debug) {
				
				sMsg = "Clicked.";
				
				if ($.browser.msie)
					console.log(sMsg);
				else
					console.debug(sMsg);
				
			}
			
			if (typeof it != 'undefined' && it != null) {
				
				var sMain = NAME.toLowerCase();
				
				$this.attr("rel", it);
				
				var $Target = $( $this.toggleClass(sMain + " " + CLASS).attr("rel") ).toggleClass(sMain + " target");
				
				// Not sure if commenting the conditional has any lasting effects.
				
				// if ( $this.hasClass(CLASS) )
					selectText($Target, event);
				
			} else
				selectText($this, event);
			
		} );
		
		return this;
		
	}

} )(jQuery);