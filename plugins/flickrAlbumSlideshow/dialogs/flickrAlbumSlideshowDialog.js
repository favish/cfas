(function($, Drupal, window) {
  CKEDITOR.dialog.add('cfasShowDialog', function(editor) {
    return {
      title: 'Insert Flickr album slideshow',
      minWidth: 300,
      minHeight: 200,
      contents: [
        {
          id: 'tab-basic',
          label: 'Basic Settings',
          elements: [
            {
              type: 'text',
              id: 'title',
              label: 'Album title',
              setup: function(container) {
                this.setValue(container.find('h2').text());
              }
            },
            {
              type: 'text',
              id: 'albumUrl',
              label: 'Flickr album URL',
              validate: CKEDITOR.dialog.validate.regex(/https:\/\/www\.flickr\.com\/photos\/([^\/]+)\/(?:albums|sets)\/(\d+)/, 'A valid Flickr album URL is needed.'),
              setup: function(container) {
                var iframeSrc = container.find('iframe').attr('src');
                if (typeof iframeSrc === 'undefined') { return; }

                var matches = iframeSrc.match(/https:\/\/www\.flickr\.com\/([^\/]+)\/albums\/(\d+)\/player/);
                var albumUrl = 'https://www.flickr.com/photos/' + matches[1] + '/albums/' + matches[2];
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
        var container = $(selection.$).closest('.cfas');
        this.setupContent(container);
      },
      onOk: function() {
        var albumUrl = this.getValueOf('tab-basic', 'albumUrl');
        var matches = albumUrl.match(/https:\/\/www\.flickr\.com\/photos\/([^\/]+)\/(?:albums|sets)\/(\d+)/);

        // Create container
        var container = editor.document.createElement('div');
        container.addClass('cfas');
        container.setAttribute('contenteditable', 'false');

        // Create title
        var title = editor.document.createElement('h2');
        title.setText(this.getValueOf('tab-basic', 'title'));

        // Create iframe
        var iframe = editor.document.createElement('iframe');
        iframe.setAttribute('src', 'https://www.flickr.com/' + matches[1] + '/albums/' + matches[2] + '/player/');
        iframe.setAttribute('frameborder', 0);
        iframe.setAttribute('data-footer', 'true');
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('webkitallowfullscreen', 'true');
        iframe.setAttribute('mozallowfullscreen', 'true');
        iframe.setAttribute('oallowfullscreen', 'true');
        iframe.setAttribute('msallowfullscreen', 'true');

        container.append(title);
        container.append(iframe);

        editor.insertElement(container);
      }
    };
  });
})(jQuery, Drupal, this);
