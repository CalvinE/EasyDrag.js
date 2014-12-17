var EasyDrag = function(){
		
		var self = this,
		
        lastEvent = null,
 
        currentTarget = null,
        
        draggableContainerClass = "draggableWid", //Default draggable window class name.
        
        draggableAnchorClass = "dragAnchor", //Default drag anchor class name.
 
        drag = function (e) {
            e.preventDefault()
            if (lastEvent != null) {//We need at least one previous event to get delta x and delta y for the move action.
                var div = e.target;
                var divFound = (currentTarget != null); //Do we have the current target set?
                var errOccurred = false;
                if (currentTarget == null) {//Simple check for knowing the target already.
                    while (!divFound && !errOccurred) {
                        try {
                            for (var i = 0; i < div.classList.length; i++) {
                                if (div.classList[i] == draggableContainerClass) { //Found draggable object!
                                    divFound = true;
                                    break;
                                }
                            }
                            if (!divFound) { //Look at div parent for drag class
                                div = div.parentElement;
                            } else { //We found it so lets store it in a var so we dont have to look every time!
                                currentTarget = div;
                            }
                        } catch (e) {
                            //This can happen in edge cases, but it should not be often if at all!
                            errOccurred = true;
                        }
                    }
                } else { //part of the same drag action so we already have the target element
                    div = currentTarget;
                }
                if (!errOccurred) {
                    console.log(e);
                    console.log(div);
 
                    //Calculate delta Y
                    var movementY = e.screenY - lastEvent.screenY;
 
                    //Calculate delta X
                    var movementX = e.screenX - lastEvent.screenX;
 
                    div.style.position = 'absolute';
 
                    //Get top from element if it is specified
                    var top = parseInt(div.style.top.replace('px', ''));
 
                    if (isNaN(top)) { //Top was not specified on the element
                        top = div.offsetTop + movementY; 
                    } else { //Top was specified on the element
                        top = top + movementY;
                    }
                    if (div.offsetTop <= 0 && movementY < 0) { //Top of bounds check                   
                        top = 0;
                    } else if (div.offsetTop >= (div.parentElement.clientHeight - div.clientHeight) && movementY > 0) { //Bottom of bounds check
                        top = div.parentElement.clientHeight - div.clientHeight;
                    }
 
                    //Get left from element if it is specified
                    var left = parseInt(div.style.left.replace('px', ''));
                    if (isNaN(left)) { //Left was not specified on the element
                        left = div.offsetLeft + movementX;
                    } else { //Left was specified on the element
                        left = left + movementX;
                    }
                    if (div.offsetLeft <= 0 && movementX < 0) { //Left of bounds check
                        left = 0;
                    } else if (div.offsetLeft >= (div.parentElement.clientWidth - div.clientWidth) && movementX > 0) { //Right of bounds check
                        left = div.parentElement.clientWidth - div.clientWidth;
                    }
 
                    //Set draggable items top.
                    div.style.top = top + 'px';
 
                    //Set draggable items left
                    div.style.left = left + 'px';
 
                    //Clear bottom if set
                    div.style.bottom = "";
                    
                    //Clear right if set
                    div.style.right = "";
                }
            }
 
            //Store current event so deltas can be calculated next time.
            lastEvent = e;
        },
 
        mouseUp = function () {
            window.removeEventListener('mousemove', drag, true);
            //clear lastEvent and currentTarget because the couse drag has ended...
            lastEvent = null;
            currentTarget = null;
        },
 
        mouseDown = function (e) {
            window.addEventListener('mousemove', drag, true);
        },
 
        //Get all drag anchors. These are the items you click to initiate dragging. They must have  a parent element along the way witht the class draggableWid
        initDrag = function(containerClassName, anchorClassName){
        	
        	if(containerClassName && containerClassName != ""){
        		draggableContainerClass = containerClassName;
        	}
        	
        	if(anchorClassName && anchorClassName != ""){
        		draggableAnchorClass = anchorClassName;
        	}
        	
        	draggableWidgets = document.querySelectorAll("." + draggableAnchorClass);        
 
	        for (var i = 0; i < draggableWidgets.length; i++) {
	            //Apply events to anchors
	        	removeEventListener(draggableWidgets[i], 'mousedown', mouseDown);
	            draggableWidgets[i].addEventListener('mousedown', mouseDown, false);
	        }
	        removeEventListener(window, 'mouseup', mouseUp);
	        window.addEventListener('mouseup', mouseUp, false);
        }
        
        return{
        	initDrag: initDrag
        };
    }();