(function ($, Drupal, window, document, undefined) {

  Drupal.behaviors.buildSlideshow = {
    attach: function (context, settings) {

      var pluginName = 'flickrAlbumSlideshow';
      var defaults = {
        galleryWidth: 900
      };

      function FlickrAlbumSlideshow(element, options) {
        this.element = $(element);
        this.settings = $.extend({}, defaults, options);
        this.images = null;
        this.init();
      }

      FlickrAlbumSlideshow.prototype = {
        init: function() {
          var albumUrl = this.element.attr('data-flickr-album');
          this.fetchImages(albumUrl)
            .then(this.handleErrors.bind(this))
            .then(this.buildSlideshowHTML.bind(this))
            .then(this.applyGallery.bind(this));
        },
        fetchImages: function(albumUrl) {
          return $.ajax({
            type: "POST",
            url: Drupal.settings.basePath + 'cfas-album',
            data: JSON.stringify({
              album_url: albumUrl
            })
          });
        },
        handleErrors: function(data) {
          if (data.hasOwnProperty('error')) {
            throw new Error(data.error);
          }
          this.images = data.images;
          return data.images;
        },
        buildSlideshowHTML: function(images) {
          var slides = this.buildSlides(images);
          var slideshow = $('<div></div>');

          // This id is unfortunately required by Unite Gallery. Plus, a unique id is needed if more than one slideshow are present on a page.
          slideshow.attr('id', 'cfas--slideshow--' + Math.random().toString().substring(2));
          slideshow.addClass('cfas--slideshow');
          slideshow.append(slides);

          this.element.append(slideshow);

          return this;
        },
        applyGallery: function() {
          var aspectRatio = this.getAspectRatio();

          this.element.find('.cfas--slideshow').unitegallery({
            gallery_theme: 'slider',
            gallery_mousewheel_role: 'none',
            slider_enable_bullets: false,
            slider_enable_fullscreen_button: true,
            gallery_width: this.settings.galleryWidth,
            // Dynamically set to specify overall aspect ratio
            gallery_height: this.settings.galleryWidth / aspectRatio
          });

          return this;
        },
        getAspectRatio: function() {
          var aspectRatio;

          if (this.isValidAspectRatio(this.element.data('flickr-aspect-ratio'))) {
            var dims = this.element.data('flickr-aspect-ratio').split('x');
            aspectRatio = dims[0] / dims[1];
          } else {
            aspectRatio = this.images[0].width / this.images[0].height;
          }

          return aspectRatio;
        },
        /**
         * Determines if value has the correct format (e.g: 3x2, 4x3) so that it may be effectively parsed later.
         * @param value
         * @returns {boolean}
         */
        isValidAspectRatio: function(value) {
          return value.match(/^\d{1}x\d{1}/) !== null;
        },
        /**
         * Takes an image data and returns images tags with attributes necessary for lazy loading.
         * @returns {array}
         */
        buildSlides: function(images) {
          return images.map(function(item) {
            var img = $('<img/>');
            img.addClass('cfas--faux-image');
            img.attr('src', Drupal.settings.basePath + Drupal.settings.cfas.path + '/images/thumb.jpg');
            img.attr('data-image', item.url);

            return img;
          });
        }
      };

      $.fn.flickrAlbumSlideshow = function(options) {
        return this.each(function() {
          if ( !$.data(this, "plugin_" + pluginName) ) {
            $.data(this, "plugin_" + pluginName, new FlickrAlbumSlideshow(this, options) );
          }
        });
      };

      $('.cfas', context).flickrAlbumSlideshow();
    }
  };

})(jQuery, Drupal, this, this.document);
