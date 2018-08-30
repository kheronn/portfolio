import { Injectable } from '@angular/core';
import { Project } from './project.model';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projectCol: AngularFirestoreCollection<Project>;

  constructor(afs: AngularFirestore) {
    this.projectCol = afs.collection<Project>('projects')
  }
}
