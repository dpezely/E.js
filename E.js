/* E.js - Create HTML Element; think: minimalist jQuery for populating DOM only

Usage:

 - E('div') will create just a <DIV> element.
 - E('div',{id:"foo"}) creates DIV and populates its attributes.
 - E('div',...,child) appends 'child' node to new DIV.
 - E('div',...,[a,b,c]) appends children a,b,c in sequence.
 - E('div',...,fn) apply function 'fn' with DIV as 'this' argument,
   and if anything is returned, append as child or children to DIV.
 - E('div',...,...,node) creates DIV and appends to 'node' and if 
   a jQuery object, will use jQuery method to append.

Alternative way to append:

 - Eppend(node,children) appends heterogeneous list (fn,text,Node)
 - Eppend(node,'div',{id:"foo"}) => E('div',{id:"foo"},null,node)
 - Eppend(node,'div',{id:"foo"},children) => E('div',{id:"foo"},children,node)

Combining with jQuery:

Rather than use jQuery to create every DOM element, which would incur
jQuery computational overhead with each call potentially performing
string parsing and storage overhead with each element created with
jQuery attributes, use E in combination with jQuery.  This has the
benefit of isolating jQuery structural instances such as in the case
where multiple plug-ins don't play well together such as jQuery-Mobile
versus Chosen.

E('div',{id:"foo"},...,$('#main-page'))

  is structurally equivalent to

$('<div>',{id:"foo"}).append(...).appendTo('#main-page')

but with less of jQuery's overhead of time or space.
*/
var DEBUG;

function E (name_or_node,attributes,nested,parent) {
    //Log("E",name_or_node,"id=",attributes?(attributes.id||""):"");
    var node;
    if (typeof(name_or_node)=="string") {
	var tag_name = name_or_node;
	node = document.createElement(tag_name);
	for (var name in attributes)
	    node.setAttribute(name,attributes[name]);
    } else {
	node = name_or_node;
    }
    if (nested!==undefined && nested!==null) //accommodate zero, empty string
	__E_append(node,nested);
    if (parent) {
	if (parent.append && parent.prepend && parent.after) //conclusion=jQuery
	    parent.append(node);
	else 
	    __E_append(parent,node);
    }
    return node;
}

function __E_append(node,nested) {
    //Log(node,nested);		// delete me
    if (typeof(nested)=="function") {
	// some functions may use 'this' and avoid returning anything:
	var results = nested.apply(node,null);
	if (results) {
	    if (results.length!==undefined && results.push!==undefined) // conclusion=Array
		for (var i=0; i!=results.length; ++i)
		    node.appendChild(results[i]);
	    else
		node.appendChild(results);
	}
    } else if (typeof(nested)=="string") {
	// Fragile on IE6,7: modifying structure later within a
	// node's .innerHTML will fail on IE.
	if (node.innerHTML)
	    node.innerHTML += nested;
	else
	    node.innerHTML = nested;
    } else if (nested) {
	if (nested.length!==undefined && nested.push!==undefined) // conclusion=Array
	    // allow for mixed element array:
	    for (var i=0; i!=nested.length && i!=1000; ++i)
		__E_append(node,nested[i]);
	else
	    node.appendChild(nested);
    } else {
	throw "Attempting to append null to <"+node.tagName+
	    " id="+node.id+" class="+node.className+">";
    }
    return node;
}

function Eppend(args__) {
    var node = arguments[0];
    switch (arguments.length) {
    case 2:
	var nested = arguments[1];
	//Log("Eppend2",node,nested);
	return __E_append(node,nested);
    case 3:
	var tag_name = arguments[1];
	var attributes = arguments[2];
	//Log("Eppend3",node,tag_name,attributes);
	return __E_append(node,E(tag_name,attributes));
    case 4:
	var tag_name = arguments[1];
	var attributes = arguments[2];
	var nested = arguments[3];
	//Log("Eppend4",node,tag_name,attributes,nested);
	return __E_append(node,E(tag_name,attributes,nested));
    default:
	throw "ERROR: expected Eppend(node,nested) or"+
	    " Eppend(node,tag_name,attr) or"+
	    " Eppend(node,tag_name,attr,nested)";
    }
}

function find (element,array) {
    for (var i=0; i!=array.length; ++i)
	if (element==array[i])
	    return true;
    return false;
}

function load_script (uri) {
    var node = document.getElementsByTagName('head');
    if (node) {
	node = node[0];
	node.appendChild(E('script',{type:"text/javascript",src:uri}));
    }
}

function process_query_strings (param_dispatch_fn) {
    var qs = document.URL.match(/\?([^#]+)/);
    if (qs) {
	var query_strings = qs[1].match(/([^&]+)/g);
	if (query_strings.length>0) {
	    for (var i=0; i!=query_strings.length; ++i) {
		var pair = query_strings[i].match(/^([^=]+)=?(.*)$/);
		if (!pair) continue;
		var param = pair[1];
		var value = decodeURIComponent(pair[2]);
		//Log("Query-String param:",param,"value:",value);
		param_dispatch_fn.call(null,param,value);
	    }
	}
    }
}

// **********************************************************************
// Logging
if (DEBUG && window.console!==undefined && window.console.log!==undefined) {
    var Log = function () {
	if (/Firefox/.test(navigator.userAgent)) {
	    window.console.log.apply(console,arguments);
	} else {
	    if (arguments.length==1) {
		window.console.log(arguments[0]);
	    } else {
		var message = '';
		for (var i=0; i!=arguments.length; ++i) {
		    if (arguments[i]===undefined || 
			(arguments[i]!=0 && 
			 arguments[i]!='' &&
			 arguments[i]!=false) && !arguments[i]) {
			message += ' NULL';
		    } else {
			message += ' '+arguments[i].toString();
		    }
		}
		window.console.log(message);
	    }
	}
    }
} else {
    var Log = function () {};
}
//End.
