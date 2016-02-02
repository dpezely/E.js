E.js: Create HTML Elements
==========================

## Intro

Create nested HTML Elements in JavaScript.

Conceptually, this is "minimalist jQuery" alternative for populating DOM
only, especially for when jQuery plugins don't play well together.

This library grew from various UI projects, mostly for in-house console and
utility applications rather than public-facing websites.  That's not to say
whether it would withstand such abuse or not, but it hasn't been acid-tested
as such.

Most people will be happy staying with jQuery.  Enough said.

## Usage

Consider including this within your larger custom library.

Simple API behaviour:

- only the first parameter is required
- first parameter is string name of DOM element
- second is object defining element attributes
- third defines child (or children)
- when third is an array, elements may be of mixed type
- when third includes a function, =this= will be its parent
- fourth parameter specifies parent for append

Examples:

- `E('div')` will create just a `<DIV>` element.
- `E('div',{id:"foo"})` creates DIV and populates its attributes.
- `E('div',...,child)` appends `child` node to new DIV.
- `E('div',...,[a,b,c])` appends children a,b,c in sequence.
- `E('div',...,fn)` apply function `fn` with DIV as `this` argument,
   and if anything is returned, append as child or children to DIV.
- `E('div',...,...,node)` creates DIV and appends to 'node' and if 
   a jQuery object, will use jQuery method to append.

Alternative way to append:

- `Eppend(node,children)` appends heterogeneous list `(fn,text,Node)`
- `Eppend(node,'div',{id:"foo"})` => `E('div',{id:"foo"},null,node)`
- `Eppend(node,'div',{id:"foo"},children)` => `E('div',{id:"foo"},children,node)`

## Combining with jQuery

Rather than use jQuery to create every DOM element, which would incur
jQuery computational overhead with each call potentially performing
string parsing and storage overhead with each element created with
jQuery attributes, use E in combination with jQuery.  This has the
benefit of isolating jQuery structural instances such as in the case
where multiple plug-ins don't play well together (e.g., jQuery-Mobile
versus Chosen).

	E('div',{id:"foo"},...,$('#main-page'))

is structurally equivalent to

	$('<div>',{id:"foo"}).append(...).appendTo('#main-page')

but with less overhead.

## Logging

To enable logging via `Log("...")`, define `var DEBUG=true` before loading
this script.
