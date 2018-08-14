game.GameOverScreen = me.ScreenObject.extend({
    init: function() {
        this.savedData = null;
        this.handler = null;
    },

    onResetEvent: function() {
        //save section
        this.savedData = {
            score: game.data.score,
            steps: game.data.steps
        };

        me.save.add(this.savedData);

        if (!me.save.topSteps) me.save.add({topSteps: game.data.steps});
        if (!me.save.topPressed) me.save.add({topPressed: game.data.pressed});
        if (game.data.steps > me.save.topSteps) {
            me.save.topSteps = game.data.steps;
            me.save.topPressed = game.data.pressed;
            game.data.newHiScore = true;
        }
        //me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        me.input.bindKey(me.input.KEY.SPACE, "enter", false)
        //me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.ENTER);

        this.handler = me.event.subscribe(me.event.KEYDOWN,
            function (action, keyCode, edge) {
                if (action === "enter") {
                    me.state.change(me.state.MENU);
                }
            });

/*        me.game.world.addChild(new me.Sprite(
            me.game.viewport.width/2,
            me.game.viewport.height/2 - 100,
            {image: 'gameover'}
        ), 12);*/

        var gameOverBG = new me.Sprite(
            me.game.viewport.width/2,
            me.game.viewport.height/2,
            {image: 'gameoverbg'}
        );
        var gameOverBG = new me.Sprite(
            me.game.viewport.width/2,
            me.game.viewport.height/2,
            {image: 'gameoverbg'}
        );
        me.game.world.addChild(gameOverBG, 10);

        me.game.world.addChild(new BackgroundLayer('bg', 1));

        // ground
        this.ground1 = me.pool.pull('ground', 0, me.game.viewport.height - 82);
        this.ground2 = me.pool.pull('ground', me.game.viewport.width,
            me.video.renderer.getHeight() - 82);
        me.game.world.addChild(this.ground1, 11);
        me.game.world.addChild(this.ground2, 11);


        this.dialog = new (me.Renderable.extend({
            // constructor
            init: function() {
                this._super(me.Renderable, 'init',
                    [0, 0, me.game.viewport.width/2, me.game.viewport.height/2]
                );
                this.yourScoreFont = new me.Font('gamefont', 20, 'white', 'center');
                this.scoreFont = new me.Font('gamefont', 40, 'white', 'center');
                this.highScoreFont = new me.Font('gamefont', 20, 'white', 'center');
                //this.yourScore = 'Y O U R  S C O R E';
            },


            draw: function (renderer) {
                var stepsText = this.scoreFont.measureText(renderer, game.data.steps.toFixed(2));
                //var topStepsText = this.font.measureText(renderer, this.topSteps);
                //var yourScoreText = this.yourScoreFont.measureText(renderer, this.yourScore);

                //steps
//                this.yourScoreFont.draw(
//                    renderer,
//                    this.yourScore,
//                    me.game.viewport.width/2 + yourScoreText.width/2,
//                    me.game.viewport.height/2
//                );
                this.scoreFont.draw(
                    renderer,
                    game.data.steps.toFixed(2),
                    me.game.viewport.width/2 + stepsText.width/2 + 40,
                    me.game.viewport.height/2 + 50
                );

                this.highScoreFont.draw(
                  renderer,
                  "High score: " +me.save.topSteps.toFixed(2),
                  me.game.viewport.width/2 + stepsText.width,
                  me.game.viewport.height/2 + 120
                )


            }
        }));
        me.game.world.addChild(this.dialog, 12);

        var EnterComp = me.GUI_Object.extend({
          init: function(x, y) {
            var settings = {};
            settings.image = "enter_comp_button";
            settings.spritewidth = 212;
            settings.spriteheight = 34;
            this._super(me.GUI_Object, "init", [x, y, settings]);
          },

          onClick: function(event) {
            console.log("Tweetybird");
            var self = this;
            FB.getLoginStatus(function(response) {
                self.statusChangeCallback(response);
            });
            return false;
          },

          statusChangeCallback: function(response) {
            var self = this;
            if (response.status === 'connected') {
              // Logged into your app and Facebook.
              self.testAPI();
            } else {
              // The person is not logged into your app or we are unable to tell.
              console.log('Please log into this app.');
              FB.login(function(response){
                if (response.status === 'connected') {
                    self.testAPI();
                  } else {
                    console.log("You need to be logged in to submit your score!");
                  }
                });
            }
          },

          testAPI: function() {
            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me?fields=name,email', function(response) {
              console.log('Successful login for: ' + response.name);
              console.log('Thanks for logging in, ' + response.name + '!');
            });
          },

          onOver: function(event) {
            document.body.style.cursor = 'pointer';
          },

          onOut: function(event) {
            document.body.style.cursor = 'auto';
          }


        });

        this.tweet = new EnterComp(620, 400);
        me.game.world.addChild(this.tweet, 14);




        this.restart = new me.pool.pull("restart_button",300, 400);
        me.game.world.addChild(this.restart, 14);

    },

    onDestroyEvent: function() {
        // unregister the event
        me.event.unsubscribe(this.handler);
        //me.input.unbindKey(me.input.KEY.ENTER);
        me.input.unbindKey(me.input.KEY.SPACE);
        //me.input.unbindPointer(me.input.pointer.LEFT);
        this.ground1 = null;
        this.ground2 = null;
        this.font = null;
        this.tweet = null;
        this.restart = null;
        this.gameOverBG = null;

        //me.audio.stop("theme");
    }
});
