/* $(document).ready(function() {
    $('#example').DataTable( {
        /* dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
               "<'row'<'col-sm-12'tr>>" +
               "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>" +
               "<'#example_filter'>", */
        /* language: {
            "url": "./French.json"
        }, */
        /* language: {
            /* "url": "<?php echo base_url('/public/imports/table/French.json') ?>" * /
            "url": "/public/imports/table/French.json"
        }, * /
        //scrollY:        '50vh',
        scrollY:        '300px',
        scrollCollapse: true,
        paging:         true
        /*dom: 'Bfrtip',
        buttons: [
            'copy',
            'csv',
            'excel',
            'pdf',
        ]* /
    } );
} ); */

$(document).ready(function() {
    //inialize datatable
    //$('#example').DataTable();
    /* $("#mySearch").on("keyup", function () {  */
    $("#mySearch").on("input", function () { 
        var value = $(this).val().toLowerCase();

        $("#myTable tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});