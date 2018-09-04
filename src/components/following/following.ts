import { Component } from '@angular/core';

/**
 * Generated class for the FollowingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'following',
  templateUrl: 'following.html'
})
export class FollowingComponent {

  text: string;

  constructor() {
    console.log('Hello FollowingComponent Component');
    this.text = 'Hello World';
  }

}
