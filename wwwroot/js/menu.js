
$(".sundlof-logo").click(function(){
    window.location.href = "/";
})

$('.menu').find('li:has(ul)').addClass('has-menu');
$('.menu .navigation-container > ul > li.has-menu').addClass('level1');
$('.menu').find('li.level1').find('ul.sub-menu').children('li.has-menu').addClass('level2');
$('.menu').find('li.has-menu').children('a').addClass('menu-toggler');

$('.menu-vertical').hover(function(){
    $(this).addClass('hovered');
    $(this).find('.hamburger').addClass("is-active");
},function(){
    $(this).removeClass('hovered');
    $(this).find('.hamburger').removeClass("is-active");
});

$('.menu-toggler').hover(function() {
    var toggler = $(this);

    if(toggler.closest('li').find('ul.sub-menu').css('display') != 'block') {
        if(toggler.closest('li').hasClass('level1')) {
            $('.sub-menu').slideUp(500);
            $('.sub-menu').closest('li').removeClass('opened');
            toggler.closest('li').children('.sub-menu').slideDown(500);
            toggler.closest('li').addClass('opened');
        }
        else {
            $('.level2').find('.sub-menu').slideUp(500);
            toggler.closest('li').children('.sub-menu').slideDown(500);
            toggler.closest('li').addClass('opened');
        }
    }

    $('.menu').find('.opened').each(function(){
        toggler.closest('li.has-menu').addClass('opened');
    });
});

$(".menu-mobile").click(function(e) {
    var target = $(e.target);
    if (target.is("ul, li, a")) {
        return true;
    }

    $('body').toggleClass('menu-push-tobottom'); 
    $(".menu").toggleClass("menu-open");
    $('.menu-mobile li.has-menu').addClass('opened').find('ul.sub-menu').show();

    window.setTimeout(function() {
            $('.menu-mobile .hamburger').toggleClass('is-active');
    }, 400);
});

window.setTimeout(function()	{
    $(".menu-left").addClass("breath");
}, 1000);

window.setTimeout(function()	{
    $(".menu-left").removeClass("breath");
}, 1500);

$("nav").touchwipe({
    wipeUp: function() { 
        $(".menu-mobile").click();
    },
    wipeDown: function() { 
        $(".menu-mobile").click();
    }
});