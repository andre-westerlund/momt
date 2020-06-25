$(document).ready(function(){

    if(localStorage.getItem("msg"))
    {
        var {txt, status} = JSON.parse(localStorage.getItem("msg"));
        momtAlert(txt, status);
        localStorage.clear();
    }

    var table = $("#user").DataTable({
        "columnDefs": [ {
            "targets": 'no-sort',
            "orderable": false,
            'searchable': false
      } ],
      dom: 'frtipB',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ]
    });
    
     //ADD RECORD
     $(".newUser").click(function(){
        $('#recordForm')[0].reset();
        $('#id').val("");
        $('#firstName').val("");
        $('#lastName').val("");
        $('#email').val("");
        $('#password').val("");
        $('#password').prop("required", true);
        $('.modal-title').html("New User");
        $("#action").val("Add");
           $('#save').val('Save');
      });
    
      //EDIT RECORD
    $("#user").on('click', '.update', function(){
      var tr = $(this).closest('tr');
      var data = table.row(tr).data();
      $('#recordModal').modal('show');
      $('#id').val(data.DT_RowId);
      $('#password').val("");
      $('#password').attr("placeholder", "Change Password?");
      $('#password').prop("required", false);
      $('#firstName').val(data[0]);
      $('#lastName').val(data[1]);
      $('#email').val(data[2]);
      $("#action").val("Update");
      $('.modal-title').html("Edit User");
      $('#save').val('Update');
    
    });

//MODAL SUBMISSION
$("#recordModal").on('submit','#recordForm', function(event){
    event.preventDefault();
    var action = $("#action").val();
    var method;
    var successMsg;
    var failMsg;
    var url = "http://localhost:8081/users";
    if(action == "Update"){
        method = "PUT";
        var id = $('#id').val();
        url +="/"+id;
        successMsg = "Updated User Successfully";
        failMsg = "There was an error updating the User";
    }else if(action =="Add"){
        method = "POST";
        successMsg = "User Added Successfully";
        failMsg = "There was an error adding the User";
    }else{
        $('#recordForm')[0].reset();
        $('#recordModal').modal('hide');				
        $('#save').attr('disabled', false);
        location.reload(true);
        $('.alert').addClass('show alert-danger alert-dismissible fade');
        $('.alert').html("Internal Server Error");
        reload("Internal Server Error", false);
        return;
    } 
    $('#save').attr('disabled','disabled');
    var formData = $(this).serialize();
    $.ajax({
    url:url,
    method: method,
    data:formData,
    success:function(data){				
        $('#recordForm')[0].reset();
        $('#recordModal').modal('hide');				
        $('#save').attr('disabled', false);
        reload(successMsg, true);
    },
    error:function(data){
        $('#recordForm')[0].reset();
        $('#recordModal').modal('hide');				
        $('#save').attr('disabled', false);
        reload(failMsg, false);
    }
    })
});	

//DELETE RECORD                    
$("#user").on('click', '.delete', function(){
    var tr = $(this).closest('tr');
    var data = table.row(tr).data();
    var name = `${data[0]} ${data[1]}`;
    bootbox.confirm({
        message: "Are you sure you want to delete "+name+"?",
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
        //delete user
        if(!result) return;
        $.ajax({
        url:"http://localhost:8081/users/"+data.DT_RowId,
        method: "DELETE",
        data:"",
        success:function(data){	
            reload("Successfully Removed "+name, true);
        },
        error:function(){
            reload("There was an error deleting "+name, false);
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
    var classes = 'show alert-dismissible fade';
    if(success){
        $('.alert').addClass(classes+" alert-success");
    }else{
        $('.alert').addClass(classes+" alert-danger");
    }
    $('.alert').html(msg);
    $(".alert").append('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
    }

})
