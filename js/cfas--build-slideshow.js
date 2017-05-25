(function ($, Drupal, window, document, undefined) {

  Drupal.behaviors.buildSlideshow = {
    attach: function (context, settings) {

      var pluginName = 'flickrAlbumSlideshow';
      var defaults = {
        aspectRatioPercentage: 62.66
      };

      function FlickrAlbumSlideshow(element, options) {
        this.element = $(element);
        this.settings = $.extend({}, defaults, options);
        this.init();
      }

      FlickrAlbumSlideshow.prototype = {
        init: function() {
          var albumUrl = this.element.attr('data-flickr-album');
          this.addLoadingPlaceholder()
            .fetchImages(albumUrl)
            .then(this.handleErrors)
            .then(this.buildSlideshowHTML.bind(this))
            .then(this.flexslider.bind(this))
            .then(this.fadeInSlideshow.bind(this))
            .then(this.removeLoadingPlaceholder.bind(this))
            .then(this.setBackgroundSize.bind(this))
            .then(this.handleEventResize.bind(this));
        },
        addLoadingPlaceholder: function() {
          this.element.css({
            height: this.element.width() * (this.settings.aspectRatioPercentage / 100)
          });

          return this;
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
          var aspectRatio = this.getAspectRatio(images);

          var slides = this.buildSlides(images, aspectRatio);
          var slideshow = $('<div></div>');
          slideshow.addClass('flexslider');
          slideshow.append(slides);

          this.element.append(slideshow);

          return this;
        },
        getAspectRatio: function(images) {
          var aspectRatio;

          if (this.isValidAspectRatio(this.element.data('flickr-aspect-ratio'))) {
            var dims = this.element.data('flickr-aspect-ratio').split('x');
            aspectRatio = dims[1] / dims[0] * 100;
          } else {
            aspectRatio = images[0].height / images[0].width * 100;
          }

          return aspectRatio;
        },
        isValidAspectRatio: function(value) {
          return value.match(/^\d{1}x\d{1}/) !== null;
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
         */
        buildSlides: function(images, aspectRatio) {
          var items = images.map(function(item) {
            var li = $('<li></li>');
            li.css('padding-bottom', aspectRatio + '%');
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
        fadeInSlideshow: function() {
          this.element.addClass('cfas--slideshow-has-loaded');

          return this;
        },
        removeLoadingPlaceholder: function() {
          this.element.css({
            height: ''
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
