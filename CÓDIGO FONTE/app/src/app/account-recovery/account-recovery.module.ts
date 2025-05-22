import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountRecoveryPageRoutingModule } from './account-recovery-routing.module';

import { AccountRecoveryPage } from './account-recovery.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountRecoveryPageRoutingModule
  ],
  declarations: [AccountRecoveryPage]
})
export class AccountRecoveryPageModule {}
