(function($, Drupal, window) {
  CKEDITOR.dialog.add('cfasShowDialog', function(editor) {
    return {
      title: 'Insert Flickr album slideshow',
      minWidth: 400,
      minHeight: 200,
      contents: [
        {
          id: 'tab-basic',
          label: 'Basic Settings',
          elements: [
            {
              type: 'text',
              id: 'url',
              label: 'Flickr album URL',
              // validate: CKEDITOR.dialog.validate.regex(/https:\/\/www\.flickr\.com\/photos\/\w+\/albums\/\d+/, 'A valid Flickr album URL is needed.'),
              setup: function(url) {
                this.setValue(url);
              }
            },
            {
              type: 'html',
              html: '<p>Example: https://www.flickr.com/photos/user_id_here/albums/album_id_here</p>'
            }
          ]
        }
      ],
      onShow: function(e) {
        var selection = editor.getSelection().getStartElement();
        var placeholder = $(selection.$).closest('.cfas--placeholder');
        var url = placeholder.attr('data-flickr-album');
        this.setupContent(url);
      },
      onOk: function() {
        var url = this.getValueOf('tab-basic', 'url');
        var albumId = url.slice(url.lastIndexOf('/') + 1);

        // Remove previous placeholder
        var selection = editor.getSelection().getStartElement();
        var placeholder = $(selection.$).closest('.cfas--placeholder');
        placeholder.remove();

        // Create and add placeholder
        var placeholder = editor.document.createElement('div');
        placeholder.addClass('cfas--placeholder');
        placeholder.setAttribute('data-flickr-album', albumId);
        editor.insertElement(placeholder);

        Drupal.cfas.fetchAlbumPreview(albumId, editor)
          .then(function() {
            Drupal.attachBehaviors($(editor.editable().$));
          });
      }
    };
  });
})(jQuery, Drupal, this);
