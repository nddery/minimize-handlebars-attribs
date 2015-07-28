# Minimize Handlebars attributes plugin

**This is experimental, use in production is not recommended.**

A minimize plugin to handle Handlebars template in element attributes

## Usage
**Note: This plugin is not compatible with the `spare` option.**

```js
var Minimize  = require('minimize'),
    hbattribs = require('minimize-handlebars-attribs'),
    minimize  = new Minimize({
      spare: false,
      plugins: [ hbattribs ]
    });

var html = '<div id="divID" class="my-class your-class" {{#ifCond clause ../../isTrue}}selected{{/ifCond}}>A div</div>';

minimize.parse(html, function(error, data) {
  // data output: <div id=divID class="my-class your-class" {{#ifcond clause ../../istrue}}selected{{/ifcond}}>A div</div>
});
```

**Note that everything has been lowercase'd.**

## Why ?

Minifing HTML with `minize` will give you valid HTML. But what if when you HTML
contains some Handlebars template ? What if you HTML looked like this:

```html
<select name="preset">
  {{#forEach presets}}
    <option {{#ifCond this.key ../model.preset}}selected{{/ifCond}}>
      {{this.key}}
    </option>
  {{/forEach}}
</select>
```

Although this will produce valid HTML once it's parsed by Handlebars, it is not
valid HTML at the time of minifying. Here's the output from running this through
`minimize`:

```html
<select name=preset><option {{#ifcond="" this.key="" ..="" model.preset}}selected{{="" ifcond}}="">{{this.key}}</option></select>
```

Notice how the Handlebars template is all split up ?

This plugin attemps to mitigate the issue by re-structuring the tree output from
`htmlparser2`, which is used by `minimize`. A downside is that **everything will
be lowercase'd**.

## Credits
[minimize](https://github.com/Swaagie/minimize) of Swaagie is used to parse and minify the tree rendered by [node-htmlparser](https://github.com/fb55/htmlparser2) of fb55.
