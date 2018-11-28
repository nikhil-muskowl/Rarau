import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

@Injectable()
export class CameraUtilsProvider {

  public fName;
  public pictureDir;

  constructor(public http: HttpClient,
    public file: File,
    public platform: Platform) {
    console.log('Hello CameraUtilsProvider Provider');

    this.createDirective();

  }

  createDirective() {
    if (this.platform.is('android')) {

      this.file.checkDir(this.file.externalRootDirectory, 'RaRaU Images').then(response => {
        console.log('Directory exists' + response);
        this.pictureDir = this.file.externalRootDirectory + 'RaRaU Images/';
      }).catch(err => {
        console.log('Directory doesn\'t exist' + JSON.stringify(err));
        this.file.createDir(this.file.externalRootDirectory, 'RaRaU Images', false).then(response => {
          console.log('Directory create' + JSON.stringify(response));
          this.pictureDir = this.file.externalRootDirectory + 'RaRaU Images/';

        }).catch(err => {
          console.log('Directory no create' + JSON.stringify(err));
        });
      });
    }
  }

  public saveToGallery(src) {

    // return new Promise((resolve, reject) => {

    //   this.fName = this.createFileName();
    //   var realData = src.split(",")[1];
    //   let blob = this.b64toBlob(realData, 'image/jpeg');

    //   this.file.writeFile(this.pictureDir, this.fName, blob)
    //     .then(() => {
    //       resolve(this.pictureDir + this.fName);
    //       console.log("Image saved.");
    //     })
    //     .catch((err) => {
    //       console.log('error writing blob')
    //       reject(err)
    //     })
    // });
  }

  public b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
}
