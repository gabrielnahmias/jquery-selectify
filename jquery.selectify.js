/*!
 * Selectify v1.0.1
 * http://github.com/terrasoftlabs/jquery-selectify
 *
 * Copyright © 2012 Gabriel Nahmias.
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

/* TODO:
 *		 
 *		 Make global defaults possible.
 *		 
 *		 Make prototype or whatever editable like above except it has more to do with
 *		 editing an already existing Selectify call through chaining, etc.  For example,
 *		 with the child-test examples on index.html, I could modify the settings for the
 *		 call on another element through that chain instead of calling it separately with
 *		 :eq kind of logic.
 *		 
 *		 Can't have both text input and text on page selected at same time??  Interesting.
 *		 
 *		 Add option to change title depending on whether selected or not.
 *		 
 *		 Change association of data() to element itself?  Not sure.
 *		 
 *		 WHEN SELECTIFYING THE BODY THROUGH TARGET, TOGGLE HAS NO BEARING.  Fixed?
 *
 * Known issues:
 *		 
 *		 Chome:
 *		 
 *		 	Selectifying with a target with toggle enabled doesn't work... hmm.
 *		 	will fix soon.
 *		 
 *		 IE:
 *		 
 *		 	... there's some but FUCK IE.
 *		 
 */

( function($) {
	
	jQuery.fn.selectify = function(oParams) {
		
		// "Constants."
		
		var CLASS = "selected",
			DEBUG_SELECTED = "Selected.",
			DEBUG_DESELECTED = "Deselected.",
			NAME = "Selectify";
		
		// Variables.
		
		var that = this,				// Copy current object for later use.
			bIE = $.browser.msie,		// Using IE?
			bSelected = false,			// Acts like a more accurate .is(":focus").
			oDoc = document,
			sMsg,
			sSelected = "selected";
		
		this.oSettings = $.extend( {
			
			debug:		false,
			pointer:	true,
			target:		null,
			//select:		"all",
			title:		"Click to select text",
			toggle:		false
			
		}, oParams);
		
		var it = this.oSettings.target;
		
		function debug() {
			
			// Debug as many different thinks as you'd like.  Maybe use this later?
			
			for (var i = 0; i < arguments.length; i++) {
				
				console.debug( arguments[i] );
				
			}
			
		}
		
		// Begin selectText().
		
		function selectText(element/*, event*/) {
			
			// NOTE:	I've edited this function quite a bit especially in how it returns.  Previously,
			//			I believe it did not return anything, merely it applied some things to the selected
			//			elements.  Not sure if this is good.  Investigate.  What I'm trying to do is allow
			//			Multiple selections to be made at once but to no avail.  Oh, well!
			
			var iElements = element.length;
			
			return element.each( function(i, v) {
				
				var oCurrent = element[i];
				
				var $Current = $(oCurrent);
				
				// Need to work in if the element is currently selected or something so all selections
				// sync up.  It varies from input to text... this is fine for now.
				
				bSelected = that.data(sSelected); //( window.getSelection().toString() != "" );
				
				//var sType = oCurrent.nodeName.toLowerCase();
				
				if ( $Current.is("input") ) {
					
					// It's an input field so there's a totally different way to select the text.
					
					if (that.oSettings.toggle) {
						
						if (!bSelected) {
							
							if (that.oSettings.debug) {
								
								if (bIE)
									console.log(DEBUG_SELECTED);
								else
									console.debug(DEBUG_SELECTED);
								
							}
							
							that.data(sSelected, true);
							
							$Current.select();
							
						} else {
							
							if (that.oSettings.debug) {
								
								if (bIE)
									console.log(DEBUG_DESELECTED);
								else
									console.debug(DEBUG_DESELECTED);
								
							}
							
							that.data(sSelected, false);
							
							$Current.blur();
							
						}
						
					} else {
						
						// No toggle.
						
						if (that.oSettings.debug) {
							
							if (bIE)
								console.log(DEBUG_SELECTED);
							else
								console.debug(DEBUG_SELECTED);
							
						}
						
						that.data(sSelected, true);
						
						$Current.select();
						
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
							
							oRangeOld.moveToElementText(oCurrent);
							
							oRangeOld.select();
							
						}
						
					} else if (window.getSelection) {
						
						// Mozilla, Opera, WebKit, IE9, etc.					
						
						var oRange = oDoc.createRange(),
							oSelection = window.getSelection();
						
						if (that.oSettings.toggle && bSelected) {
							
							if (that.oSettings.debug) {
								
								if (bIE)
									console.log(DEBUG_DESELECTED);
								else
									console.debug(DEBUG_DESELECTED);
								
							}
							
							that.data(sSelected, false);
							
							oSelection.removeRange(oRange);
							
						} else {
							
							if (that.oSettings.debug) {
								
								if (bIE)
									console.log(DEBUG_SELECTED);
								else
									console.debug(DEBUG_SELECTED);
								
							}
							
							that.data(sSelected, true);
							
							oRange.selectNodeContents(oCurrent);
							
							oSelection.removeAllRanges();
							
							oSelection.addRange(oRange);
							
						}
						
						if (that.oSettings.debug) {
							
							console.debug("Range object: ", oRange);
							console.debug("Selection object: ", oSelection);
							
						}
						
					}
				
				}
				
			} );
			
			// event.preventDefault();
			
		}
		
		// End selectText().
		
		// BEGIN MAIN EXECUTION AREA
		
		if ( $(it).length <= 0 && typeof it != 'undefined' && it != null )	
			throw new Error(NAME + ': Invalid target specified with selector "' + it + '" (attached to element selected by ' + this.selector + ').');
		
		// Begin debugging output.
		
		if (this.oSettings.debug) {
			
			sMsg = "Element(s) selectified:";
			
			if (bIE) {
				
				console.log(sMsg, this);
				
			} else {
				
				console.debug( sMsg, $(this.selector) );
				
			}
			
			if (typeof it != 'undefined' && it != null) {
				
				sMsg = "Its target is:";
				
				if (bIE) {
					
					console.log(sMsg, it);
					
				} else {
					
					console.debug(sMsg, it);
					
				}
				
			}
			
		}
		
		// End main debugging output.
		
		// Pointer handling.
		
		if (this.oSettings.pointer) {
			
			var iKids = this.children().length,
				mPointer = this.oSettings.pointer,
				sProp = "cursor",
				sVal = "pointer";
			
			sMsg = "Changing cursor to pointer.";
			
			if (mPointer == "all" || mPointer == true) {
				
				// If pointer is set to all or true (and not parent), apply the pointer to
				// everything including its kids.
				
				if (bIE) {
					
					console.log(sMsg);
					
				} else {
					
					console.debug(sMsg);
					
				}
				
				this.css(sProp, sVal)
				
				// If it's got kids, add the title to them, too.
				
				sMsg = "Changing cursor to pointer for children:";
				
				if (bIE) {
					
					console.log(sMsg);
					
				} else {
					
					console.debug(sMsg);
					
				}
				
				if (iKids > 0) {
					
					this.children().each( function() {
						
						sMsg = "Child: ";
						
						if (bIE) {
							
							console.log(sMsg, this);
							
						} else {
							
							console.debug(sMsg, this);
							
						}
						
						$(this).css(sProp, sVal);
						
					} );
					
				}
				
			} else if (mPointer == "parent") {
				
				// If pointer is set to parent, apply the pointer to just the parent
				// element excluding kids.
				
				if (bIE) {
					
					console.log(sMsg);
					
				} else {
					
					console.debug(sMsg);
					
				}
				
				this.css(sProp, sVal);
				
				// Workaround for IE.
				
				if (bIE) {
					
					if (iKids > 0) {
						
						this.children().each( function() {
							
							sMsg = "Removing cursor for child (workaround for IE): ";
							
							console.log(sMsg, this);
							
							$(this).css(sProp, "auto");
							
						} );
						
					}
					
				}
				
			} else {
				
				// It's not parent, all, or true... so probably false or something related.
				// Do nothing.
				
			}
			
		}
		
		this.attr("title", function() {
			
			var $this = $(this);
			
			if ( !$this.attr("title") ) {
				
				if (that.oSettings.debug) {
					
					sMsg = "Adding title.";
					
					if (bIE)
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
				
				if (bIE)
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
					selectText($Target);
				
			} else {
				
				selectText($this);
				
			}
			
		} );
		
		// END MAIN EXECUTION AREA.
		
	}

} )(jQuery);