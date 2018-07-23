
/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0
    },


    // Run on page load.
    "onload" : function () {
      // Initialize the video.
      if (!me.video.init(900, 600, {wrapper : "screen", scale : 'auto'})) {
        alert("Your browser does not support HTML5 canvas.");
        return;
      }

      // add "#debug" to the URL to enable the debug Panel
      if (me.game.HASH.debug === true) {
        window.onReady(function () {
            me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
        });
      }

      // Initialize the audio.
      me.audio.init("mp3,ogg");

      // Set a callback to run when loading is complete.
      me.loader.onload = this.loaded.bind(this);

      // Load the resources.
      me.loader.preload(game.resources);

      // Initialize melonJS and display a loading screen.
      me.state.change(me.state.LOADING);
    },

    // Run on game resources loaded.
    "loaded" : function () {
        me.pool.register("player", game.Player);

        //me.state.set(me.state.MENU, new game.TitleScreen());
//        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.GAME_OVER, new game.GameOverScreen());


        // add our player entity in the entity pool
        //me.pool.register("mainPlayer", game.PlayerEntity);

        me.pool.register("clumsy", game.BirdEntity);
        me.pool.register("cabinet", game.PipeEntity, true);
        me.pool.register("light", game.LightEntity, true);
        //me.pool.register("hit", game.HitEntity, true);
        me.pool.register("ground", game.Ground, true);
        me.pool.register("restart_button", game.RestartButton, true);

        me.input.bindKey(me.input.KEY.SPACE, "fly", true);
        //me.input.bindKey(me.input.KEY.M, "mute", true);
        me.input.bindPointer(me.input.KEY.SPACE);

        // Start the game.
        me.state.change(me.state.PLAY);
    }
};
