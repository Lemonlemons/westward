/**
 * Created by Jerome Renaux (jerome.renaux@gmail.com) on 01-08-18.
 */
import BattleManager from './BattleManager'
import Engine from './Engine'
import Moving from './Moving'
import UI from './UI'
import Utils from '../shared/Utils'

var NPC = new Phaser.Class({

    Extends: Moving,

    initialize: function NPC() {
        Moving.call(this,0,0);
    },

    update: function(data){
        Moving.prototype.update.call(this,data);

        var callbacks = {
            'dead': this.die,
            'path': this.queuePath
        };

        for(var field in callbacks){
            if(!callbacks.hasOwnProperty(field)) continue;
            if(field in data) callbacks[field].call(this,data[field]);
        }
    },


    // ### INPUT ###

    handleClick: function(){
        if(BattleManager.inBattle){
            if(Engine.dead) return;
            BattleManager.processEntityClick(this);
        }else{
            Engine.processNPCClick(this);
        }
    },
});

export default NPC