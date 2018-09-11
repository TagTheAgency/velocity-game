<?php
/*
Plugin Name:  Velocity Recruitment 10th Anniversary
Plugin URI:   https://tagtheagency.com/
Description:  10th Anniversary Game
Version:      20180913
Author:       tagtheagency.com
Author URI:   https://tagtheagency.com/
License:      Commercial
*/

add_shortcode( 'velocity_game', 'insert_velocity_game' );

function insert_velocity_game() {
  wp_enqueue_script( 'melonjs', plugins_url( 'lib/melonjs.js', __FILE__ ), array(), '1.0.0', 'all' );
  wp_enqueue_script( 'game', plugins_url( 'js/game.js', __FILE__ ), array(), '1.0.0', 'all' );
  wp_enqueue_script( 'gameResources', plugins_url( 'build/js/resources.js', __FILE__ ), array(), '1.0.0', 'all' );
  wp_enqueue_script( 'gameEntities', plugins_url( 'js/entities/entities.js', __FILE__ ), array(), '1.0.0', 'all' );
  wp_enqueue_script( 'gameHUD', plugins_url( 'js/entities/HUD.js', __FILE__ ), array(), '1.0.0', 'all' );
  wp_enqueue_script( 'gameTitle', plugins_url( 'js/screens/title.js', __FILE__ ), array(), '1.0.0', 'all' );
  wp_enqueue_script( 'gamePlay', plugins_url( 'js/screens/play.js', __FILE__ ), array(), '1.0.0', 'all' );
  wp_enqueue_script( 'gameGameover', plugins_url( 'js/screens/gameover.js', __FILE__ ), array(), '1.0.0', 'all' );
  wp_enqueue_script( 'gameResources2', plugins_url( 'js/resources.js', __FILE__ ), array(), '1.0.0', 'all' );
  wp_enqueue_script( 'gamePlayer', plugins_url( 'js/player.js', __FILE__ ), array(), '1.0.0', 'all' );
  // rest of code here...

  return  '<div id="screen"><div class="fb-login-button" data-max-rows="1" data-size="medium" data-button-type="continue_with" data-show-faces="false" data-auto-logout-link="true" data-use-continue-as="false"></div></div>';
}
