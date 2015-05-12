var ImgUploadContent = React.createClass({
  handleSubmit: function (e) {
    e.preventDefault();
    var form = new FormData();
    form.append("file",e.target.userPhoto.files[0])
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/uploadimg', true);
    xhr.onload= function (data) {
      console.log(xhr.responseText);
      console.log("loaded.");
    }
    xhr.send(form);
  },

  render: function () {
    return (
      <div className="uploadView">
        <LoginTransitioner />
        <h1>Upload Image</h1>
        <form id="uploadForm"
          onSubmit={this.handleSubmit}>
          <input type="file" id="userPhotoInput" name="userPhoto" />

          <span id="status" />
          <img id="uploadedImage" />
          <input type="submit" />
        </form>
    </div>
    );
  }

});
  
