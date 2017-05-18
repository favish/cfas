(function ($, Drupal, window) {
  // Init plugin
  CKEDITOR.plugins.add('flickrAlbumSlideshow', {
    init: function(editor) {
      editor.addCommand('flickrAlbumSlideshow', new CKEDITOR.dialogCommand('flickrAlbumSlideshowDialog'));
      editor.ui.addButton('flickrAlbumSlideshow', {
        label: 'Insert Flickr album slideshow',
        command: 'flickrAlbumSlideshow',
        toolbar: 'insert',
        icon: this.path + 'icons/flickr.png'
      });

      CKEDITOR.dialog.add('flickrAlbumSlideshowDialog', this.path + 'dialogs/flickrAlbumSlideshowDialog.js');

      editor.addContentsCss(this.path + '../../css/cfas.css');
      editor.addContentsCss(Drupal.settings.basePath + Drupal.settings.cfas.flexsliderCss);
    }
  });

  // Display preview while editing
  CKEDITOR.on('instanceReady', addSlideshowPreview);

  function addSlideshowPreview(e) {
    var editor = e.editor;
    var $placeholder = $(editor.editable().$).find('[data-flickr-album]');
    var albumId = $placeholder.attr('data-flickr-album');
    Drupal.cfas.fetchAlbumPreview(albumId, editor)
      .then(function() {
        Drupal.attachBehaviors($(editor.editable().$));
      });
  }
})(jQuery, Drupal, this);
