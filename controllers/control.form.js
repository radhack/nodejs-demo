var hellosign = require('hellosign-sdk')({key: config.hellosignKey});
var ColorThief = require('color-thief');
var tinycolor = require('tinycolor2');
var request = require('request');
var contrast = require('wcag-contrast');

module.exports = {

    getColors: function(uri){

        var colorThief = new ColorThief();

        var palette = colorThief.getPalette(uri);

        var colors = [];

        palette.map(function(c){
            var tc = tinycolor("rgb ("+c[0]+","+c[1]+","+c[2]+")");
            colors.push(tc.toHexString())
        });

        var selected = {
            primary:colors[0]
        };

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

        //if(tc.luminance>=0.9){
        //    return '#fff';
        //}else {
        while (tc.getLuminance() < 0.995) {
            if(tc.getLuminance() > 0.95){
                tc = tc.brighten(1);
            }else{
                tc = tc.brighten(5);
            }
        }
        return tc.toHexString();
        //}

    },

    createNewApp: function(data, cb){

        var bcolor = '#FFFFFF';
        var tcolor = '#FFFFFF';

        var blight = '#F7F8F9';

        while(contrast.hex(bcolor,blight) < 2.1){
            bcolor = tinycolor(bcolor).darken(1).toString();
        }

        while(contrast.hex(bcolor,data.primaryColor) < 2.1){
            bcolor = tinycolor(bcolor).darken(1).toString();
        }

        while(contrast.hex(bcolor,data.primaryColor) < 2.1){
            bcolor = tinycolor(bcolor).darken(1).toString();
        }

        while(contrast.hex(bcolor,tcolor) < 2.1){
            tcolor = tinycolor(tcolor).darken(1).toString();
        }

        var wlabel = {
            "page_background_color": '#F6F6F6',
            "header_background_color": data.primaryColor,
            "text_color1": '#808080',
            "text_color2": '#FFFFFF',
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
            domain: 'hellosigndemo.finsweet.com',
            callback_url: 'http://hellosigndemo.finsweet.com/callback',
            white_labeling_options: JSON.stringify(wlabel)
        };

        console.log(options);

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

        /*hellosign.apiApp.create(options)
         .then(function(response){
         console.log(response);
         cb(response);
         })
         .catch(function(err){
         hellosign.apiApp.create(options)
         .then(function(response){
         console.log(response);
         cb(response);
         })
         .catch(function(err) {
         console.log(err);
         })
         })*/

    }

};