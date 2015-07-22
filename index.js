exports.id = 'handlebarsAttribs';
exports.element = function element(node, next) {
  var inHandlebarsTemplate,
      newAttribs = {},
      currentKey,
      handlebarsDelimiter,
      key,
      lastKey;

  if (node.attribs) {
    // Find start and end of all Handlebars template in attributes
    for (key in node.attribs) {
      if (node.attribs.hasOwnProperty(key)) {
        // Start of an handlebars template
        if (!inHandlebarsTemplate && key.indexOf('{{') === 0) {
          inHandlebarsTemplate = true;
          currentKey = key;
        // End of an handlebars template
        } else if (inHandlebarsTemplate && key.indexOf('}}') === key.length - 2) {
          inHandlebarsTemplate = false;
          handlebarsDelimiter = key.indexOf('/') === 0 ? '' : '/';
          currentKey = currentKey + handlebarsDelimiter + key;
          newAttribs[currentKey] = '';
        } else if (inHandlebarsTemplate) {
          // @TODO: there must be a better way...
          currentKey = currentKey + (lastKey == '..' ? '/' : ' ') + key;
        // Not in an handlebars template, normal attrs, keep pushing
        } else {
          newAttribs[key] = node.attribs[key];
        }
        lastKey = key;
      }
    }
    node.attribs = newAttribs;
  }

  next();
};
