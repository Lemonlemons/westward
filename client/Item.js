/**
 * Created by Jerome Renaux (jerome.renaux@gmail.com) on 29-03-18.
 */
import BattleManager from './BattleManager'
import CustomSprite from './CustomSprite'
import Engine from './Engine'
import Insect from './Insect'
import UI from './UI'
import Utils from '../shared/Utils'
import World from '../shared/World'

import itemsData from '../assets/data/items.json'

var Item = new Phaser.Class({

    Extends: CustomSprite,

    initialize: function Item() {
        CustomSprite.call(this, Engine.scene, 0, 0);
        this.setInteractive();
        this.entityType = 'item';
    },

    setUp: function(data){
        var itemData = itemsData[data.type];
        var atlas = (itemData.envFrames ? 'tileset' : itemData.atlas);
        var frame = (itemData.envFrames ? Utils.randomElement(itemData.envFrames) : itemData.frame);
        this.itemType = data.type;
        this.outFrame = frame;
        this.inFrame = (itemData.envFrames ? frame+'_lit' : frame);

        this.setTexture(atlas);
        this.setFrame(frame);
        this.setVisible(true);

        this.setTilePosition(data.x,data.y,true);
        // this.setOrigin(0.5);
        this.updateDepth();

        if(itemData.collides) {
            this.collides = true;
            Engine.collisions.add(this.tileX,this.tileY);
        }

        this.x += World.tileWidth/2;
        this.y += World.tileHeight/2;
        this.setID(data.id);
        this.name = itemData.name;
        Engine.items[this.id] = this;
        Engine.entityManager.addToDisplayList(this);

        this.manageBehindness();

        if(itemData.insect && Utils.randomInt(1,10) > 8) new Insect(this.x,this.y);
    },

    updateDepth: function(){
        this.setDepth(this.tileY+1.5); // for e.g. when wood spawns on the roots of a tree
    },

    remove: function(){
        CustomSprite.prototype.remove.call(this);
        if(this.collides) Engine.collisions.delete(this.tileX,this.tileY);
        delete Engine.items[this.id];
    },

    manageBehindness: function(){
        if(Engine.overlay.get(this.tileX,this.tileY)){
            this.hollow();
        }else{
            this.unhollow();
        }
    },

    // Overrides the corresponding CustomSprite methods
    hollow: function(){
        if(this.hollowed) return;
        this.hollowed = true;
        this.setDepth(this.tileY + 5);
        this.setTexture('tileset_wh',this.frame.name);
    },

    unhollow: function(){
        if(!this.hollowed) return;
        this.hollowed = false;
        this.updateDepth();
        this.setTexture('tileset',this.frame.name);
    },

    handleClick: function(){
        if(!BattleManager.inBattle) Engine.processItemClick(this);
    },
});

export default Item