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
              type: 'radio',
              id: 'aspectRatio',
              label: 'Aspect ratio',
              items: [
                ['Auto-detect from first image', 'auto'],
                ['4:3'],
                ['3:2'],
                ['1:1'],
              ],
              'default': 'auto',
              setup: function(placeholder) {
                if (typeof placeholder.attr('data-flickr-aspect-ratio') !== 'undefined') {
                  this.setValue(placeholder.attr('data-flickr-aspect-ratio'));
                }
              }
            },
            {
              type: 'text',
              id: 'albumUrl',
              label: 'Flickr album URL',
              validate: CKEDITOR.dialog.validate.regex(/https:\/\/www\.flickr\.com\/photos\/([^\/]+)\/(?:albums|sets)\/(\d+)/, 'A valid Flickr album URL is needed.'),
              setup: function(placeholder) {
                this.setValue(placeholder.attr('data-flickr-album'));
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
        var placeholder = $(selection.$).closest('.cfas');
        this.setupContent(placeholder);
      },
      onOk: function() {
        var aspectRatio = this.getValueOf('tab-basic', 'aspectRatio');
        var albumUrl = this.getValueOf('tab-basic', 'albumUrl');

        // Remove previous placeholder
        var selection = editor.getSelection().getStartElement();
        var placeholder = $(selection.$).closest('.cfas');
        placeholder.remove();

        // Create and add new placeholder
        var placeholder = editor.document.createElement('div');
        placeholder.addClass('cfas');
        placeholder
          .setAttribute('data-flickr-aspect-ratio', aspectRatio)
          .setAttribute('data-flickr-album', albumUrl);
        editor.insertElement(placeholder);
      }
    };
  });
})(jQuery, Drupal, this);
