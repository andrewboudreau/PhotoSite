//$(".menu li a").attr("href", "./");

$("body").append('<div class="visible-sm-block visible-xs-block" id="mobile-screen" style="position:absolute;opacity:0"></div><div class="visible-md-block visible-lg-block" id="desktop-screen"style="position:absolute;opacity:0"></div>');

var isMobile = function () {
    return $("#mobile-screen").is(":visible");
}

var isDesktop = function () {
    return $("#desktop-screen").is(":visible");
}

$(".sundlof-logo").click(function() {
    window.location.href = "/";
})

if($(".headline").text() == ""){
    $(".headline").hide();
}

$('.menu').find('li:has(ul)').addClass('has-menu');
$('.menu .navigation-container > ul > li.has-menu').addClass('level1');
$('.menu').find('li.level1').find('ul.sub-menu').children('li.has-menu').addClass('level2');
$('.menu').find('li.has-menu').children('a').addClass('menu-toggler');

$('.menu').hover(function() {
    $(this).addClass('hovered');
    $(this).find('.hamburger').addClass("is-active");
}, function() {
    $(this).removeClass('hovered');
    $(this).find('.hamburger').removeClass("is-active");
});

$('.menu-toggler').hover(function() {
    if(isMobile()){
        return;
    }

    var toggler = $(this);
    if (toggler.closest('li').find('ul.sub-menu').css('display') != 'block') {
        if (toggler.closest('li').hasClass('level1')) {
            $('.sub-menu').slideUp(500);
            $('.sub-menu').closest('li').removeClass('opened');
            toggler.closest('li').children('.sub-menu').slideDown(500);
            toggler.closest('li').addClass('opened');
        } else {
            $('.level2').find('.sub-menu').slideUp(500);
            toggler.closest('li').children('.sub-menu').slideDown(500);
            toggler.closest('li').addClass('opened');
        }
    }

    $('.menu').find('.opened').each(function() {
        toggler.closest('li.has-menu').addClass('opened');
    });
});

$(".menu").click(function(e) {
    var target = $(e.target);
    if (target.is("ul, li, a")) {
        return true;
    }

    if (isDesktop()) {
        return;
    }

    $('body').toggleClass('menu-push-tobottom');
    $(".menu").toggleClass("menu-open");
    $('.menu li.has-menu').addClass('opened').find('ul.sub-menu').show();

    window.setTimeout(function() {
        $('.menu .hamburger').toggleClass('is-active');
    }, 400);
});

window.setTimeout(function() {
    $(".menu").addClass("breath");
}, 1000);

window.setTimeout(function() {
    $(".menu").removeClass("breath");
}, 1500);

// $(".menu-mobile:not(.navigation-container)").touchwipe({
//     wipeUp: function() {
//         $(".menu-mobile").click();
//     },
//     wipeDown: function() {
//         $(".menu-mobile").click();
//     }
// });