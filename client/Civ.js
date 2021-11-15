/**
 * Created by Jerome Renaux (jerome.renaux@gmail.com) on 18-06-18.
 */
import CustomSprite from './CustomSprite'
import Engine from './Engine'
import NPC from './NPC'

import civsData from '../assets/data/civs.json'

var Civ = new Phaser.Class({

    Extends: NPC,

    initialize: function Civ() {
        NPC.call(this);
        this.entityType = 'civ';
    },

    setUp: function(data){
        var civData = civsData[data.type];
        this.id = data.id;

        Engine.civs[this.id] = this;
        Engine.entityManager.addToDisplayList(this);

        this.cellsWidth = civData.width || 1;
        this.cellsHeight = civData.height || 1;

        this.setPosition(data.x,data.y);
        this.setTexture('enemy');
        this.deathFrame = 265;
        // this.setFrame(this.restingFrames.right,false,false);
        this.setOrigin(0.2,0.5);

        this.battleBoxData = {
            'atlas': 'faces',
            'frame': 2
        };

        var shape = new Phaser.Geom.Polygon([20,15,50,15,50, 60, 20, 60]);
        this.setInteractive(shape, Phaser.Geom.Polygon.Contains);

        this.setVisible(true);
        this.dead = false;
        this.name = civData.name;//'Civ'; //'מִ  ת  נַ  גֵ  ד'

        this.animPrefix = 'enemy';
        this.faceOrientation();
        this.footprintsFrame = 0;
        this.printsVertOffset = 10;
    },

    processMeleeAttack: function(facing){
        this.computeOrientation(this.tileX,this.tileY,facing.x,facing.y);
        this.faceOrientation();
        this.play(this.animPrefix+'_attack_'+this.orientation);
    },

    getShortID: function(){
        return 'C'+this.id;
    },

    remove: function(){
        //console.log('remove ',this.id,'(',this.tileX,',',this.tileY,',',this.chunk,',)');
        CustomSprite.prototype.remove.call(this);
        delete Engine.civs[this.id];
    },

    die: function(){
        this.setFrame(this.deathFrame,false,false);
        this.dead = true;
    }
});

export default Civ