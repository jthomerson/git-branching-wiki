/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    marked = require('marked'),
    BasePlugin = require('./BasePlugin'),
    MarkdownTransformer = require('./lib/MarkdownTransformer'),
    MarkdownRenderer = require('./lib/MarkdownRenderer');

module.exports = BasePlugin.extend({

   onInitialized: function() {
      this.transformer = new MarkdownTransformer(this.opts.templating.markdown);
      this.renderer = MarkdownRenderer.create(this.opts.templating.markdown);
   },

   run: function(files, metalsmith, done) {
      _.each(files, function(file, name) {
         var str = file.contents.toString();

         str = this.transformer.transformRawMarkdown(str);
         str = marked(str, {
            smartypants: true,
            gfm: true,
            breaks: true,
            tables: true,
            renderer: this.renderer.forMarked(),
            // TODO: add code highlighting
         });

         file.contents = new Buffer(str);
         delete files[name];
         files[file.url] = file;
      }.bind(this));

      done();
   },

});
