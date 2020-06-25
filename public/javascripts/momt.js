$(document).ready(function(){

    if(localStorage.getItem("msg"))
    {
        var {txt, status} = JSON.parse(localStorage.getItem("msg"));
        momtAlert(txt, status);
        localStorage.clear();
    }

    var table = $("#momt").DataTable({
        "columnDefs": [ {
            "targets": 'no-sort',
            "orderable": false,
            'searchable': false
      }
     ],
      dom: 'frtipB',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ]
    });
    
//DELETE RECORD                    
$("#momt").on('click', '.delete', function(){
    var tr = $(this).closest('tr');
    var data = table.row(tr).data();
    var num = `${data[0]}`;
    bootbox.confirm({
        message: "Are you sure you want to delete "+num+"?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-danger'
            },
            cancel: {
                label: 'No',
                className: 'btn-info'
            }
        },
    callback: function (result) {
        //delete num
        if(!result) return;
        $.ajax({
        url:"http://localhost:8081/momt/"+data.DT_RowId,
        method: "DELETE",
        data:"",
        success:function(data){	
            reload("Successfully Removed "+num, true);
        },
        error:function(){
            reload("There was an error deleting "+num, false);
        }
        });
    }});
});

function reload(txt, status){
    localStorage.setItem("msg",JSON.stringify({ txt: txt, status: status}));
    window.location.reload(); 
}

//CUSTOM ALERT
function momtAlert(msg, success){
    $('.alert').removeClass('alert-success alert-danger show alert-dismissible fade');
    var classes = 'show alert-dismissible fade';
    if(success){
        $('.alert').addClass(classes+" alert-success");
    }else{
        $('.alert').addClass(classes+" alert-danger");
    }
    $('.alert').html(msg);
    $(".alert").append('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
}

$.validator.addMethod("digiNum", function(value, element) {
    var re = new RegExp('^(\+685)?\s?(7[27])[0-9]{5}$');
    return re.test(value);
    }, "Input data must be a valid Digicel Number - start with Optional(685) 77 or 72");

$("#newNumberForm").validate();
$("#number").rules("add", {
    required:true,
    digiNum: true
})

$('input[type="file"]').change(function(e){
    var fileName = e.target.files[0].name;
    $("#fileLabel").html(fileName);

});

$('#uploadFileForm').on('submit',function(e){
    var filename = $("#file").val();

    // Use a regular expression to trim everything before final dot
    var extension = filename.replace(/^.*\./, '');

    // Iff there is no dot anywhere in filename, we would have extension == filename,
    // so we account for this possibility now
    if (extension == filename) {
        extension = '';
    } else {
        // if there is an extension, we convert to lower case
        // (N.B. this conversion will not effect the value of the extension
        // on the file upload.)
        extension = extension.toLowerCase();
    }

    switch (extension) {
        case 'csv':
        break;

        default:
            // Cancel the form submission
            e.preventDefault();
            return;
    }

    $("#fileLabel").html("Choose file");

});

           

})
