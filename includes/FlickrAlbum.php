<?php

class FlickrAlbum {

  protected $api_key = 'fa1dc769264e08b3270da7a03d26b277';

  protected $album_url;

  protected $time_limit = 300;

  public function __construct($api_key, $album_url) {
    $this->api_key = $api_key;
    $this->album_url = $album_url;
  }

  /**
   * Load current album from database.
   * @return array with keys album_url, created, images
   */
  public function getAlbum() {
    return db_select('cfas_albums', 'cfas')
      ->fields('cfas', array('album_url', 'created', 'images'))
      ->condition('album_url', $this->album_url)
      ->condition('created', time() - $this->time_limit, '>')
      ->execute()
      ->fetchAssoc();
  }

  /**
   * Execute request to Flickr API for album.
   */
  public function fetchAlbum() {
    $query_params = array(
      'api_key' => $this->api_key,
      'method' => 'flickr.photosets.getPhotos',
      'photoset_id' => array_pop(explode('/', $this->album_url)),
      'format' => 'json',
      'nojsoncallback' => 1,
      'extras' => 'url_o'
    );

    $url = array_reduce(
      array_keys($query_params),
      function($carry, $key) use ($query_params) {
        return $carry . '&' . $key . '=' . $query_params[$key];
      },
      'https://api.flickr.com/services/rest/?'
    );

    $curl = curl_init();
    curl_setopt_array($curl, array(
      CURLOPT_RETURNTRANSFER => 1,
      CURLOPT_URL => $url,
      CURLOPT_CONNECTTIMEOUT => 5,
      CURLOPT_TIMEOUT => 5
    ));
    $resp = curl_exec($curl);
    curl_close($curl);

    $decoded_resp = json_decode($resp);

    // Handle invalid responses. Don't save anything to the database. Just return error message.
    if (
      isset($decoded_resp->stat) &&
      $decoded_resp->stat === 'fail'
    ) {
      return (array) $decoded_resp;
    }

    // Handle valid response
    $images = array_map(function($item) {
      return $item->url_m;
    }, $decoded_resp->photoset->photo);

    $album = array(
      'album_url' => $this->album_url,
      'created' => time(),
      'images' => serialize($images)
    );

    // Save to database
    $this->upsertAlbum($album);

    return $album;
  }

  protected function upsertAlbum($album) {
    // Add to db. Use replace for both insert and update
    db_merge('cfas_albums')
      ->key(array('album_url' => $this->album_url))
      ->fields($album)
      ->execute();
  }
}