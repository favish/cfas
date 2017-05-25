(function ($, Drupal, window) {
  // Init plugin
  CKEDITOR.plugins.add('flickrAlbumSlideshow', {
    init: function(editor) {
      // Add command
      editor.addCommand('cfasAddSlideshow', new CKEDITOR.dialogCommand('cfasShowDialog'));
      editor.ui.addButton('flickrAlbumSlideshow', {
        label: 'Insert Flickr album slideshow',
        command: 'cfasAddSlideshow',
        toolbar: 'insert',
        icon: this.path + 'icons/flickr.png'
      });

      // Dialog definition
      CKEDITOR.dialog.add('cfasShowDialog', this.path + 'dialogs/flickrAlbumSlideshowDialog.js');

      // Remove command
      editor.addCommand('cfasRemoveSlideshow', {
        exec: function(editor) {
          var selection = editor.getSelection().getStartElement();
          var placeholder = $(selection.$).closest('.cfas');
          placeholder.remove();
        }
      });

      // Register the menu items
      if (editor.addMenuItem) {
        editor.addMenuGroup('cfasGroup');
        editor.addMenuItems( {
          cfasEdit: {
            label: 'Edit Flickr album slideshow',
            command: 'cfasAddSlideshow',
            group: 'cfasGroup',
            icon: this.path + 'icons/flickr.png'
          },
          cfasRemove: {
            label: 'Remove Flickr album slideshow',
            command: 'cfasRemoveSlideshow',
            group: 'cfasGroup',
            icon: this.path + 'icons/flickr.png'
          }
        });
      }

      if (editor.contextMenu) {
        editor.contextMenu.addListener(function(element, selection) {
          var placeholder = $(element.$).closest('.cfas');

          if (placeholder.length) {
            return {
              cfasEdit: CKEDITOR.TRISTATE_ON,
              cfasRemove: CKEDITOR.TRISTATE_ON
            };
          }
        });
      }

      // Add additional stylesheets
      editor.addContentsCss(this.path + '../../css/cfas.css');
      // editor.addContentsCss(Drupal.settings.basePath + Drupal.settings.cfas.flexsliderCss);
      editor.addContentsCss(Drupal.settings.basePath + '/modules/system/system.messages.css');
    }
  });

  // Display preview while editing
  // CKEDITOR.on('instanceReady', addSlideshowPreview);

  // function addSlideshowPreview(e) {
  //   var editor = e.editor;
  //   var $placeholder = $(editor.editable().$).find('[data-flickr-album]');
  //   $placeholder.each(function() {
  //     var albumUrl = $(this).attr('data-flickr-album');
  //     Drupal.cfas.fetchAlbumPreview(albumUrl, editor)
  //       .then(function() {
  //         Drupal.attachBehaviors($(editor.editable().$));
  //       });
  //   });
  // }
})(jQuery, Drupal, this);
