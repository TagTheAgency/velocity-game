game.BirdEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = 'clumsy';
        settings.width = 100;
        settings.height = 45;

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.gravity = 0.2;
        this.maxAngleRotation = Number.prototype.degToRad(-30);
        this.maxAngleRotationDown = Number.prototype.degToRad(35);
        this.renderable.addAnimation("flying", [0, 1, 2]);
        this.renderable.addAnimation("idle", [0]);
        this.renderable.setCurrentAnimation("flying");
        //this.renderable.anchorPoint = new me.Vector2d(0.1, 0.5);
        this.body.removeShapeAt(0);
        //this.body.addShape(new me.Ellipse(5, 5, 71, 51));

        //extend a vector!
        this.body.addShape(new me.Polygon(0,0,[new me.Vector2d(-50,25),new me.Vector2d(-50,-25),new me.Vector2d(50,0)]));


        // a tween object for the flying physic effect
        this.flyTween = new me.Tween(this.pos);
        this.flyTween.easing(me.Tween.Easing.Exponential.InOut);

        this.currentAngle = 0;
        this.angleTween = new me.Tween(this);
        this.angleTween.easing(me.Tween.Easing.Exponential.InOut);

        // end animation tween
        this.endTween = null;

        // collision shape
        this.collided = false;

        this.gravityForce = 0.2;
    },

    update: function(dt) {
        var that = this;
        this.pos.x = 60;
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.renderable.currentTransform.identity();
        if (me.input.isKeyPressed('fly')) {
            //me.audio.play('wing');
          /*  this.gravityForce -= 0.2;
            var currentPos = this.pos.y;

            this.angleTween.stop();
            this.flyTween.stop();


            this.flyTween.to({y: currentPos - 72}, 50);
            this.flyTween.start();

            this.angleTween.to({currentAngle: that.maxAngleRotation}, 50).onComplete(function(angle) {
                that.renderable.currentTransform.rotate(that.maxAngleRotation);
            })
            this.angleTween.start();*/

            this.gravityForce -= 2;
            this.pos.y += me.timer.tick * this.gravityForce;
            this.currentAngle -= Number.prototype.degToRad(10);
            if (this.currentAngle <= this.maxAngleRotation) {
                this.renderable.currentTransform.identity();
                this.currentAngle = this.maxAngleRotation;
            }

        } else {
            this.gravityForce += 0.1;
            this.pos.y += me.timer.tick * this.gravityForce;
            this.currentAngle += Number.prototype.degToRad(0.5);
            if (this.currentAngle >= this.maxAngleRotationDown) {
                this.renderable.currentTransform.identity();
                this.currentAngle = this.maxAngleRotationDown;
            }
        }
        this.renderable.currentTransform.rotate(this.currentAngle);
        me.Rect.prototype.updateBounds.apply(this);

        var hitSky = -80; // bird height + 20px
        if (this.pos.y <= hitSky || this.collided) {
            game.data.start = false;
            //me.audio.play("lose");
            this.endAnimation();
            return false;
        }
        me.collision.check(this);
        game.data.steps += .01;
        return true;
    },

    onCollision: function(response) {
        var obj = response.b;
        if (obj.type === 'cabinet' || obj.type === 'light' || obj.type === 'ground') {
            me.device.vibrate(500);
            this.collided = true;
        }
    },

    endAnimation: function() {
        me.game.viewport.fadeOut("#fff", 100);
        var currentPos = this.pos.y;
        this.endTween = new me.Tween(this.pos);
        this.endTween.easing(me.Tween.Easing.Exponential.InOut);

        this.flyTween.stop();
        this.renderable.currentTransform.identity();
        this.renderable.currentTransform.rotate(Number.prototype.degToRad(90));
        var finalPos = me.game.viewport.height - this.renderable.width/2 - 82;
        this.endTween
            .to({y: currentPos}, 1000)
            .to({y: finalPos}, 1000)
            .onComplete(function() {
                me.state.change(me.state.GAME_OVER);
            });
        this.endTween.start();
    }

});


game.PipeEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = this.image = me.loader.getImage('cabinet');
        settings.width = 175;
        settings.height= 1664;
        settings.framewidth = 175;
        settings.frameheight = 1664;

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.gravity = 0;

        var minVel = -5;
        var maxVel = -15;

        var actualVel = game.data.steps / -10;
        console.log("Actual velocity", actualVel);
        actualVel += minVel;
        console.log("Actual velocity", actualVel);

        //this.body.removeShapeAt(0);
        //this.body.addShape(new me.Ellipse(0, 0, 110, 60));

        this.body.vel.set(actualVel, 0);
        this.type = 'cabinet';
    },

    update: function(dt) {
        // mechanics
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (this.pos.x < -this.image.width) {
            me.game.world.removeChild(this);
        }
        me.Rect.prototype.updateBounds.apply(this);
        this._super(me.Entity, 'update', [dt]);
        return true;
    },

});

game.LightEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = this.image = me.loader.getImage('light');
        settings.width = 175;
        settings.height= 800;
        settings.framewidth = 175;
        settings.frameheight = 800;

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.gravity = 0;

        var minVel = -5;
        var maxVel = -15;

        var actualVel = game.data.steps / -10;
        console.log("Actual velocity", actualVel);
        actualVel += minVel;
        console.log("Actual velocity", actualVel);

        //this.body.removeShapeAt(0);
        //this.body.addShape(new me.Ellipse(0, 0, 110, 60));

        this.body.vel.set(actualVel, 0);
        this.type = 'cabinet';
    },

    update: function(dt) {
        // mechanics
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (this.pos.x < -this.image.width) {
            me.game.world.removeChild(this);
        }
        me.Rect.prototype.updateBounds.apply(this);
        this._super(me.Entity, 'update', [dt]);
        return true;
    },

});

game.PipeGenerator = me.Renderable.extend({
    init: function() {
        this._super(me.Renderable, 'init', [0, me.game.viewport.width, me.game.viewport.height, 92]);
        this.alwaysUpdate = true;
        this.generate = 0;
        this.pipeFrequency = 92;
        this.pipeHoleSize = 1340;
        this.posX = me.game.viewport.width;
    },

    update: function(dt) {
        if (this.generate++ % this.pipeFrequency == 0) {
            var posY = Number.prototype.random(200, 400);
//                    me.video.renderer.getHeight() - 100,
//                    800
//            );
            console.log(posY);
            var minHole = -100;
            var hole = (me.game.viewport.height + this.pipeHoleSize) - (game.data.steps*10 || 0);
//            console.log(game.data.steps || 0);
//            console.log("original :", posY, me.game.viewport.height, this.pipeHoleSize, posY - me.game.viewport.height - this.pipeHoleSize);
//            console.log("Calculat :", posY, hole, posY - hole);
//            hole = Math.min(minHole, hole);
//            console.log(hole);
            var posY2 = posY - hole;// me.game.viewport.height - this.pipeHoleSize;
            var obstacle = new me.pool.pull('cabinet', this.posX, posY);

            var obstacle2 = new me.pool.pull('light', this.posX, posY-1000);
            //var pipe2 = new me.pool.pull('pipe', this.posX, posY2);
            //var hitPos = posY - 100;
            //var hit = new me.pool.pull("hit", this.posX, hitPos);
            //pipe1.renderable.currentTransform.scaleY(-1);
            me.game.world.addChild(obstacle, 10);
            me.game.world.addChild(obstacle2, 11);
            //me.game.world.addChild(pipe2, 10);
            //me.game.world.addChild(hit, 11);
        }
        this._super(me.Entity, "update", [dt]);
    },

});

game.TextInput = me.Renderable.extend({
    init : function (x, y, type, length, placeholder) {
        this.$input = $('<input type="' + type + '" required placeholder="' + placeholder + '">').css({
            "left" : x,
            "top" : y
        });

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
    }
});
/*
game.HitEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = this.image = me.loader.getImage('hit');
        settings.width = 148;
        settings.height= 60;
        settings.framewidth = 148;
        settings.frameheight = 60;

        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.gravity = 0;
        this.updateTime = false;
        this.renderable.alpha = 0;
        this.body.accel.set(-5, 0);
        this.body.removeShapeAt(0);
        this.body.addShape(new me.Rect(0, 0, settings.width - 30, settings.height - 30));
        this.type = 'hit';
    },

    update: function(dt) {
        // mechanics
        this.pos.add(this.body.accel);
        if (this.pos.x < -this.image.width) {
            me.game.world.removeChild(this);
        }
        me.Rect.prototype.updateBounds.apply(this);
        this._super(me.Entity, "update", [dt]);
        return true;
    },

}); */

game.Ground = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = me.loader.getImage('ground');
        settings.width = 900;
        settings.height= 82;
        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.gravity = 0;
        this.body.vel.set(-4, 0);
        this.type = 'ground';
    },

    update: function(dt) {
        // mechanics
        this.pos.add(this.body.vel);
        if (this.pos.x < -this.renderable.width) {
            this.pos.x = me.video.renderer.getWidth() - 10;
        }
        me.Rect.prototype.updateBounds.apply(this);
        return this._super(me.Entity, 'update', [dt]);
    },

});
