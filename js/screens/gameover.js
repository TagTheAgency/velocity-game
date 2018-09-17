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
            me.save.topSeed = game.data.initialSeed;
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

        var self = this;

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

        this.restart = new me.pool.pull("restart_button",300, 400);
        me.game.world.addChild(this.restart, 14);



        var EnterCompNative = me.Renderable.extend({
            init : function (x, y, type, length) {

              var ratio = me.device.getPixelRatio();
              if (ratio > 1) {
                x = (x / ratio);
                y = (y / ratio);
              }
	      var scaledWidth = me.video.renderer.gameWidthZoom;
	      console.log('scaled width is ', scaledWidth);

	      if (scaledWidth != 900) {
		x = x / 900 * scaledWidth;
		y = y / 900 * scaledWidth;
	      }

                this.$input = $('<input type="image" id="enterCompNative" src="data/img/enter_comp_button.png">').css({
                    "left" : x,
                    "top" : y
                });

		var scaledCssWidth = 220 / ratio;
		var scaledCssHeight = 34 / ratio;

		scaledCssWidth = scaledCssWidth / 900 * scaledWidth;
		scaledCssHeight = scaledCssHeight / 900 * scaledWidth;

//                if (ratio > 1) {
                  this.$input.css({"width": scaledCssWidth, "height": scaledCssHeight});
                  //$('.fb-login-button.fb_iframe_widget').css({"left": 529 / ratio, "top": 360 / ratio});
//                }
                this.$input.click(self.submitResults.bind(self));

                //$('.fb-login-button.fb_iframe_widget').css({display:"block"});

                switch (type) {
                case "text":
                    this.$input
                        .attr("maxlength", length)
                        .attr("pattern", "[a-zA-Z0-9_\-]+");
                    break;
                case "number":
                    this.$input.attr("max", length);
                    break;
                }

                $(me.video.getWrapper()).append(this.$input);

            },

            destroy : function () {
                this.$input.remove();
                //$('.fb-login-button.fb_iframe_widget').css({display:'none'});

            }
        });


        this.enterCompNative = new EnterCompNative(514,413);
        me.game.world.addChild(this.enterCompNative, 14);

    },

    submitResults: function() {
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
        self.doSubmitScores();
      } else {
        // The person is not logged into the app or we are unable to tell.
        FB.login(function(response){
          if (response.status === 'connected') {
              self.doSubmitScores();
            } else {
              alert("You need to be logged in to facebook to submit your score!");
            }
          });
      }
    },

    doSubmitScores: function() {
      FB.api('/me?fields=id,name,email', function(response) {
        $.ajax({
          type: "POST",
          url: '/app/ZWaMvOqy/enter',
          data: {name:response.name, email:response.email, personid: response.id, seed: me.save.topSeed, data:JSON.stringify(me.save.topPressed), score: me.save.topSteps},
          success: function(r) {
            alert('Your high score has been submitted, good luck!');
          },
          error: function() {
            alert('Sorry, there was an error submitting your score!');
          }
        });


      });
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
