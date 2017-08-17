$(window).ready(function(){
    $('#delete_article').click(function(e){
       $target=$(e.target);
       let id=$target.attr('data-id');
       $.ajax({
           type:'DELETE',
           url:'/articles/'+id,
           success:function(response){
               alert('deleting Article...');
               window.location.href='/';
           },
           error:function(err){
               aler('delete failed');
           }
       });
    });
});