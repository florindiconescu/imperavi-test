(function() {
    ArticleEditor.add('plugin', 'variable', {
        translations: {
            en: {
                "variable": {
                    "variable": "Variable"
                }
            }
        },
        defaults: {
            icon: '<svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m2 1h12c1.1045695 0 2 .8954305 2 2v10c0 1.1045695-.8954305 2-2 2h-12c-1.1045695 0-2-.8954305-2-2v-10c0-1.1045695.8954305-2 2-2zm0 2v10h12v-10zm7.04195804 3.72666667c-.01864811-.22222334-.10547708-.39555494-.26048951-.52-.15501243-.12444507-.38985856-.18666667-.70454545-.18666667-.30070081 0-.51981284.0488884-.65734266.14666667-.13752983.09777826-.2074592.22222146-.20979021.37333333-.00932406.16222303.06468453.29444393.22202797.39666667.15734345.10222273.40500997.18777743.74300699.25666666l.58741259.12c.79021374.16222304 1.36013814.42166489 1.70979024.77833334s.525641.7949974.527972 1.315c-.002331.67333673-.2610697 1.19055373-.7762238 1.55166663-.51515407.3611129-1.22610267.5416667-2.13286711.5416667-.62238073 0-1.1649161-.0877769-1.62762238-.2633333-.46270627-.1755565-.82167704-.4461093-1.07692307-.8116667-.25524604-.3655574-.38403263-.83388603-.38636364-1.405h1.84615385c.01631709.3133349.12995232.55166585.34090909.715.21095676.16333415.50291189.245.87587412.245.31235588 0 .5483675-.0533328.70804196-.16s.24067598-.2444436.24300699-.41333333c-.00233101-.15555634-.08274979-.28499949-.24125874-.38833334s-.43706094-.1961107-.83566433-.27833333l-.71328672-.14666667c-.6340358-.13111176-1.13344806-.35055401-1.49825174-.65833333-.36480369-.30777932-.54603731-.72833067-.5437063-1.26166667-.00233101-.4333355.11946264-.81277615.36538462-1.13833333.24592197-.32555718.5874104-.57944353 1.02447552-.76166667.43706512-.18222313.93880836-.27333333 1.50524476-.27333333.57809147 0 1.07808647.0922213 1.5.27666667.42191353.18444536.74766782.44388721.97727272.77833333s.3455711.72499777.3479021 1.17166667z" fill-rule="evenodd"/></svg>',
            items: ['email', 'name', 'password'],
            template: {
                start: '[%',
                end: '%]'
            },
            classname: 'arx-variable'
        },
        subscribe: {
            'editor.content.parse': function(event) {
                this._parse(event);
            },
            'editor.content.unparse': function(event) {
                this._unparse(event);
            }
        },
        init: function() {
            // local
            this.arxclasses = [];

            // services
            this.utils = this.app.create('utils');
            this.insertion = this.app.create('insertion');
        },
        start: function() {
            this.app.toolbar.add('variable', {
                title: '## variable.variable ##',
                icon: this.opts.variable.icon,
                blocks: 'editable',
                popup: {
                    classname: 'arx-variable-popup',
                    specialchars: {
                        type: 'list',
                        builder: 'variable.popup'
                    }
                }
            });
        },
        popup: function() {
            var items = {};
            var vars = this.opts.variable.items;

            for (var i = 0; i < vars.length; i++) {
                items[i] = {
                    title: vars[i],
                    command: 'variable.insert',
                    params: {
                        variable: vars[i]
                    }
                };
            }

            return items;
        },
        insert: function(args) {
            this.app.popup.close();

            var $el = this.dom('<span>');
            $el.addClass(this.opts.variable.classname);
            $el.attr('contenteditable', false);
            $el.html(args.params.variable);

            this.insertion.insertNode($el, 'after');
        },

        // private
        _parse: function(event) {
            var html = event.get('html');
            var start = this.opts.variable.template.start;
            var end = this.opts.variable.template.end;
            var htmlStart = '<span contenteditable="false" class="' + this.opts.variable.classname + '">'
            var htmlEnd = '</span>';
            var re = new RegExp(this.utils.escapeRegExp(start) + '(.*?)' + this.utils.escapeRegExp(end), 'gi');
            var match = html.match(re);
            if (match != null) {
                var matched, replacer;
                for (var i = 0; i < match.length; i++) {
                    matched =  match[i].replace(start, '').replace(end, '');
                    replacer = htmlStart + matched + htmlEnd;
                    html = html.replace(match[i], replacer);
                }
            }

            event.set('html', html);

        },
        _unparse: function(event) {
            var html = event.get('html');
            var $wrapper = this.utils.createWrapper(html);
            var start = this.opts.variable.template.start;
            var end = this.opts.variable.template.end;

            // find
            $wrapper.find('.' + this.opts.variable.classname).replaceWith(function(node) {
                return start + node.innerHTML + end;
            });

            html = this.utils.getWrapperHtml($wrapper);
            event.set('html', html);
        }
    });
})(ArticleEditor);