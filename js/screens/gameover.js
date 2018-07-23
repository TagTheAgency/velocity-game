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
        if (game.data.steps > me.save.topSteps) {
            me.save.topSteps = game.data.steps;
            game.data.newHiScore = true;
        }
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        //me.input.bindKey(me.input.KEY.SPACE, "enter", false)
        me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.ENTER);

        //this.handler = me.event.subscribe(me.event.KEYDOWN,
        //    function (action, keyCode, edge) {
        //        if (action === "enter") {
        //            me.state.change(me.state.MENU);
        //        }
        //    });

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
                    me.game.viewport.width/2 + stepsText.width/2,
                    me.game.viewport.height/2 + 50
                );

                this.scoreFont.draw(
                  renderer,
                  "High score:" +me.save.topSteps.toFixed(2),
                  me.game.viewport.width/2 + stepsText.width/2,
                  me.game.viewport.height/2 + 100
                )


            }
        }));
        me.game.world.addChild(this.dialog, 12);

        var Tweet = me.GUI_Object.extend({
          init: function(x, y) {
            var settings = {};
            settings.image = "player";
            settings.spritewidth = 152;
            settings.spriteheight = 75;
            this._super(me.GUI_Object, "init", [x, y, settings]);
          },

          onClick: function(event) {
            console.log("Tweetybird");
            FB.getLoginStatus(function(response) {
                statusChangeCallback(response);
            });
            return false;
          },

          onOver: function(event) {
            console.log("over", event);
          },

          onOut: function(event) {
            console.log("out", event);
          }

        });

        this.tweet = new Tweet(200, 100);
        me.game.world.addChild(this.tweet, 14);




        this.restart = new me.pool.pull("restart_button",300, 400);
        me.game.world.addChild(this.restart, 14);

    },

    onDestroyEvent: function() {
        // unregister the event
        //me.event.unsubscribe(this.handler);
        //me.input.unbindKey(me.input.KEY.ENTER);
        //me.input.unbindKey(me.input.KEY.SPACE);
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
