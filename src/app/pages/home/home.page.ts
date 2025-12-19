import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { StartWorkoutModal } from './start-workout.modal';

interface Routine {
  name: string;
  exercises: { name: string }[];
  createdAt: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
})
export class HomePage implements OnInit {

  routines: Routine[] = [];

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRoutines();
  }

  ionViewWillEnter() {
    this.loadRoutines();
  }

  loadRoutines() {
    this.routines = JSON.parse(localStorage.getItem('routines') || '[]');
  }
  async deleteRoutine(index: number) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar rutina',
      message: '¿Seguro que quieres eliminar esta rutina?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.routines.splice(index, 1);
            localStorage.setItem('routines', JSON.stringify(this.routines));
          }
        }
      ]
    });

    await alert.present();
  }
    async startRoutine(routine: Routine) {
    const modal = await this.modalCtrl.create({
      component: StartWorkoutModal,
      componentProps: {
        routineName: routine.name
      },
      breakpoints: [0, 0.5, 0.75],
      initialBreakpoint: 0.5,
      canDismiss: true,
      backdropDismiss: true
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.start) {
      this.router.navigate(['/workout'], {
        state: { routine }
      });
    }
  }
  goToCreate() {
    this.router.navigate(['/home/create']);
  }
}