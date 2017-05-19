(function($, Drupal) {
  Drupal.cfas = {
    fetchAlbumPreview: function(albumUrl, editor) {
      return $.ajax({
        type: "POST",
        url: Drupal.settings.basePath + 'cfas-album',
        data: JSON.stringify({
          album_url: albumUrl
        })
      })
      .then(function(editor, data) {
        var placeholder = $('[data-flickr-album="' + albumUrl + '"]', $(editor.editable().$));
        var preview = $('<div></div>');
        preview
          .addClass('cfas--preview')
          .append($(data));
        preview.appendTo(placeholder);
      }.bind(null, editor));
    }
  };
})(jQuery, Drupal);