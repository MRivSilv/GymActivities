import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Set {
  weight: number | null;
  reps: number | null;
}

interface Exercise {
  name: string;
  sets: Set[];
}

@Component({
  standalone: true,
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class WorkoutPage implements OnInit {

  exercises: Exercise[] = [];
  routineName = '';

  constructor(
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loadWorkout();
  }

  /* =========================
     CARGAR RUTINA + AUTOFILL
     ========================= */
  loadWorkout() {
    const routine = history.state?.routine;

    if (!routine) {
      this.router.navigate(['/home']);
      return;
    }

    this.routineName = routine.name;

    const lastSession = this.getLastSession(this.routineName);

    this.exercises = routine.exercises.map((ex: any) => {
      const previous = lastSession?.exercises?.find(
        (e: any) => e.name === ex.name
      );

      return {
        name: ex.name,
        sets: previous
          ? previous.sets.map((s: any) => ({
              weight: s.weight,
              reps: s.reps,
            }))
          : [{ weight: null, reps: null }],
      };
    });
  }

  /* =========================
     SERIES
     ========================= */
  addSet(exIndex: number) {
    this.exercises[exIndex].sets.push({
      weight: null,
      reps: null,
    });
  }

  removeSet(exIndex: number, setIndex: number) {
    if (this.exercises[exIndex].sets.length > 1) {
      this.exercises[exIndex].sets.splice(setIndex, 1);
    }
  }

  /* =========================
     TERMINAR ENTRENAMIENTO
     ========================= */
  async finishWorkout() {
    const alert = await this.alertCtrl.create({
      header: '¿Terminar rutina?',
      message: `¿Deseas guardar el entrenamiento?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: () => this.saveWorkout(),
        },
      ],
    });

    await alert.present();
  }

  saveWorkout() {
    const session = {
      routineName: this.routineName,
      date: new Date(),
      exercises: this.exercises,
    };

    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    history.push(session);
    localStorage.setItem('workoutHistory', JSON.stringify(history));

    this.router.navigate(['/home']);
  }

  /* =========================
     HISTORIAL
     ========================= */
  getLastSession(routineName: string) {
    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    return [...history]
      .reverse()
      .find((s) => s.routineName === routineName);
  }
}