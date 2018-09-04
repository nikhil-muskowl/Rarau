import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginWechatPage } from './login-wechat';

@NgModule({
  declarations: [
    LoginWechatPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginWechatPage),
  ],
})
export class LoginWechatPageModule {}
