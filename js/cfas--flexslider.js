(function ($, Drupal, window, document, undefined) {

  Drupal.behaviors.cfasFlexslider = {
    attach: function (context, settings) {
      $('.cfas.flexslider', context).flexslider({
        slideshow: false
      });
    }
  };

})(jQuery, Drupal, this, this.document);
