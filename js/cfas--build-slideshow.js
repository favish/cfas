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
            .then(this.flexslider.bind(this))
            .then(this.setBackgroundSize.bind(this))
            .then(this.handleEventResize.bind(this));
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
            console.error(data.error);
          }
          return data.images;
        },
        buildSlideshowHTML: function(images) {
          var slides = this.buildSlides(images);
          var slider = $('<div></div>');
          slider.addClass('flexslider');
          slider.append(slides);

          this.element.append(slider);

          return this;
        },
        flexslider: function() {
          this.element.find('.flexslider').flexslider({
            slideshow: false,
            controlNav: false
          });

          return this;
        },
        /**
         * Takes an array of image objects. Returns li's containing images.
         * @param images
         */
        buildSlides: function(images) {
          var items = images.map(function(item) {
            var li = $('<li></li>');
            li.addClass('cfas--slide');

            var img = $('<div></div>');
            img.addClass('cfas--faux-image');
            img.css('background-image', 'url(' + item.url + ')');
            img.attr('data-width', item.width);
            img.attr('data-height', item.height);
            li.append(img);
            return li;
          });

          var list = $('<ul></ul>');
          list.addClass('slides');
          list.append(items);

          return list;
        },
        setBackgroundSize: function() {
          $('.cfas--slide', this.element).each(function() {
            var image = $(this).find('.cfas--faux-image');
            if (
              image.attr('data-width') < image.width() &&
              image.attr('data-height') < image.height()
            ) {
              image.removeClass('cfas--faux-image--contain');
            } else {
              image.addClass('cfas--faux-image--contain');
            }
          });

          return this;
        },
        handleEventResize: function() {
          $(window).on('resize', this.setBackgroundSize);
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
