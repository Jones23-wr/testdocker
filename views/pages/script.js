$(document).ready(function(){

    load_data();

    function load_data()
    {
        $.ajax({
            url:"http://localhost:3000/sample_data/action",
            method:"POST",
            data:{action:'fetch'},
            dataType : "JSON",
            success:function(data)
            {
                var html = '';

                if(data.data.length > 0)
                {
                    for(var count = 0; count < data.data.length; count++)
                    {
                        html += `
                        <tr>
                            <td>`+data.data[count].first_name+`</td>
                            <td>`+data.data[count].last_name+`</td>
                            <td>`+data.data[count].gender+`</td>
                            <td>`+data.data[count].age+`</td>
                            <td><button type="button" class="btn btn-warning btn-sm edit" data-id="`+data.data[count].id+`">Edit</button>&nbsp;<button type="button" class="btn btn-danger btn-sm delete" data-id="`+data.data[count].id+`">Delete</button></td>
                        </tr>
                        `;
                    }
                }

                $('#sample_data tbody').html(html);
            }
        });
    }

    $('#add_data').click(function(){

        $('#dynamic_modal_title').text('Add Data');

        $('#sample_form')[0].reset();

        $('#action').val('Add');

        $('#action_button').text('Add');

        $('#action_modal').modal('show');

    });

    $('#sample_form').on('submit', function(event){

        event.preventDefault();

        $.ajax({
            url:"http://localhost:3000/sample_data/action",
            method:"POST",
            data:$('#sample_form').serialize(),
            dataType:"JSON",
            beforeSend:function(){
                $('#action_button').attr('disabled', 'disabled');
            },
            success:function(data)
            {
                $('#action_button').attr('disabled', false);

                $('#message').html('<div class="alert alert-success">'+data.message+'</div>');

                $('#action_modal').modal('hide');

                load_data();

                setTimeout(function(){
                    $('#message').html('');
                }, 5000);
            }
        });

    });

    $(document).on('click', '.edit', function(){

        var id = $(this).data('id');

        $('#dynamic_modal_title').text('Edit Data');

        $('#action').val('Edit');

        $('#action_button').text('Edit');

        $('#action_modal').modal('show');

        $.ajax({
            url:"http://localhost:3000/sample_data/action",
            method:"POST",
            data:{id:id, action:'fetch_single'},
            dataType:"JSON",
            success:function(data)
            {
                $('#first_name').val(data.first_name);
                $('#last_name').val(data.last_name);
                $('#gender').val(data.gender);
                $('#age').val(data.age);
                $('#id').val(data.id);
            }
        });

    });

    $(document).on('click', '.delete', function(){

        var id = $(this).data('id');

        if(confirm("Are you sure you want to delete this data?"))
        {
            $.ajax({
                url:"http://localhost:3000/sample_data/action",
                method:"POST",
                data:{action:'delete', id:id},
                dataType:"JSON",
                success:function(data)
                {
                    $('#message').html('<div class="alert alert-success">'+data.message+'</div>');
                    load_data();
                    setTimeout(function(){
                        $('#message').html('');
                    }, 5000);
                }
            });
        }

    });
});

