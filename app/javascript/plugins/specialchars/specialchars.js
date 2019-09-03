(function() {
    ArticleEditor.add('plugin', 'specialchars', {
        translations: {
            en: {
                "specialchars": {
                    "special-chars": "Special Characters"
                }
            }
        },
        defaults: {
            icon: '<svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m2 15v-1.975976h2.52252252v-.0840841c-1.05105105-1.051051-2.22822823-2.8798798-2.22822823-5.38138134 0-3.84684685 2.41741742-6.55855856 6.07507508-6.55855856 3.63663663 0 6.05405403 2.71171171 6.05405403 6.55855856 0 2.50150154-1.1771772 4.33033034-2.2282282 5.38138134v.0840841h2.5225225v1.975976h-5.25525524v-1.7657658c1.49249254-1.2822822 2.45945944-2.9639639 2.45945944-5.46546543 0-2.69069069-1.3243243-4.64564565-3.55255253-4.64564565s-3.57357357 1.95495496-3.57357357 4.64564565c0 2.50150153.96696696 4.18318323 2.45945946 5.46546543v1.7657658z"/></svg>',
            items: [
                '&lsquo;', '&rsquo;', '&ldquo;', '&rdquo;', '&ndash;', '&mdash;', '&divide;', '&hellip;', '&trade;', '&bull;',
            	'&rarr;', '&asymp;', '$', '&euro;', '&cent;', '&pound;', '&yen;', '&iexcl;',
            	'&curren;', '&brvbar;', '&sect;', '&uml;', '&copy;', '&ordf;', '&laquo;', '&raquo;', '&not;', '&reg;', '&macr;',
            	'&deg;', '&sup1;', '&sup2;', '&sup3;', '&acute;', '&micro;', '&para;', '&middot;', '&cedil;',  '&ordm;',
            	'&frac14;', '&frac12;', '&frac34;', '&iquest;', '&Agrave;', '&Aacute;', '&Acirc;', '&Atilde;', '&Auml;', '&Aring;',
            	'&AElig;', '&Ccedil;', '&Egrave;', '&Eacute;', '&Ecirc;', '&Euml;', '&Igrave;', '&Iacute;', '&Icirc;', '&Iuml;',
            	'&ETH;', '&Ntilde;', '&Ograve;', '&Oacute;', '&Ocirc;', '&Otilde;', '&Ouml;', '&times;', '&Oslash;', '&Ugrave;',
            	'&Uacute;', '&Ucirc;', '&Uuml;', '&Yacute;', '&THORN;', '&szlig;', '&agrave;', '&aacute;', '&acirc;', '&atilde;',
            	'&auml;', '&aring;', '&aelig;', '&ccedil;', '&egrave;', '&eacute;', '&ecirc;', '&euml;', '&igrave;', '&iacute;',
            	'&icirc;', '&iuml;', '&eth;', '&ntilde;', '&ograve;', '&oacute;', '&ocirc;', '&otilde;', '&ouml;',
            	'&oslash;', '&ugrave;', '&uacute;', '&ucirc;', '&uuml;', '&yacute;', '&thorn;', '&yuml;', '&OElig;', '&oelig;',
            	'&#372;', '&#374', '&#373', '&#375;'
            ]
        },
        init: function() {
            // services
            this.insertion = this.app.create('insertion');
        },
        start: function() {
            this.app.toolbar.add('specialchars', {
                title: '## specialchars.special-chars ##',
                icon: this.opts.specialchars.icon,
                blocks: 'editable',
                popup: {
                    classname: 'arx-specialchars-popup',
                    specialchars: {
                        type: 'list',
                        builder: 'specialchars.popup'
                    }
                }
            });
        },
        popup: function() {
            var items = {};
            var chars = this.opts.specialchars.items;

            for (var i = 0; i < chars.length; i++) {
                items[i] = {
                    title: chars[i],
                    command: 'specialchars.insert',
                    params: {
                        character: chars[i]
                    }
                };
            }

            return items;
        },
        insert: function(args) {
            this.app.popup.close();
            this.insertion.insertChar(args.params.character);
        }
    });
})(ArticleEditor);