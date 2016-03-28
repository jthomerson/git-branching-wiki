/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    Class = require('class.extend'),
    marked = require('marked'),
    Renderer;

Renderer = Class.extend({

   _renderer: new marked.Renderer(),

   init: function(opts) {
      this.opts = opts;

      _.each(this.overrides, function(fn, fnName) {
         this._renderer[fnName] = fn.bind(this);
      }.bind(this));
   },

   forMarked: function() {
      return this._renderer;
   },

   isURLExternal: function(href) {
      return href.indexOf('http://') !== -1 || href.indexOf('https://') !== -1;
   },

   resolveLink: function(href) {
      var parts = href.split('#'),
          address = parts.shift(),
          fragment = parts.shift(),
          page;

      if (this.isURLExternal(href)) {
         return href;
      }

      // TODO: implement
      return href;

      page = _.find(files, function(f, name) {
         return f.branch === branch && (f.slug === address || f.slug.replace(' ', '_') === address);
      });

      if (!page) {
         return '';
      }

      href = page.url;
      if (fragment) {
         href += "#" + fragment.toLowerCase();
      }

      return href;
   },

   renderLink: function(href, title, text) {
      var isExternal = this.isURLExternal(href),
          classes = [],
          out;

      if (!href) {
         classes.push('dead');
      }

      out = '<a href="' + href + '"';

      if (isExternal) {
         classes.push('external');
         out += ' target="_blank"';
      }

      if (title) {
         out += ' title="' + title + '"';
      }

      if (classes.length) {
         out += ' class="' + classes.join(' ') + '"';
      }

      out += '>' + text;

      if (isExternal) {
         out += ' <sup><span class="glyphicon glyphicon-new-window"></span></sup>';
      }

      out += '</a>';
      return out;
   },

   overrides: {
      table: function(header, body) {
         var out = '';
         out += '<table class="table table-bordered table-hover">\n';
         out += '<thead>\n';
         out += header;
         out += '</thead>\n';
         out += '<tbody>\n';
         out += body;
         out += '</tbody>\n';
         out += '</table>\n';
         return out;
      },

      link: function(href, title, text) {
         href = this.resolveLink(href);
         return this.renderLink(href, title, text);
      },
   },

});

module.exports = {

   create: function(opts) {
      return new Renderer(opts);
   },

};
