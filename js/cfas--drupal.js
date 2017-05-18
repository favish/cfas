(function($, Drupal) {
  Drupal.cfas = {
    fetchAlbumPreview: function(albumId, editor) {
      return $.ajax({
        type: "POST",
        url: Drupal.settings.basePath + '/cfas-album',
        data: JSON.stringify({
          album_id: albumId
        })
      })
      .then(function(editor, data) {
        var ed = $(editor.editable().$);
        var placeholder = $('[data-flickr-album="' + albumId + '"]', ed);
        var preview = $('<div></div>');
        preview
          .addClass('cfas--preview')
          .append($(data));
        preview.appendTo(placeholder);
      }.bind(null, editor));
    }
  };
})(jQuery, Drupal);