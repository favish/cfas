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
              id: 'albumUrl',
              label: 'Flickr album URL',
              validate: CKEDITOR.dialog.validate.regex(/https:\/\/www\.flickr\.com\/photos\/\w+\/(albums|sets)\/\d+/, 'A valid Flickr album URL is needed.'),
              setup: function(albumUrl) {
                this.setValue(albumUrl);
              }
            },
            {
              type: 'html',
              html: '<p>Example: https://www.flickr.com/photos/stys19850129/albums/72157679688020814</p>'
            }
          ]
        }
      ],
      onShow: function(e) {
        var selection = editor.getSelection().getStartElement();
        var placeholder = $(selection.$).closest('.cfas--placeholder');
        var albumUrl = placeholder.attr('data-flickr-album');
        this.setupContent(albumUrl);
      },
      onOk: function() {
        var albumUrl = this.getValueOf('tab-basic', 'albumUrl');

        // Remove previous placeholder
        var selection = editor.getSelection().getStartElement();
        var placeholder = $(selection.$).closest('.cfas--placeholder');
        placeholder.remove();

        // Create and add placeholder
        var placeholder = editor.document.createElement('div');
        placeholder.addClass('cfas--placeholder');
        placeholder.setAttribute('data-flickr-album', albumUrl);
        editor.insertElement(placeholder);

        Drupal.cfas.fetchAlbumPreview(albumUrl, editor)
          .then(function() {
            Drupal.attachBehaviors($(editor.editable().$));
          });
      }
    };
  });
})(jQuery, Drupal, this);
