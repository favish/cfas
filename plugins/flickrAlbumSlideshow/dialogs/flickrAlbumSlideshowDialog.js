(function($, Drupal, window) {
  CKEDITOR.dialog.add('flickrAlbumSlideshowDialog', function(editor) {
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
              validate: CKEDITOR.dialog.validate.regex(/https:\/\/www\.flickr\.com\/photos\/columbiabusinessschool\/albums\/(\d+)/, 'A valid Flickr album URL is needed.'),
            },
            {
              type: 'html',
              html: '<p>Example: https://www.flickr.com/photos/columbiabusinessschool/albums/72157629787441791</p>'
            }
          ]
        }
      ],
      onOk: function() {
        var url = this.getValueOf('tab-basic', 'url');
        var albumId = url.slice(url.lastIndexOf('/') + 1);

        // Create and add placeholder
        var placeholder = editor.document.createElement('div');
        placeholder.addClass('cfas--placeholder');
        placeholder.setAttribute('data-flickr-album', albumId);
        editor.insertElement(placeholder);

        Drupal.cfas.fetchAlbumPreview(albumId, editor);
      }
    };
  });
})(jQuery, Drupal, this);
