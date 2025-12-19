import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-start-workout-modal',
  templateUrl: 'start-workout.modal.html',
  styleUrls: ['start-workout.modal.scss'],
  imports: [IonicModule, CommonModule],
})
export class StartWorkoutModal {

  @Input() routineName!: string;

  constructor(private modalCtrl: ModalController) {}

  start() {
    this.modalCtrl.dismiss({ start: true });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
