(function() {
    ArticleEditor.add('plugin', 'reorder', {
        defaults: {
            icon: '<svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m3 5h10c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1h-10c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1zm0 4h10c.5522847 0 1 .44771525 1 1 0 .5522847-.4477153 1-1 1h-10c-.55228475 0-1-.4477153-1-1 0-.55228475.44771525-1 1-1z" fill-rule="evenodd"/></svg>'
        },
        subscribe: {
            'block.set': function() {
                this._observe();
            }
        },
        init: function() {
            this.utils = this.app.create('utils');
        },
        start: function() {
            this.app.control.add('reorder', {
                icon: this.opts.reorder.icon,
                position: 'first',
                blocks: 'first-level'
            });
        },
        stop: function() {
            this.$btn.off('.arx-reorder-' + this.uuid);
            this.app.$win.off('.arx-reorder-' + this.uuid);
            //this.app.editor.$editor.removeAttr('data-sortable');
        },

        // private
        _observe: function() {
            this.$btn = this.app.control.get('reorder');
            this.$btn.addClass('arx-handle');

            this._sortable();
        },
        _sortable: function() {

            this.$scrollTarget = (this.utils.isScrollTarget()) ? this.utils.getScrollTarget() : this.app.$win;
            this.tolerance = this.$btn.width();
            this.$clickItem = null;
            this.$dragItem  = null;
            this.click = {};
            this.dragging = false;

            //this.app.editor.$editor.attr('data-sortable', true);
            this.$btn.on('mousedown.arx-reorder-' + this.uuid + ' touchstart.arx-reorder-' + this.uuid, this._press.bind(this));
            this.app.$win.on('mouseup.arx-reorder-' + this.uuid + ' touchend.arx-reorder-' + this.uuid, this._release.bind(this));
            this.app.$win.on('mousemove.arx-reorder-' + this.uuid + ' touchmove.arx-reorder-' + this.uuid, this._move.bind(this));
        },
        _getPoint: function(e, client) {
            if (client) {
                return { x: e.clientX + this.tolerance, y: e.clientY };
            }
            else {
                return { x: e.pageX + this.tolerance, y: e.pageY };
            }
        },
        _isOver: function($item, x, y) {
            var box = $item.offset();
            var width = $item.width();
            var height = $item.height();
            var isx = (x > box.left && x < (box.left + width));
            var isy = (y > box.top && y < (box.top + height));

            return (isx && isy);
        },
        _swapItems: function(item1, item2) {
            item1 = item1.get();
            var parent1 = item1.parentNode;
            var parent2 = item2.parentNode;

            if (parent1 !== parent2) {
                parent2.insertBefore( item1, item2 );
            }
            else {
                var temp = document.createElement('div');
                parent1.insertBefore(temp, item1);
                parent2.insertBefore(item1, item2);
                parent1.insertBefore(item2, temp);
                parent1.removeChild(temp);
            }
        },
        _moveItem: function($item, x, y) {
            $item.css('transform', 'translateY(' + y + 'px)');
        },
        _makeDragItem: function(item) {
            this._trashDragItem();

            var $item = this.dom(item);
            this.$clickItem = $item;
            this.$clickItem.addClass('arx-active');

            var $cloned = $item.clone();
            $cloned.removeClass('arx-active arx-block-focus');
            this.$dragItem = this.dom('<div>');
            this.$dragItem.append($cloned);
            this.$dragItem.addClass('arx-dragging');
            this.$dragItem.css({
                'opacity': 0.95,
                'position': 'absolute',
                'z-index': 999,
                'left': (item.offsetLeft || 0) + 'px',
                'top': (item.offsetTop || 0) + 'px',
                'width': (item.offsetWidth || 0) + 'px'
            });

            this.app.editor.$editor.append(this.$dragItem);
        },
        _trashDragItem: function() {
            if (this.$dragItem && this.$clickItem) {
                this.$clickItem.removeClass('arx-active arx-block-focus');
                this.$clickItem = null;

                this.$dragItem.remove();
                this.$dragItem = null;
            }
        },
        _press: function(e) {
            var $target = this.dom(e.target).closest('.arx-button');
            if (e && e.target && $target.hasClass('arx-handle')) {
                e.preventDefault();

                var instance = this.app.block.get();
                var item = instance.$block.get();
                this.app.block.unset();

                this.dragging = true;
                this.click = this._getPoint(e);
                this._makeDragItem(item, e.target);
                this.dragTop = this.$dragItem.offset().top;
                this._move(e);
            }
        },
        _release: function(e) {
            this.dragging = false;
            this.app.observer.trigger = true;
            this._trashDragItem();
        },
        _scroll: function(step) {
            var $target = (this.utils.isScrollTarget()) ? this.$scrollTarget : this.app.$win;
            var scrollY = $target.scrollTop();
            $target.scrollTop(scrollY + step);
        },
        _getBox: function($container, position) {
            var containerOffset = (this.utils.isScrollTarget() && position !== false) ? $container.position() : $container.offset();
            var start = containerOffset.top;
            var end = start + $container.height();

            return {
                start: start,
                end: end
            };
        },
        _move: function(e) {
            if (!this.$dragItem && !this.dragging) {
                return;
            }

            e.preventDefault();
            this.app.observer.trigger = false;

            var point  = this._getPoint(e);
            var startPoint = {
                x: (point.x - this.click.x),
                y: (point.y - this.click.y)
            };

            if (startPoint.x === 0 || startPoint.y === 0) {
                return;
            }

            // move
            this._moveItem(this.$dragItem, startPoint.x, startPoint.y);

            // autoscroll
            if (!this.utils.isScrollTarget()) {
                var $box = this.app.editor.$editor;
                var $target = this.app.$win;
                var bound = this._getBox($box);
                var scrollTop = $target.scrollTop();
                var startBox = this.app.editor.$editor.offset().top;
                var endBox = e.clientY + $target.scrollTop();
                var x = $target.height() - 50;
                var y = $target.scrollTop() + 50;
                var direction = 'down';
                if ((this.dragTop - this.$dragItem.offset().top) < 50) {
                    // down
                    if (e.clientY > ($target.height() - 50) && (endBox < bound.end)) {
                        this._scroll(10);
                    }
                }
                else if ((this.dragTop - this.$dragItem.offset().top) > 50) {
                    // up
                    direction = 'up';
                    if (e.clientY < 50 && ((e.clientY + scrollTop) > startBox)) {
                        this._scroll(-10);
                    }
                }
            }

            // place
            var len = this.app.editor.$editor.get().children.length;
            if (this._isOver(this.app.editor.$editor, point.x, point.y) && len === 0) {
                var func = (direction === 'up') ? 'prepend' : 'append';
                this.app.editor.$editor[func](this.$clickItem);
                return;
            }

            for (var b = 0; b < len; b++) {
                var subItem = this.app.editor.$editor.get().children[b];
                if (subItem.tagName === 'SCRIPT' || subItem === this.$clickItem.get() || subItem === this.$dragItem.get()) {
                    continue;
                }

                if (this._isOver(this.dom(subItem), point.x, point.y)) {
                    //this.hoverItem = subItem;
                    this._swapItems(this.$clickItem, subItem);
                }
            }
        }
    });
})(ArticleEditor);