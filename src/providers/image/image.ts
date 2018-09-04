import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertProvider } from '../../providers/alert/alert';
import { AlertController } from 'ionic-angular'
import { LoadingProvider } from '../../providers/loading/loading';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { ConfigProvider } from '../../providers/config/config';
@Injectable()
export class ImageProvider {

  public headers = new HttpHeaders();
  public formData: FormData = new FormData();

  // Image Provider
  // This is the provider class for most of the image processing including uploading images to Firebase.
  // Take note that the default function here uploads the file in .jpg. If you plan to use other encoding types, make sure to
  // set the encodingType before uploading the image on Firebase.
  // Example for .png:
  // data:image/jpeg;base64 -> data:image/png;base64
  // generateFilename to return .png
  private profilePhotoOptions: CameraOptions;
  private photoMessageOptions: CameraOptions;
  private groupPhotoOptions: CameraOptions;
  // All files to be uploaded on Firebase must have DATA_URL as the destination type.
  // This will return the imageURI which can then be processed and uploaded to Firebase.
  // For the list of cameraOptions, please refer to: https://github.com/apache/cordova-plugin-camera#module_camera.CameraOptions
  public alert: any;

  constructor(public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public camera: Camera,
    public alertCtrl: AlertController,
    private transfer: FileTransfer,
    private sanitizer: DomSanitizer,
    public http: HttpClient) {

    this.headers.set('Access-Control-Allow-Origin ', '*');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');

    console.log("Initializing Image Provider");
    this.profilePhotoOptions = {
      quality: 50,
      targetWidth: 384,
      targetHeight: 384,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    };

    this.photoMessageOptions = {
      quality: 50,
      targetWidth: 300,
      targetHeight: 200,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      allowEdit: true,
    };

    this.groupPhotoOptions = {
      quality: 50,
      targetWidth: 384,
      targetHeight: 384,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    };
  }

  // Function to convert dataURI to Blob needed by Firebase
  imgURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: mimeString
    });
  }

  // Generate a random filename of length for the image to be uploaded
  generateFilename() {
    var length = 8;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".jpg";
  }

  // Set ProfilePhoto given the user and the cameraSourceType.
  // This function processes the imageURI returned and uploads the file on Firebase,
  // Finally the user data on the database is updated.
  setProfilePhoto(user, sourceType) {
    this.profilePhotoOptions.sourceType = sourceType;
    this.loadingProvider.show();
    // Get picture from camera or gallery.
    this.camera.getPicture(this.profilePhotoOptions).then((imageData) => {
      // Process the returned imageURI.
      console.log('Image', imageData);
      console.log('User', user);
      let imgBlob = this.imgURItoBlob("data:image/jpeg;base64," + imageData);
      let metadata = {
        'contentType': imgBlob.type
      };
      // Generate filename and upload to Firebase Storage.

      // firebase.storage().ref().child('images/' + user.userId + '/' + this.generateFilename()).put(imgBlob, metadata).then((snapshot) => {
      // Delete previous profile photo on Storage if it exists.
      // console.log('Snapshot', snapshot);

      //this.deleteImageFile(user.img);
      // URL of the uploaded image!
      // let url = snapshot.metadata.downloadURLs[0];
      // console.log('URL', url);
      // let currentUser = firebase.auth().currentUser.uid;
      // console.log('uid', currentUser);


      // this.angularDb.object('/accounts/' + currentUser).update({
      //   img: url
      // }).then((success) => {
      //   console.log('Success', success);
      //   this.loadingProvider.hide();
      //   this.alertProvider.showProfileUpdatedMessage();
      // }).catch((error) => {
      //   console.log('Error', error);
      //   this.loadingProvider.hide();
      //   this.alertProvider.showErrorMessage('profile/error-change-photo');
      // });
      // let profile = {
      //   displayName: user.name,
      //   photoURL: url
      // };
      // Update Firebase User.
      // firebase.auth().currentUser.updateProfile(profile)
      //   .then((success) => {
      //     // Update User Data on Database.
      //     console.log('Success.curr', success);
      //   })
      //   .catch((error) => {
      //     this.loadingProvider.hide();
      //     console.log('Error.curr', error);
      //     this.alertProvider.showErrorMessage('profile/error-change-photo');
      //   });
      // }).catch((error) => {
      //   this.loadingProvider.hide();
      //   console.log('Error.up', error);
      //   // this.alertProvider.showErrorMessage('image/error-image-upload');
      // });
    }).catch((error) => {
      console.log('Error.up', error);
      this.loadingProvider.hide();
    });
  }

  uploadProfilePhoto(user, imageData) {
    let imgBlob = this.imgURItoBlob(imageData);
    let metadata = {
      'contentType': imgBlob.type
    };
    // const userId = firebase.auth().currentUser.uid;

    // firebase.storage().ref().child('images/' + userId + '/' + this.generateFilename()).put(imgBlob, metadata).then((snapshot) => {
    // Delete previous profile photo on Storage if it exists.
    // console.log('Snapshot', snapshot);

    //this.deleteImageFile(user.img);
    // URL of the uploaded image!
    // let url = snapshot.metadata.downloadURLs[0];
    // console.log('URL', url);
    // let currentUser = firebase.auth().currentUser.uid;
    // console.log('uid', currentUser);


    // this.angularDb.object('/accounts/' + currentUser).update({
    //   img: url
    // }).then((success) => {
    //   console.log('Success', success);
    //   this.loadingProvider.hide();
    //   this.alertProvider.showProfileUpdatedMessage();
    // }).catch((error) => {
    //   console.log('Error', error);
    //   this.loadingProvider.hide();
    //   this.alertProvider.showErrorMessage('profile/error-change-photo');
    // });
    // let profile = {
    //   displayName: user.name,
    //   photoURL: url
    // };
    // Update Firebase User.
    // firebase.auth().currentUser.updateProfile(profile)
    //   .then((success) => {
    //     // Update User Data on Database.
    //     console.log('Success.curr', success);
    //   })
    //   .catch((error) => {
    //     this.loadingProvider.hide();
    //     console.log('Error.curr', error);
    //     this.alertProvider.showErrorMessage('profile/error-change-photo');
    //   });
    // }).catch((error) => {
    //   this.loadingProvider.hide();
    //   console.log('Error.up', error);
    //   this.alertProvider.showErrorMessage('image/error-image-upload');
    // });
  }


  // Upload and set the group object's image.
  setGroupPhoto(group, sourceType) {
    this.groupPhotoOptions.sourceType = sourceType;
    this.loadingProvider.show();
    // Get picture from camera or gallery.
    this.camera.getPicture(this.groupPhotoOptions).then((imageData) => {
      // Process the returned imageURI.
      let imgBlob = this.imgURItoBlob("data:image/jpeg;base64," + imageData);
      let metadata = {
        'contentType': imgBlob.type
      };
      // firebase.storage().ref().child('images/' + firebase.auth().currentUser.uid + '/' + this.generateFilename()).put(imgBlob, metadata).then((snapshot) => {
      //   this.deleteImageFile(group.img);
      //   // URL of the uploaded image!
      //   let url = snapshot.metadata.downloadURLs[0];
      //   group.img = url;
      //   this.loadingProvider.hide();
      // }).catch((error) => {
      //   this.loadingProvider.hide();
      //   this.alertProvider.showErrorMessage('image/error-image-upload');
      // });
    }).catch((error) => {
      this.loadingProvider.hide();
    });
  }

  //Delete the image given the url.
  deleteImageFile(path) {
    var fileName = path.substring(path.lastIndexOf('%2F') + 3, path.lastIndexOf('?'));
    // firebase.storage().ref().child('images/' + firebase.auth().currentUser.uid + '/' + fileName).delete().then(() => { }).catch((error) => { });
  }

  //Delete the user.img given the user.
  deleteUserImageFile(user) {
    var fileName = user.img.substring(user.img.lastIndexOf('%2F') + 3, user.img.lastIndexOf('?'));
    // firebase.storage().ref().child('images/' + user.userId + '/' + fileName).delete().then(() => { }).catch((error) => { });
  }

  // Upload photo message and return the url as promise.
  uploadPhotoMessage(conversationId, sourceType): Promise<any> {
    return new Promise(resolve => {
      this.photoMessageOptions.sourceType = sourceType;
      this.loadingProvider.show();
      // Get picture from camera or gallery.
      this.camera.getPicture(this.photoMessageOptions).then((imageData) => {
        // Process the returned imageURI.
        let imgBlob = this.imgURItoBlob("data:image/jpeg;base64," + imageData);
        let metadata = {
          'contentType': imgBlob.type
        };
        // Generate filename and upload to Firebase Storage.
        // firebase.storage().ref().child('images/' + conversationId + '/' + this.generateFilename()).put(imgBlob, metadata).then((snapshot) => {
        //   // URL of the uploaded image!
        //   let url = snapshot.metadata.downloadURLs[0];
        //   this.loadingProvider.hide();
        //   resolve(url);
        // }).catch((error) => {
        //   this.loadingProvider.hide();
        //   this.alertProvider.showErrorMessage('image/error-image-upload');
        // });
      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }

  // ======== set post image ========
  setImage() {
    return new Promise((resolve, reject) => {
      this.alert = this.alertCtrl.create({
        title: 'Send Photo Message',
        message: 'Do you want to take a photo or choose from your photo gallery?',
        buttons: [
          {
            text: 'Cancel',
            handler: data => { }
          },
          {
            text: 'Choose from Gallery',
            handler: () => {
              this.photoMessageOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
              this.camera.getPicture(this.photoMessageOptions).then((imageData) => {
                resolve("data:image/jpeg;base64," + imageData)
              })
            }
          },
          {
            text: 'Take Photo',
            handler: () => {
              this.photoMessageOptions.sourceType = this.camera.PictureSourceType.CAMERA;
              this.camera.getPicture(this.photoMessageOptions).then((imageData) => {
                resolve("data:image/jpeg;base64," + imageData)
              })
            }
          }
        ]
      }).present();
    })
  }

  // ======= upload image in post folder ====
  uploadPostImage(data) {

    var pageNo = data.start;
    var pageSize = data.length;
    let formData: FormData = new FormData();
    console.log('In Post method', '');
    // formData.append('start', pageNo);
    // formData.append('length', pageSize);


    return new Promise((resolve, reject) => {
      let imgBlob = this.imgURItoBlob(data.url);
      let metadata = {
        'contentType': imgBlob.type
      };

      return this.http.post(ConfigProvider.BASE_URL + 'story_module/api/stories_api/save', formData,
        {
          headers: this.headers,
        }
      );
      // //  Generate filename and upload to Firebase Storage.
      //   firebase.storage().ref().child('images/post/' + this.generateFilename()).put(imgBlob, metadata).then((snapshot) => {
      //     // URL of the uploaded image!
      //     let url = snapshot.metadata.downloadURLs[0];
      //     resolve(url);
      //   }).catch((error) => {
      //     this.alertProvider.showErrorMessage('image/error-image-upload');
      //     reject(error)
      //   });

    });
  }

  uploadFile(imageURI) {
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: this.generateFilename(),
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {}
    }

    return fileTransfer.upload(imageURI,
      ConfigProvider.BASE_URL + 'story_module/api/stories_api/upload', options);

  }

  // ======= upload image in story folder ====
  uploadStoryImage(url) {
    return new Promise((resolve, reject) => {

      // url.startsWith('cdvphotolibrary://') ? this.sanitizer.bypassSecurityTrustUrl(url) : url;
      // url.replace("data:image/octet-stream;base64,", ""); 
      console.log('upload story', url);
      let imgBlob = this.imgURItoBlob(url);
      let metadata = {
        'contentType': imgBlob.type
      };
      // Generate filename and upload to Firebase Storage.
      // firebase.storage().ref().child('images/story/' + this.generateFilename())
      //   .put(imgBlob, metadata).then((snapshot) => {
      //     // URL of the uploaded image!
      //     let url = snapshot.metadata.downloadURLs[0];
      //     console.log('result', url);
      //     resolve(url);
      //   }).catch((error) => {
      //     this.alertProvider.showErrorMessage('image/error-image-upload');
      //     reject(error)
      //   });
    })
  }

  // ======= upload image in post folder ====
  uploadPostImage64(image) {

    return new Promise((resolve, reject) => {
      image.replace("data:image/octet-stream;base64,", "");
      console.log(image);
      let imgBlob = this.imgURItoBlob("data:image/jpeg;base64," + image);
      let metadata = {
        'contentType': imgBlob.type
      };

      // Generate filename and upload to Firebase Storage.
      //   firebase.storage().ref().child('images/post/' + this.generateFilename())
      //     .put(imgBlob, metadata).then((snapshot) => {
      //       // URL of the uploaded image!
      //       let url = snapshot.metadata.downloadURLs[0];
      //       resolve(url);
      //     }).catch((error) => {
      //       this.alertProvider.showErrorMessage('image/error-image-upload');
      //       reject(error)
      //     });
    })
  }

}
