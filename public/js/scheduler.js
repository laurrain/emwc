var custom_form = document.getElementById("custom_form");
 
scheduler.showLightbox = function(id){
    var ev = scheduler.getEvent(id);
    scheduler.startLightbox(id, custom_form );
    ...'here you need to set values in the form'...
    document.getElementById("ev").value = ev.text;

}
//needs to be attached to the 'save' button
function save_form() {
    var ev = scheduler.getEvent(scheduler.getState().lightbox_id);
    ...'here you need to retrieve values from the form'...
    ev.text = document.getElementById("ev").value;
    scheduler.endLightbox(true, custom_form);
}
//needs to be attached to the 'cancel' button
function close_form(argument) {
    scheduler.endLightbox(false, custom_form);
}

