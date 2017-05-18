(function ($, Drupal, window, document, undefined) {

  Drupal.behaviors.cfasFormSubmit = {
    attach: function (context, settings) {
      // On entity save, strip out preview slideshow so that only placeholder is saved
      $('.form-submit', context).on('click', function() {
        for (var name in CKEDITOR.instances) {
          var editor = $(CKEDITOR.instances[name].editable().$);
          $('.cfas--preview', editor).remove();
        }
      });
    }
  };

})(jQuery, Drupal, this, this.document);
