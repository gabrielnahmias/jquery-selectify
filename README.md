Selectify
=============

**Selectify** is a **jQuery _plugin_** that assists with selection of any element's text.

What does it do?
-----------

* Makes any element's text you want selectable with a single click.
* Allows one element to select another.
* Enforces coolness.

How to use it
-----------

Of course, before doing anything, you must include **jQuery** (that wouldn't be right to do through my script!) and **jquery.selectify.js** or its minified version on your page like so:
	
```javascript
<script language="javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js" type="text/javascript"></script>
<script language="javascript" src="jquery.selectify.js" type="text/javascript"></script>
```

Now that that that's done, we can get to the easy stuff.

There are 5 available options you can set when using Selectify, and they are:

1.  **debug** (default: ```false```) - outputs debugging information to the console.
2.  **pointer** (default: ```true```) - this makes the element have a pointer when you hover over it.  Can be set to ```"all"```, ```"parent"```, ```true```, or ```false``` (along with ```undefined``` or whatever but I recommend one of the previously mentioned).  ```"all"``` (or ```true```) applies the pointer to the parent element and its children, whereas ```"parent"``` (or ```false```) applies it solely to the parent element.
3.  **target** (default: ```null```) - makes the element on which you call the method select this element (a selector).
4.  **title** (default: "Click to select text") - sets the title of the element.
5.  **toggle** (default: ```false```) - selected text becomes unselected when you click it again.

Examples
-----------

As simple as it gets (no options specified):

```javascript
<script language="javascript" type="text/javascript">

$("code").selectify();

</script>
```

Most options specified:

```javascript
<script language="javascript" type="text/javascript">

$(".clicker").selectify( {
	
	debug: true,
	
	target: "#text",
	
	toggle: true,
	
	title: "Click to select/deselect text"
	
} );

</script>
```

Browser support
-----------

* Google **Chrome**
* Mozilla **Firefox** 3+
* IE 6+ (should be)
* Others as of yet untested (help me out!)

License
-----------

Public domain

Acknowledgements
------------

Selectify is a project by [Gabriel Nahmias](mailto:gabriel@terrasoftlabs.com), co-founder of Terrasoft.