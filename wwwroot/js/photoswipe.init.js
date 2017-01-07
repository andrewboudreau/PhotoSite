
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
    var pswpElement = document.querySelectorAll('.pswp')[0],
        gallery,
        options,
        items;

    items = parseHtmlGalleryElements(galleryElement);

    // define options (if needed)
    options = {

        // define gallery index (for URL)
        galleryUID: galleryElement.attr('data-pswp-uid'),

        getThumbBoundsFn: function(index) {
            // See Options -> getThumbBoundsFn section of documentation for more info
            var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                rect = thumbnail.getBoundingClientRect(); 

            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
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
    if( isNaN(options.index) ) {
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

    var index = $(".gallery figure").index(closestFigure)
    console.log(index + " item clicked");

    if (index >= 0) {
        // open PhotoSwipe if valid index found
        openPhotoSwipe(index, el.closest(".gallery"));
    }

    return false;
};

var initPhotoSwipe = function(gallerySelector)
{
    console.log("init photo swipe");
    var items = parseHtmlGalleryElements(".gallery");
    console.log("parsed " + items.length)

    // loop through all gallery elements and bind events
    var galleryElements = $(gallerySelector);
    galleryElements.each(function(index, item) {
        console.log(index + " assigning global uniqueness to" + item);
        $(item).attr('data-pswp-uid', index);
        $(item).on("click", "figure", onThumbnailClick);
    });

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid], true, true);
    }
}