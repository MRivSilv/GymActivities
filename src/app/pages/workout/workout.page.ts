import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Set {
  weight: number | null;
  reps: number | null;
}

interface WorkoutExercise {
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

  routineName = '';
  exercises: WorkoutExercise[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    const nav = history.state;

    if (nav?.routine) {
      this.routineName = nav.routine.name;

      this.exercises = nav.routine.exercises.map((ex: any) => ({
        name: ex.name,
        sets: [{ weight: null, reps: null }]
      }));
    }
  }

  addSet(exerciseIndex: number) {
    this.exercises[exerciseIndex].sets.push({
      weight: null,
      reps: null
    });
  }

  finishWorkout() {
    const workout = {
      routineName: this.routineName,
      date: new Date().toISOString(),
      exercises: this.exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets.filter(
          s => s.weight !== null && s.reps !== null
        )
      }))
    };

    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));

    this.router.navigate(['/home']);
  }
}
