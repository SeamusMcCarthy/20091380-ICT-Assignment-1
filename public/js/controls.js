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
    $("#dialog").dialog();
  });
});
