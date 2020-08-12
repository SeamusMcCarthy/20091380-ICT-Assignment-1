$(document).ready(function() {
  $("#goals-button").click(function() {
    $("#goal-table").fadeToggle("slow");
  });

  $("#assessments-button").click(function() {
    $("#assessment-table").fadeToggle("slow");
  });

  $("#chart-button").click(function() {
    $("#pieChart").fadeToggle("slow");
  });

  $(function() {
    $("#dialog").dialog();
  });
});
