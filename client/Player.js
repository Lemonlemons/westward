/**
 * Created by Jerome on 04-10-17.
 */
import BattleManager from './BattleManager'
import Engine from './Engine'
import Moving from './Moving'

var Player = new Phaser.Class({

    Extends: Moving,

    initialize: function Player() {
        // Using call(), the called method will be executed while having 'this' pointing to the first argumentof call()
        Moving.call(this);

        this.entityType = 'player';

        this.setTexture('hero');
        this.setOrigin(0.2, 0.5);
        this.firstUpdate = true;

        this.animPrefix = 'player';
        this.footprintsFrame = 0;
        this.printsVertOffset = 10;

        // this.setFrame(this.restingFrames.down);
        this.faceOrientation();
        this.cellsWidth = 1;
        this.cellsHeight = 1;

        this.destinationAction = null;

        this.flipPrint = false;

        this.battleBoxData = {
            'atlas':'faces',
            'frame':0
        }
    },

    setUp: function (data) {
        this.id = data.id || 0;
        Engine.players[this.id] = this;
        Engine.entityManager.addToDisplayList(this);
        this.setVisible(true);
        // this.setInteractive();

        this.name = 'Player ' + this.id;
        this.setPosition(data.x, data.y);
        this.updateBubblePosition();
    },

    update: function (data) {
        console.log('updating player');
        Moving.prototype.update.call(this, data);
        if (data.x >= 0 && data.y >= 0) this.teleport(data.x, data.y);

        var callbacks = {
            'dead': this.processDeath,
            'inBuilding': this.processBuilding,
            'path': this.processPath
        };

        for (var field in callbacks) {
            if (!callbacks.hasOwnProperty(field)) continue;
            if (field in data) callbacks[field].call(this, data[field]);
        }

        this.firstUpdate = false;
    },
 
    remove: function () {
        CustomSprite.prototype.remove.call(this);
        delete Engine.players[this.id];
    },

    die: function (showAnim) {
        if (this.bubble) this.bubble.hide();
        if (showAnim) {
            this.play(this.animPrefix + '_death');
        } else {
            this.setVisible(false);
        }
    },

    respawn: function () {
        //Engine.deathAnimation(this);
        this.setVisible(true);
    },

    endMovement: function () {
        Moving.prototype.endMovement.call(this);
        if (BattleManager.inBattle) BattleManager.onEndOfMovement();
        if (this.isHero) {
            var da = this.destinationAction;
            if (da && da.type == 1) {
                var dx = Math.abs(da.x - this.tileX);
                var dy = Math.abs(da.y - this.tileY);
                if (dx <= 1 && dy <= 1) {
                    Engine.enterBuilding(da.id);
                    this.setOrientation('up');
                    this.faceOrientation();
                }
            }

        }
    },

    // ### SETTERS ####

    processBuilding: function (inBuilding) {
        if (inBuilding > -1) {
            if (!this.isHero) this.setVisible(false);
            this.inBuilding = inBuilding;
        }
        if (inBuilding == -1) {
            this.orientation = 'down';
            this.faceOrientation();
            if (!this.isHero) this.setVisible(true);
            this.inBuilding = inBuilding;
        }
    },

    processDeath: function (dead) {
        if (dead == true) this.die(!this.firstUpdate);
        if (dead == false) this.respawn();
    },

    processMeleeAttack: function (facing) {
        this.setOrientation(facing);
        this.play(this.animPrefix + '_attack_' + this.orientation);
    },

    processPath: function (path) {
        //if(!this.isHero) this.move(path);
        if (!this.isHero) this.queuePath(path);
    },

    processBombThrow: function (data) { // TODO: move up to NPC if they'll throw bombs
        this.setOrientation({x: data.x, y: data.y});
        this.play(this.animPrefix + '_attack_' + this.orientation);
        var from = {
            x: this.x,
            y: this.y - 10
        };
        Engine.displayBomb(from, {x: data.x, y: data.y}, this.depth + 1, data.duration, data.delay);
    },

    setDestinationAction: function (type, id, x, y) {
        // TODO: centralize somewhere
        // 1 = enter building, 2 = skin, 3 = pick item, 4 = civ-related
        //console.log('setting to',type,id);
        if (type == 0) {
            this.destinationAction = null;
            return;
        }
        this.destinationAction = {
            type: type,
            id: id,
            x: x,
            y: y
        };
    },

    // ### GETTERS ####

    getTilePosition: function () {
        return {
            x: this.tileX,
            y: this.tileY
        }
    },

    getShortID: function () {
        return 'P' + this.id;
    }
});

export default Player