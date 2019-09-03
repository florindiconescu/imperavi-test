(function() {
    ArticleEditor.add('plugin', 'blockcode', {
        translations: {
            en: {
                "blockcode": {
                    "save": "Save",
                    "cancel": "Cancel",
                    "edit-code": "Edit Code",
                }
            }
        },
        defaults: {
            codemirror: false,
            icon: '<svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m4.50635227 7.99625673 2.25498824 2.25498827c.39052429.3905243.39052429 1.0236892 0 1.4142135l-.05889346.0588935c-.39052429.3905243-1.02368927.3905243-1.41421356 0l-3.00510751-3.00510751c-.12243333-.12243333-.20648257-.26871548-.25214772-.42389275-.1113859-.34572988-.02983075-.74010429.24466546-1.01460051l3.00510751-3.00510751c.3905243-.39052429 1.02368927-.39052429 1.41421357 0l.05889346.05889347c.39052429.39052429.39052429 1.02368927 0 1.41421356z"/><path d="m11.5063523 7.99625673 2.2549882 2.25498827c.3905243.3905243.3905243 1.0236892 0 1.4142135l-.0588934.0588935c-.3905243.3905243-1.0236893.3905243-1.4142136 0l-3.00510752-3.00510751c-.12243333-.12243333-.20648257-.26871548-.25214772-.42389275-.1113859-.34572988-.02983075-.74010429.24466546-1.01460051l3.00510748-3.00510751c.3905243-.39052429 1.0236893-.39052429 1.4142136 0l.0588935.05889347c.3905242.39052429.3905242 1.02368927 0 1.41421356z" transform="matrix(-1 0 0 -1 23.036984 16)"/></svg>',
            popup: {
                adaptive: true,
                form: {
                    code: { type: 'textarea', attr: { rows: 8 } }
                },
                header: '## blockcode.edit-code ##',
                footer: {
                    insert: { title: '## blockcode.save ##', command: 'blockcode.save' },
                    cancel: { title: '## blockcode.cancel ##', command: 'popup.close' }
                }
            }
        },
        init: function() {
            // services
            this.utils = this.app.create('utils');
            this.content = this.app.create('content');
            this.selection = this.app.create('selection');
        },
        start: function() {
            this.app.control.add('blockcode', {
                icon: this.opts.blockcode.icon,
                command: 'blockcode.edit'
            });
        },
        edit: function() {
            // build popup
            this.app.popup.build(this.opts.blockcode.popup);

            // open popup
            this.app.popup.open();

            // get block code
            var instance = this.app.block.get();
            var code = instance.$block.clone().get().outerHTML;
            code = this.content.unparse(code);

            // set input
            var $input = this.app.popup.getInput('code');
            $input.addClass('arx-popup-event');
            $input.on('keydown.arx-popup-event-' + this.uuid, this._handleTab.bind(this));
            $input.val(code);
            $input.focus();

            // codemirror
            this.utils.createCodemirror($input, this.opts.blockcode);
        },
        save: function() {
            this.app.popup.close();

            var instance = this.app.block.get();
            var data = this.app.popup.getData();
            var code = data.code;

            // codemirror
            code = this.utils.getCodemirror(code, this.opts.blockcode);

            if (code === '') {
                instance.remove();
                return;
            }

            var parsed = this.content.parse(code, false, true);

            // save selection
            this.selection.save(instance.$block);

            // insert
            instance.$block.after(parsed);

            // get pasted
            var $pasted = this.app.editor.$editor.find('[data-arx-inserted]');

            // remove current
            instance.$block.remove();

            // first level & events
            this.app.editor.rebuild();

            var $el = $pasted.first();
            this.app.block.set($el);
            $pasted.removeAttr('data-arx-inserted');

            // restore selection
            this.selection.restore($el);
        },

        // private
        _handleTab: function(e) {
            if (e.keyCode !== 9) return true;

            e.preventDefault();

            var el = e.target;
            var val = el.value;
            var start = el.selectionStart;

            el.value = val.substring(0, start) + "    " + val.substring(el.selectionEnd);
            el.selectionStart = el.selectionEnd = start + 4;
        }
    });
})(ArticleEditor);