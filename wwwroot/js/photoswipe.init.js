(function(){
    $("body").append($('<div class="pswp"aria-hidden="true"role="dialog"tabindex="-1"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close"title="Close (Esc)"></button><button class="pswp__button pswp__button--share"title="Share"></button><button class="pswp__button pswp__button--fs"title="Toggle fullscreen"></button><button class="pswp__button pswp__button--zoom"title="Zoom in/out"></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left"title="Previous (arrow left)"></button><button class="pswp__button pswp__button--arrow--right"title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>'));

// parse picture index and gallery index from URL (#&pid=1&gid=2)
var photoswipeParseHash = function() {
    var hash = window.location.hash.substring(1),
        params = {};

    if (hash.length < 5) {
        return params;
    }

    var vars = hash.split('&');
    for (var i = 0; i < vars.length; i++) {
        if (!vars[i]) {
            continue;
        }
        var pair = vars[i].split('=');
        if (pair.length < 2) {
            continue;
        }
        params[pair[0]] = pair[1];
    }

    if (params.gid) {
        params.gid = parseInt(params.gid, 10);
    }

    return params;
};

var parseHtmlGalleryElements = function(gallery) {
    var figures = $(gallery).find("figure");

    var items = figures.map(function(index, figure) {
        var link = $(figure).find("a");
        var thumbnail = link.find("img");
        var caption = $(figure).find("figcaption").html();
        var size = link.attr('data-size').split('x');

        return {
            el: figure,
            src: link.attr('href'),
            msrc: thumbnail.attr("src"),
            w: parseInt(size[0], 10),
            h: parseInt(size[1], 10),
            title: caption
        };
    });

    return items;
}

var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
    console.log("opening photoswipe");
    
    var pswpElement = document.querySelectorAll('.pswp')[0],
        gallery,
        options,
        items;

    items = parseHtmlGalleryElements(galleryElement);
    // define options (if needed)
    options = {

        // define gallery index (for URL)
        galleryUID: $(galleryElement).attr('data-pswp-uid'),

        getThumbBoundsFn: function(index) {
            // See Options -> getThumbBoundsFn section of documentation for more info
            var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                rect = thumbnail.getBoundingClientRect(); 

            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
        },

        addCaptionHTMLFn: function () {
            return false;    
        }
    };

    // PhotoSwipe opened from URL
    if(fromURL) {
        if(options.galleryPIDs) {
            // parse real index when custom PIDs are used 
            // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
            for(var j = 0; j < items.length; j++) {
                if(items[j].pid == index) {
                    options.index = j;
                    break;
                }
            }
        } else {
            // in URL indexes start from 1
            options.index = parseInt(index, 10) - 1;
        }
    } else {
        options.index = parseInt(index, 10);
    }

    // exit if index not found
    if(isNaN(options.index)) {
        return;
    }

    if(disableAnimation) {
        options.showAnimationDuration = 0;
    }

    // Pass data to PhotoSwipe and initialize it
    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
};

var onThumbnailClick = function(e) {
    e.preventDefault();
    
    var el = $(e.target);
    var closestFigure = el.closest("figure");
    if (closestFigure.length === 0) {
        return;
    }

    var index = $(".gallery figure").index(closestFigure);
    console.log(index + " item clicked");

    if (index >= 0) {
        // open PhotoSwipe if valid index found
        openPhotoSwipe(index, el.closest(".gallery"));
    }

    return false;
};

var initPhotoSwipe = function(gallerySelector)
{
    var items = parseHtmlGalleryElements(".gallery");
    console.log(items.length + " photos")

    // loop through all gallery elements and bind events
    var galleryElements = $(gallerySelector);
    galleryElements.each(function(index, item) {
        $(item).attr('data-pswp-uid', index + 1);
        $(item).on("click", "figure", onThumbnailClick);
    });

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
    }
}

initPhotoSwipe(".gallery");
}());