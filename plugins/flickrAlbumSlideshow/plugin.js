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
        icon: this.path + '../../images/flickr-logo-black.png'
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
            icon: this.path + '../../images/flickr-logo-black.png'
          },
          cfasRemove: {
            label: 'Remove Flickr album slideshow',
            command: 'cfasRemoveSlideshow',
            group: 'cfasGroup',
            icon: this.path + '../../images/flickr-logo-black.png'
          }
        });
      }

      if (editor.contextMenu) {
        editor.contextMenu.addListener(function(element, selection) {
          var placeholder = $(element.$).closest('.cfas');

          if (container.length) {
            return {
              cfasEdit: CKEDITOR.TRISTATE_ON,
              cfasRemove: CKEDITOR.TRISTATE_ON
            };
          }
        });
      }

      // Add additional stylesheets
      editor.addContentsCss(this.path + '../../css/cfas.css');
    }
  });
})(jQuery, Drupal, this);
