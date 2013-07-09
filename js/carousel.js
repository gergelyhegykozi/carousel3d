/**
 * 3D Carousel with flash effect - flexible - with fallback
 *
 * @param {int} duration
 * @param {int} shrink
 *
 * @author Gergely Hegyközi | Twitter: @leonuh
 */

!function($) {

    $.fn.carousel3d = function(options) {
        /* Config */
        options = $.extend({},{            
            duration: 2, //seconds
            shrink: 50 //px
        }, options);

            /* Handle carousel steps */
        var stepper = function(e) {
                e.preventDefault();

                var $carousel = $(this),
                    $control = $(e.currentTarget),
                    $active = $carousel.find('.active'),
                    $pointer,
                    forward;

                if($control.hasClass('back')) {
                        $pointer = $active.prev('.carousel-item');
                        if(!$pointer.length) {
                            $pointer = $active.siblings(':last-child');
                        }
                        forward = false;
                    } else if($control.hasClass('forward')) {
                        $pointer = $active.next('.carousel-item');
                        if(!$pointer.length) {
                            $pointer = $active.siblings(':first-child');
                        }
                        forward = true;
                    }

                    /* Fallback */
                    if(!Modernizr.csstransforms3d) {
                        classSetter.call(this, $active, $pointer, forward);
                        return false;
                    }

                    this.$controls.unbind('click');
                    setTimeout($.proxy(function() {
                        $carousel.removeClass('animate-forward animate-back');
                        this.$controls.bind('click', $.proxy(stepper, this));
                    }, this), this.options.duration * 1000);

                    /* Animate stages */
                    animate.call(this, 0, forward);
                    setTimeout($.proxy(function() {
                        classSetter.call(this, $active, $pointer, forward);
                        animate.call(this, 1, forward);
                        if(forward) {
                            $carousel.addClass('animate-forward');
                        } else {
                            $carousel.addClass('animate-back');
                        }
                    }, this), this.options.duration / 3 * 1000);
                },
                /* Set prev active and next items */
                classSetter = function($prevPointer, $pointer, forward) {
                    $(this).find('.carousel-item').removeClass('previous next');

                    $prevPointer.removeClass('active');
                    $pointer.addClass('active');
                    $pointer.prev('.carousel-item').addClass('previous');
                    $pointer.next('.carousel-item').addClass('next');  

                    if($pointer.filter(':first-child').length) {
                        $pointer.siblings(':last').addClass('previous');
                    }

                    if($pointer.filter(':last-child').length) {
                        $pointer.siblings(':first').addClass('next');
                    }
                },
                /**
                 * Css and pointer setter
                 * stages:
                 *      -1: init
                 *      0: stage 1
                 *      1: stage 2
                 * */
                animate = function(stage, forward) {
                    var dimensions = this.cubeMatrix.dimensions();
                    if(stage === -1 || stage === 1) {
                        if(forward) {
                            this.cubeMatrix.next();
                        } else {
                            this.cubeMatrix.prev();
                        }
                        dimensions = this.cubeMatrix.dimensions();

                        this.$carouselWrapper.find('.previous')
                            .css(Modernizr.prefixed('transform'), dimensions.items.previous.transform);
                        this.$carouselWrapper.find('.active')
                            .css(Modernizr.prefixed('transform'), dimensions.items.active.transform);
                        this.$carouselWrapper.find('.next')
                            .css(Modernizr.prefixed('transform'), dimensions.items.next.transform);

                        /* Rotate wrapper */
                        this.$carouselWrapper.removeClass('dimension-0 dimension-1 dimension-2 dimension-3').addClass('dimension-' + this.cubeMatrix.pointer())
                            .css(Modernizr.prefixed('transform'), 'rotateX(' + dimensions.x  + 'deg) translateY(' + dimensions.y  + 'px) translateZ(' + dimensions.z  + 'px)')
                            .css(Modernizr.prefixed('transitionDuration'), this.options.duration * (2 / 3) + 's');


                    } else if(stage === 0) {
                        this.$carouselWrapper
                            .css(Modernizr.prefixed('transform'), 'rotateX(' + dimensions.x  + 'deg) translateY(' + dimensions.preY  + 'px) translateZ(' + dimensions.preZ  + 'px)')
                            .css(Modernizr.prefixed('transitionDuration'), this.options.duration / 3 + 's');           
                    }
                };
                /* Image cube handler class */
                CubeMatrix = function(carouselScope) {
                    var active = -1,
                        x = -90,
                        height = carouselScope.mainHeight,
                        dimensions = [
                            {
                                y: 0,
                                z: 0,
                                preY: 0,
                                preZ: parseFloat(('-' + carouselScope.options.shrink), 10),
                                items: {
                                    previous: {
                                        rotateX: -90,
                                        translateZ: 0,
                                        translateY: height,
                                        rotateY: 180,
                                        rotateZ: 180                                    
                                    },
                                    active: {
                                        rotateX: 0,
                                        translateZ: 0
                                    },
                                    next: {
                                        rotateX: -90,
                                        translateZ: height
                                    }
                                }
                            },
                            {
                                y: parseFloat(('-' + height), 10),
                                z: 0,
                                preY: parseFloat(('-' + (height + carouselScope.options.shrink)), 10),
                                preZ: 0,
                                items: {
                                    previous: {
                                        rotateX: 0,
                                        translateZ: 0
                                    },
                                    active: {
                                        rotateX: -90,
                                        translateZ: height
                                    },
                                    next: {
                                        rotateX: 0,
                                        translateZ: '-' + height,
                                        translateY: height,
                                        rotateY: 180,
                                        rotateZ: 180
                                    }
                                }         
                            },
                            {
                                y: parseFloat(('-' + height), 10),
                                z: height,
                                preY: parseFloat(('-' + height), 10),
                                preZ: height + carouselScope.options.shrink,
                                items: {
                                    previous: {
                                        rotateX: -90,
                                        translateZ: height
                                    },
                                    active: {
                                        rotateX: 0,
                                        translateZ: '-' + height,
                                        translateY: height,                               
                                        rotateY: 180,
                                        rotateZ: 180
                                    },
                                    next: {
                                        rotateX: -90,
                                        translateZ: 0,
                                        translateY: height,                                
                                        rotateY: 180,
                                        rotateZ: 180
                                    }
                                }
                            },
                            {
                                y: 0,
                                z: height,
                                preY: carouselScope.options.shrink,
                                preZ: height,
                                items: {
                                    previous: {
                                        rotateX: 0,
                                        translateZ: '-' + height,
                                        translateY: height,                                   
                                        rotateY: 180,
                                        rotateZ: 180
                                    },
                                    active: {
                                        rotateX: -90,
                                        translateZ: 0,
                                        translateY: height,                                
                                        rotateY: 180,
                                        rotateZ: 180
                                    },
                                    next: {
                                        rotateX: 0,
                                        translateZ: 0
                                    }
                                }
                            },
                        ];

                    /* Set up items dimension */
                    $.each(dimensions, function(k) {
                        var i, j, transform;
                        for(i in dimensions[k].items) {
                            if(dimensions[k].items.hasOwnProperty(i)) {
                                transform = '';
                                for(j in dimensions[k].items[i]) {
                                    if(dimensions[k].items[i].hasOwnProperty(j)) {
                                        transform += j + '(' + dimensions[k].items[i][j];
                                        transform += j.match(/rotate/) ? 'deg' : 'px';    
                                        transform += ') ';
                                    }
                                }
                                dimensions[k].items[i].transform = transform;
                            }
                        }
                    });

                    this.next = function() {
                        active++;
                        x = x + 90;
                        if(active >= 4) {
                            active = 0;
                        }
                    };

                    this.prev = function() {
                        active--;
                        x = x - 90;
                        if(active <= -1) {
                            active = 3;
                        }               
                    };

                    this.pointer = function() {
                        return active;
                    };

                    this.dimensions = function() {
                        return $.extend({
                            x: x
                        }, dimensions[active]);
                    };
                };

            return this.each(function() {
                this.options = $.extend({}, options, $(this).data());

                /* Init */
                this.$carouselWrapper = $(this).children('ul');
                this.$controls = $(this).find('.back, .forward');
                this.mainHeight = $(this).find('.carousel-content:first').height();

                this.currentDeg = -90;
                this.cubeMatrix = new CubeMatrix(this);

                /* Set first item's classes*/
                classSetter.call(this, $(''), $(this).find('.carousel-item:first'), true);
            
            if(Modernizr.csstransforms3d) {                
                $(this).css(Modernizr.prefixed('perspective'), this.mainHeight);
                animate.call(this, -1, true);

                /* Flash helpers */
                this.$carouselWrapper.find('.carousel-content').each($.proxy(function(i, content) {
                    $(content).parent()
                        .prepend(
                            $('<span class="pre-helper"/>')
                                .css(Modernizr.prefixed('transitionDuration'), this.options.duration + 's')
                        )
                        .append(
                            $('<span class="post-helper"/>')
                                .css(Modernizr.prefixed('transitionDuration'), this.options.duration + 's')
                        );
                }, this));
            }

            /* Event handlers */
            this.$controls.bind('click', $.proxy(stepper, this));
            return this;
        });
    };

}(jQuery);
