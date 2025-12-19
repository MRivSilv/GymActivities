import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-routine-name-modal',
  templateUrl: './routine-name.modal.html',
  styleUrls: ['./routine-name.modal.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class RoutineNameModal {

  routineName = '';

  constructor(private modalCtrl: ModalController) {}

  finish() {
    if (!this.routineName.trim()) return;

    this.modalCtrl.dismiss({
      routineName: this.routineName
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
