(function() {
    ArticleEditor.add('plugin', 'inlineformat', {
        translations: {
            en: {
                "inlineformat": {
                    "inline-format": "Inline Format",
                    "underline": "Underline",
                    "superscript": "Superscript",
                    "subscript": "Subscript",
                    "mark": "Mark",
                    "code": "Code",
                    "shortcut": "Shortcut",
                    "remove-format": "Remove Format"
                }
            }
        },
        defaults: {
            icon: '<svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m4.36153846 9.33764335c0 2.16073495 1.62899472 3.91235665 3.63846154 3.91235665 2.0094668 0 3.6384615-1.7516217 3.6384615-3.91235665 0-1.27212916-1.1859265-3.23275826-3.6384615-5.71264335-2.45253504 2.47988509-3.63846154 4.44051419-3.63846154 5.71264335zm3.63846154 5.66235665c-3.03756612 0-5.5-2.5809467-5.5-5.76470588 0-2.1225061 1.83333333-4.86760414 5.5-8.23529412 3.6666667 3.36768998 5.5 6.11278802 5.5 8.23529412 0 3.18375918-2.4624339 5.76470588-5.5 5.76470588z" fill-rule="evenodd"/></svg>',
            format: {
                "underline": {
                    title: '<span style="text-decoration: underline;">## inlineformat.underline ##</span>',
                    command: 'inline.format',
                    params: {
                        tag: 'u'
                    }
                },
                "sup": {
                    title: '## inlineformat.superscript ##<sup>x</sup>',
                    command: 'inline.format',
                    params: {
                        tag: 'sup'
                    }
                },
                "sub": {
                    title: '## inlineformat.subscript ##<sub>x</sub>',
                    command: 'inline.format',
                    params: {
                        tag: 'sub'
                    }
                },
                "mark": {
                    title: '<span style="background: yellow;">## inlineformat.mark ##</span>',
                    command: 'inline.format',
                    params: {
                        tag: 'mark'
                    }
                },
                "code": {
                    title: '<span style="font-family: monospace; background: #f0f1f2; padding: 4px;">## inlineformat.code ##</span>',
                    command: 'inline.format',
                    params: {
                        tag: 'code'
                    }
                },
                "kbd": {
                    title: '## inlineformat.shortcut ##',
                    command: 'inline.format',
                    params: {
                        tag: 'kbd'
                    }
                },
                "remove": {
                    title: '## inlineformat.remove-format ##',
                    topdivider: true,
                    command: 'inline.removeFormat'
                }
            }
        },
        start: function() {
            this.app.toolbar.add('inlineformat', {
                title: '## inlineformat.inline-format ##',
                icon: this.opts.inlineformat.icon,
                blocks: 'editable',
                popup: {
                    inline: {
                        type: 'list',
                        builder: 'inlineformat.popup'
                    }
                }
            });
        },
        popup: function() {
            return this.opts.inlineformat.format;
        }
    });
})(ArticleEditor);