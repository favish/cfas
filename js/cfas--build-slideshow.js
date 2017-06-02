(function ($, Drupal, window, document, undefined) {

  Drupal.behaviors.buildSlideshow = {
    attach: function (context, settings) {

      var pluginName = 'flickrAlbumSlideshow';
      var defaults = {};

      function FlickrAlbumSlideshow(element, options) {
        this.element = $(element);
        this.settings = $.extend({}, defaults, options);
        this.init();
      }

      FlickrAlbumSlideshow.prototype = {
        init: function() {
          var albumUrl = this.element.attr('data-flickr-album');
          this.fetchImages(albumUrl)
            .then(this.handleErrors)
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
          this.element.find('.cfas--slideshow').unitegallery({
            slider_scale_mode: 'fitvert',
            gallery_autoplay: true,
            gallery_mousewheel_role: 'none',
            gallery_images_preload_type: 'minimal'
          });

          return this;
        },
        /**
         * Takes an array of image objects. Returns li's containing images.
         */
        buildSlides: function(images) {
          return images.map(function(item) {
            var img = $('<img/>');
            img.addClass('cfas--faux-image');
            img.attr('src', item.url);
            img.attr('data-description', item.title);

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
