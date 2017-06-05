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
              validate: CKEDITOR.dialog.validate.regex(/https:\/\/www\.flickr\.com\/photos\/([^\/]+)\/(?:albums|sets)\/(\d+)/, 'A valid Flickr album URL is needed.'),
              setup: function(placeholder) {
                this.setValue(placeholder.attr('data-flickr-album'));
              }
            },
            {
              type: 'html',
              html: '<p class="cfas--example-url">Example: https://www.flickr.com/photos/stys19850129/albums/72157679688020814</p>'
            },
            {
              type: 'select',
              id: 'aspectRatio',
              label: 'Aspect ratio',
              items: [
                ['Auto-detect', 'auto'],
                ['4:3', '4x3'],
                ['3:2', '3x2'],
                ['1:1', '1x1'],
              ],
              'default': 'auto',
              setup: function(placeholder) {
                if (typeof placeholder.attr('data-flickr-aspect-ratio') !== 'undefined') {
                  this.setValue(placeholder.attr('data-flickr-aspect-ratio'));
                }
              }
            },
          ]
        }
      ],
      onShow: function(e) {
        var selection = editor.getSelection().getStartElement();
        var placeholder = $(selection.$).closest('.cfas');
        this.setupContent(placeholder);
      },
      onOk: function() {
        var albumUrl = this.getValueOf('tab-basic', 'albumUrl');
        var aspectRatio = this.getValueOf('tab-basic', 'aspectRatio');

        // Remove previous placeholder
        var selection = editor.getSelection().getStartElement();
        var oldPlaceholder = $(selection.$).closest('.cfas');
        oldPlaceholder.remove();

        // Create and add new placeholder
        var newPlaceholder = editor.document.createElement('div');
        newPlaceholder.addClass('cfas');
        newPlaceholder
          .setAttribute('data-flickr-album', albumUrl)
          .setAttribute('data-flickr-aspect-ratio', aspectRatio);
        editor.insertElement(newPlaceholder);
      }
    };
  });
})(jQuery, Drupal, this);
