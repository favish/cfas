# CKEditor Flickr Album Slideshow

This module provides a CKEditor button for adding a slideshow of a Flickr album via the WYSIWYG. In the button dialog, you can configure:
1) The aspect ratio of the slideshow. By default, it matches the dimensions of the first image in the slider, but you can also choose 4x3, 3x2, and 1x1.
2) The Flickr album URL

CKEditor then adds a placeholder element that is picked by a jQuery plugin on page load which fetches the album's image data from a Drupal route.

## Module Dependencies
* WYSIWYG
* Libraries

## Library Dependencies
* Unite Gallery - https://github.com/vvvmax/unitegallery/

## Setup
* Make sure you have the aforementioned modules and libraries installed in your codebase.
* Give 'Configure CFAS Module' permission to roles.
* Add API key at /admin/config/media/cfas.
