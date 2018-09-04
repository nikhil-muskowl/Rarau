import { Component } from '@angular/core';

/**
 * Generated class for the RankingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ranking',
  templateUrl: 'ranking.html'
})
export class RankingComponent {

  text: string;

  constructor() {
    console.log('Hello RankingComponent Component');
    this.text = 'Hello World';
  }

}
