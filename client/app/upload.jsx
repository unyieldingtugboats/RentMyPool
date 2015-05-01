var renderImgUpload = function () {
  var ImgUploadContent = React.createClass({
    render: function () {
      return (
        <div className="uploadView">
          <h1>Upload Image</h1>
          <form id="uploadForm"
            enctype="multipart/form-data"
            action="/api/photos"
            method="post">
            <input type="file" id="userPhotoInput" name="userPhoto" />
          </form>

        <span id="status" />
        <img id="uploadedImage" />
      </div>
      );
    }

  });

  React.render(<ImgUploadContent />, $('.main')[0]);
};
