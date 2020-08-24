$(document).ready(function() {

  // Allow user to hide tables & chart to save space on page
  $("#goals-button").click(function() {
    $("#goal-table").fadeToggle("slow");
  });

  $("#assessments-button").click(function() {
    $("#assessment-table").fadeToggle("slow");
  });

  $("#chart-button").click(function() {
    $("#pieChart").fadeToggle("slow");
  });

  // jQuery UI dialog used for goals popup
  $(function() {
    $("#dialog").dialog({
      hide: {
        effect: "explode",
        duration: 700
      }
    });
  });

  // jQuery UI dialog box with OK confirmation
  $( function() {
    $( "#dialog-message" ).dialog({
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      },
      hide: {
        effect: "explode",
        duration: 700
      }
    });
  } );

  // jQuery UI calendar
  $(function() {
    $("#datepicker").datepicker({
      dateFormat: "D, dd M yy",
      minDate: 0});
  } );
});
