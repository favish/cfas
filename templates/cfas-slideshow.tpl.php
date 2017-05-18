<div class="cfas flexslider">
  <ul class="slides">
  <?php foreach ($images as $image): ?>
    <li>
      <img src="<?php print $image; ?>">
    </li>
  <?php endforeach; ?>
  </ul>
</div>