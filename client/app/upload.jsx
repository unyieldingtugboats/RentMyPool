var uploadImg = function () {
  alert('uploading');
  console.log($('#uploadForm'));
  $('#uploadForm')[0].submit(function() {
        //status('uploading the file ...');
        alert('working');
        console.dir($(this).ajaxSubmit);
        $(this).ajaxSubmit({

            error: function(xhr) {
              alert('Error: ' + xhr.status);
            },

            success: function(response) {
    //TODO: We will fill this in later
            }
        });
        alert('doing');

  // Have to stop the form from submitting and causing
  // a page refresh - don't forget this
    return false;
  });

}

var ImgUploadContent = React.createClass({
  render: function () {
    return (
      <div className="uploadView">
        <h1>Upload Image</h1>
        <form id="uploadForm"
          enctype="multipart/form-data"
          action="/uploadimg"
          method="post">
          <input type="file" id="userPhotoInput" name="userPhoto" />
        </form>

      <span id="status" />
      <img id="uploadedImage" />
      <button type="button" onClick={uploadImg}>Upload to Server</button>
    </div>
    );
  }

});

