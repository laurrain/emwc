

// init Isotope
var $grid = $('.grid').isotope({
  // options
// filter .metal items
$grid.isotope({ filter: '.cellphonesView' });

// filter .alkali OR .alkaline-earth items
$grid.isotope({ filter: '.viewlaptops' });

// filter .metal AND .transition items
$grid.isotope({ filter: '.surveillance' });

// show all items
$grid.isotope({ filter: '*' });
});

// bind filter button click
$('#filters').on( 'click', 'button', function() {
  var filterValue = $( this ).attr('data-filter');
  // use filterFn if matches value
  filterValue = filterFns[ filterValue ] || filterValue;
  $grid.isotope({ filter: filterValue });
});

