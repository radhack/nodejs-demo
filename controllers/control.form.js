var hellosign = require('hellosign-sdk')({key: config.hellosignKey});
var ColorThief = require('color-thief');
var tinycolor = require('tinycolor2');
var request = require('request');
var contrast = require('wcag-contrast');
var fs = require('fs');

module.exports = {

    getColors: function(uri){

        var colorThief = new ColorThief();

        var palette = colorThief.getPalette(uri);

        var colors = [];

        //Convert colors to hexstring
        palette.map(function(c){
            var tc = tinycolor("rgb ("+c[0]+","+c[1]+","+c[2]+")");
            colors.push(tc.toHexString())
        });

        var selected = {
            primary:colors[0]
        };

        //Select first 'dark' color in palette generated from image
        for(var i=0;i<colors.length;i++){
            if(tinycolor(colors[i]).isDark()){
                selected.primary=colors[i];
                break;
            }
        }

        selected.dark = '#ffffff';

        return selected;

    },


    getContentBackground: function(color){

        var tc = tinycolor(color);

        while (tc.getLuminance() < 0.995) {
            if(tc.getLuminance() > 0.95){
                tc = tc.brighten(1);
            }else{
                tc = tc.brighten(5);
            }
        }

        return tc.toHexString();

    },

    createNewApp: function(data, cb){

        var bcolor = data.primaryColor;
        var tcolor = '#FFFFFF';

        var blight = '#F7F8F9';

        while(contrast.hex(bcolor,blight) < 2.1){
            bcolor = tinycolor(bcolor).darken(1).toString();
        }

        while(contrast.hex(bcolor,'#FFFFFF') < 2.1){
            bcolor = tinycolor(bcolor).darken(1).toString();
        }

        while(contrast.hex(bcolor,'#FFFFFF') < 2.1){
            bcolor = tinycolor(bcolor).darken(1).toString();
        }

        while(contrast.hex(bcolor,tcolor) < 2.1){
            tcolor = tinycolor(tcolor).darken(1).toString();
        }

        var wlabel = {
            "page_background_color": '#F6F6F6',
            "header_background_color": '#FFFFFF',
            "text_color1": '#808080',
            "text_color2": '#808080',
            "link_color": '#00B3E6',
            "primary_button_color": bcolor,
            "primary_button_text_color": tcolor,
            "primary_button_color_hover": bcolor,
            "primary_button_text_color_hover": tcolor,
            "secondary_button_color": data.primaryColor,
            "secondary_button_text_color": '#FFFFFF',
            "secondary_button_color_hover": data.primaryColor,
            "secondary_button_text_color_hover": '#FFFFFF'
        };

        var options = {
            name: data.company,
            test_mode:1,
            domain: 'demo.hellosign.com',
            callback_url: 'http://demo.hellosign.com/callback',
            white_labeling_options: JSON.stringify(wlabel)
        };

        if(data.logo.match('img')){
            options['white_labeling_options'] = "";
        }else{
            options.custom_logo_file = fs.createReadStream(rootpath+'/'+data.logo);
        }

        var multipart = [];
        var ks = Object.keys(options);
        ks.map(function(k){
            var obj = {};
            obj[k]=options[k];
            multipart.push(obj)
        });

        request({
            method: 'POST',
            uri: 'https://api.hellosign.com/v3/api_app',
            auth: {
                'user': config.hellosignKey,
                'pass': ''
            },
            formData:options
        }, function (error, response, body) {
            if(error){
                console.log(error)
            }else{
                var dat = JSON.parse(body);
                console.log(body);
                cb(dat);
            }
        });
    }

};
