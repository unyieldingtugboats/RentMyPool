var uploadImg = function () {
  $('#uploadForm').submit(function() {
        //status('uploading the file ...');

        $(this).ajaxSubmit({

            error: function(xhr) {
              status('Error: ' + xhr.status);
            },

            success: function(response) {
    //TODO: We will fill this in later
            }
        });

  // Have to stop the form from submitting and causing
  // a page refresh - don't forget this
    return false;
  });

}

var renderImgUpload = function () {
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

  React.render(<ImgUploadContent />, $('.main')[0]);
};
