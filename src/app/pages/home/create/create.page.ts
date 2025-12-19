import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from "@ionic/angular";
import { Router } from '@angular/router';
import { RoutineNameModal } from './routine-name.modal';
interface Exercise {
  name: string ;
}

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class CreatePage implements OnInit {

  exercises: Exercise[] = [
    { name: ''}
  ];
  
  constructor(
    private modalCtrl: ModalController,
    private router: Router
  ) {}
  

  addExercise() {
    this.exercises.push({ name: ''});
  }

  removeExercise(index: number) {
    if (this.exercises.length > 1) {
      this.exercises.splice(index, 1);
    }
  }
  async openRoutineModal() {
    const modal = await this.modalCtrl.create({
      component: RoutineNameModal,
      breakpoints: [0, 0.5, 0.75],
      initialBreakpoint: 0.5,
      canDismiss: true,
      backdropDismiss: true
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.routineName) {
      this.saveRoutine(data.routineName);
    }
  }

  saveRoutine(routineName: string) {
    const routine = {
      name: routineName.toUpperCase(),
      exercises: this.exercises.map(ex => ({
        ...ex,
        name: ex.name.toUpperCase()
      })),
      createdAt: new Date()
    };

    const routines = JSON.parse(localStorage.getItem('routines') || '[]');
    routines.push(routine);
    localStorage.setItem('routines', JSON.stringify(routines));

    this.router.navigate(['/home']);
  }

  get isCreateDisabled(): boolean {
    return this.exercises.length === 0 || this.exercises.every(e => !e.name.trim());
  }

  ngOnInit() {
  }

}
