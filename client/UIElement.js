/**
 * Created by Jerome on 07-10-17.
 */

// Class for icons of the UI tray
var UIElement = new Phaser.Class({

    Extends: CustomSprite,

    initialize: function UIElement (x, y, menu, frame) {
        CustomSprite.call(this, UI.scene, x, y, 'trayicons');
        this.setFrame(frame);

        this.depth = Engine.UIDepth+1;
        this.setScrollFactor(0);
        this.setInteractive();
        this.menu = menu;

        this.on('pointerup',this.handleClick.bind(this));
    },

    handleClick: function(){
        console.log('UIElement handleClick');
        if(this.menu.displayed){
            if(!Engine.inBuilding) this.menu.hide();
        }else {
            this.menu.display();
        }
    },

    display: function(){
        this.setVisible(true);
    },

    hide: function(){
        this.setVisible(false);
    }
});
