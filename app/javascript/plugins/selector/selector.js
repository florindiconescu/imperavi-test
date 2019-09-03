(function() {
    ArticleEditor.add('plugin', 'selector', {
        translations: {
            en: {
                "selector": {
                    "selector": "Selector",
                    "save": "Save",
                    "cancel": "Cancel"
                }
            }
        },
        defaults: {
            icon: '<svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m3.82786885 12.3931398.30327869-1.480211c-.75410213-.0158313-1.13114754-.3060658-1.13114754-.8707124 0-.2638536.09426135-.47889103.28278689-.64511877.18852553-.16622775.46584516-.24934037.83196721-.24934037h.3852459l.46721311-2.30343008h-.85245901c-.35519303 0-.62978045-.08575112-.82377049-.25725594s-.29098361-.38126525-.29098361-.6292876c0-.26385356.09426135-.47625249.28278689-.63720317.18852553-.16095067.46584516-.2414248.83196721-.2414248h1.22131147l.38524591-1.8126649c.06010959-.30607014.12704881-.54617328.20081967-.72031663s.17486274-.30606815.30327869-.39577836c.12841594-.08971021.29644705-.13456465.50409836-.13456465.28961893 0 .51092819.07387789.66393442.22163589.15300623.14775799.2295082.33772971.2295082.56992084 0 .05277072-.04644762.31925882-.13934426.7994723l-.30327869 1.47229551h1.79508197l.39344262-1.8126649c.05464508-.27440771.10655713-.49604138.1557377-.66490766.04918058-.16886628.1379775-.31134506.26639345-.42744063.12841594-.11609557.31557249-.17414248.56147539-.17414248.2841544 0 .5040976.07123939.6598361.21372032.1557385.14248092.2336065.33509113.2336065.57783641 0 .11081849-.0068305.21899683-.0204918.32453826-.0136612.10554142-.0314206.20712352-.0532787.30474934-.021858.09762582-.0355191.15963047-.0409836.18601583l-.3032786 1.48812665c.7814246.01583121 1.1721311.30870427 1.1721311.87862797 0 .26385356-.0928952.47493324-.2786885.63324538s-.4617468.23746702-.8278689.23746702h-.4180328l-.49180324 2.30343008h.90983604c.3661221 0 .6420756.08443187.8278689.25329815s.2786885.38258446.2786885.64116099c0 .2585764-.0915291.4683369-.2745902.6292876-.183061.1609506-.4603806.2414248-.8319672.2414248h-1.26229506l-.3852459 1.8205804c-.06010959.290239-.11338775.5145111-.15983607.6728233-.04644832.1583121-.13524524.2968331-.26639344.4155672s-.3196709.1781003-.56557377.1781003c-.27322541 0-.48907025-.0738779-.64754098-.2216359-.15847074-.147758-.23770492-.3403682-.23770492-.5778364 0-.2163599.03825098-.4854865.1147541-.8073879l.30327869-1.480211h-1.81147541l-.38524591 1.8205804c-.09836114.4485511-.20081913.7717669-.30737704.969657-.10655791.1978902-.33469771.2968338-.68442623.2968338-.27868992 0-.49726697-.0738779-.65573771-.2216359s-.23770492-.3403682-.23770492-.5778364c0-.1213726.01502717-.2572552.04508197-.4076517s.05601082-.2836406.07786885-.3997362zm4.79508197-5.54881262h-1.81147541l-.48360656 2.30343008h1.82786885z"/></svg>',
            popup: {
                adaptive: true,
                form: {
                    id: { type: 'input', label: 'ID'},
                    classname: { type: 'input', label: 'Class' }
                },
                header: '## selector.selector ##',
                footer: {
                    insert: { title: '## selector.save ##', command: 'selector.save' },
                    cancel: { title: '## selector.cancel ##', command: 'popup.close' }
                }
            }
        },
        init: function() {
            // local
            this.arxclasses = [];

            // services
            this.insertion = this.app.create('insertion');
        },
        start: function() {
            this.app.toolbar.add('selector', {
                title: '## selector.selector ##',
                icon: this.opts.selector.icon,
                command: 'selector.popup'
            });
        },
        popup: function(args) {
            // build popup
            this.app.popup.build(this.opts.selector.popup);
            this.app.popup.open(args.$btn);

            var instance = this.app.block.get();
            var classname = instance.$block.attr('class');
            var id = instance.$block.attr('id');

            // arx classes
            var arxclasses = this.opts.arxclasses.split(' ');
            for (var i = 0; i < arxclasses.length; i++) {
                if (classname.search(arxclasses[i]) !== -1) {
                    this.arxclasses.push(arxclasses[i]);
                    classname = classname.replace(arxclasses[i], '');
                }
            }

            // get id
            var $input = this.app.popup.getInput('id');
            $input.val(id);
            $input.focus();

            // get class
            var $input = this.app.popup.getInput('classname');
            $input.val(classname.trim());
        },
        save: function() {
            var instance = this.app.block.get();
            var data = this.app.popup.getData();

            // set id
            if (data.id === '') {
                instance.$block.removeAttr('id');
            }
            else {
                instance.$block.attr('id', data.id);
            }

            // set class
            if (this.arxclasses.length > 0) {
                data.classname = data.classname + ' ' + this.arxclasses.join(' ');
            }
            instance.$block.attr('class', data.classname);

            // close popup
            this.arxclasses = [];
            this.app.popup.close();
        }
    });
})(ArticleEditor);