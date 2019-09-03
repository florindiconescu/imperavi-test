(function() {
    ArticleEditor.add('plugin', 'style', {
        translations: {
            en: {
                "style": {
                    "style": "Style",
                    "remove-style": "Remove Style"
                }
            }
        },
        defaults: {
            icon: '<svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m.23081081 13.7264324c1.69475676-5.08427024 6.13010811-13.55729726 13.55729729-13.55729726-3.4818378 2.79356756-5.0854054 9.32059459-7.62583783 9.32059459h-2.54232432l-2.54194595 4.23783787h-.84718919z" transform="translate(1 1)"/></svg>',
            styles: {
                paragraph: {
                    'lead': {
                        title: '<span style="font-size: 24px; color: #444;">Lead</span>',
                        command: 'style.toggle',
                        params: { classname: 'st-lead' }

                    },
                    'note': {
                        title: '<span style="background-color: #f6f6e9; color: #444;">Note</span>',
                        command: 'style.toggle',
                        params: { classname: 'st-note' }
                    },
                    'accent': {
                        title: '<span style="font-weight: bold; text-transform: uppercase;">Accent</span>',
                        command: 'style.toggle',
                        params: { classname: 'st-accent' }
                    },
                    'remove': {
                        title: '## style.remove-style ##',
                        topdivider: true,
                        command: 'style.remove'
                    }
                },
                embed: {
                    'frame': {
                        title: 'Frame',
                        command: 'style.toggle',
                        params: { classname: 'st-embed-frame' }
                    },
                    'raised': {
                        title: 'Raised',
                        command: 'style.toggle',
                        params: { classname: 'st-embed-raised' }
                    },
                    'remove': {
                        title: '## style.remove-style ##',
                        topdivider: true,
                        command: 'style.remove'
                    }
                },
                line: {
                    'black-extra-height': {
                        title: '<span style="display: block; height: 4px; background: #000;"></span>',
                        command: 'style.toggle',
                        params: { classname: 'st-line-black-extra-height' }
                    },
                    'gray-dashed': {
                        title: '<span style="display: block; border-top: 2px dashed #ccc;"></span>',
                        command: 'style.toggle',
                        params: { classname: 'st-line-gray-dashed' }
                    },
                    'blue-line': {
                        title: '<span style="display: block; height: 2px; background: #458fff;"></span>',
                        command: 'style.toggle',
                        params: { classname: 'st-line-blue' }
                    },
                    'remove': {
                        title: '## style.remove-style ##',
                        topdivider: true,
                        command: 'style.remove'
                    }
                }
            }
        },
        start: function() {

            var blocks = [];
            for (var key in this.opts.style.styles) {
                blocks.push(key);
            }

            this.app.toolbar.add('style', {
                title: '## style.style ##',
                icon: this.opts.style.icon,
                blocks: blocks,
                popup: {
                    style: {
                        type: 'list',
                        builder: 'style.popup'
                    }
                }
            });
        },
        popup: function() {
            var instance = this.app.block.get();
            var type = instance.getType();
            var classes = this._getClasses(type);
            var name = instance.getClass(classes);

            // get buttons & set the active item
            if (typeof this.opts.style.styles[type] !== 'undefined') {
                var buttons = this.opts.style.styles[type];
                for (var key in buttons) {
                    buttons[key].active = (buttons[key].params && buttons[key].params.classname === name);
                }

                if (typeof buttons['remove'] !== 'undefined') {
                    if (name === false) {
                        buttons['remove'].hidden = true;
                    }
                    else {
                        buttons['remove'].hidden = false;
                    }
                }

                return buttons;
            }
        },
        toggle: function(args) {
            this.app.popup.close();

            // instance
            var instance = this.app.block.get();
            var type = instance.getType();

            // remove
            this._removeStyles(instance, type);

            // set
            instance.$block.addClass(args.params.classname);

            // rebuild
            this.app.toolbar.build();
        },
        remove: function(args) {
            this.app.popup.close();

            // instance
            var instance = this.app.block.get();
            var type = instance.getType();

            // remove
            this._removeStyles(instance, type);

            // rebuild
            this.app.toolbar.build();
        },

        // private
        _getClasses: function(type) {
            var styles = this.opts.style.styles[type];
            var classes = [];
            for (var key in styles) {
                if (styles[key].params) {
                    classes.push(styles[key].params.classname);
                }
            }

            return classes;
        },
        _removeStyles: function(instance, type) {
            var classes = this._getClasses(type);
            instance.$block.removeClass(classes.join(' '));
        }
    });
})(ArticleEditor);