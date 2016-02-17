$(document).ready(function() {
    /*fade in animations*/
    $('.js--tasks').waypoint(function(direction) {
        $('.js--tasks').addClass('animated fadeInUp');
    }, {
        offset:'60%'
    })
    $('.js--wp1').waypoint(function(direction) {
        $('.js--wp1').addClass('animated fadeIn');
    }, {
        offset:'60%'
    })
    
    $('.js--title').waypoint(function(direction) {
        $('.js--title').addClass('animated fadeIn');
    }, {
        offset:'60%'
    })
    
     $('.js--wp-field').waypoint(function(direction) {
        $('.js--wp-field').addClass('animated flipInX');
    }, {
        offset:'60%'
    })
    
    /*add animations to the button*/
    $( '.js--task-button1' ).hover(
      function() {
        $( '.js--task-button1' ).addClass('animated flip');
      }, function() {
        $( '.js--task-button1' ).removeClass('animated flip');
      }
    );
    
    $( '.js--task-button2' ).hover(
      function() {
        $( '.js--task-button2' ).addClass('animated flip');
      }, function() {
        $( '.js--task-button2' ).removeClass('animated flip');
      }
    );
    
});