import { Injectable } from '@angular/core';
import { Project } from './project.model';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projectCol: AngularFirestoreCollection<Project>;

  constructor(private afs: AngularFirestore) {
    this.projectCol = afs.collection<Project>('projects')
  }

  getAllProjects(): Observable<Project[]> {
    return this.afs.collection<Project>('projects', ref =>
      ref.orderBy('datePub', 'desc'))
      .valueChanges()
  }

  save(project: Project): Promise<void> {
    project.datePub = new Date();
    return this.projectCol.add(Object.assign({}, project)).then(objeto => {
      project.idProject = objeto.id
      this.update(project)
    })
  }

  update(project: Project): Promise<void> {
    return this.projectCol.doc(project.idProject)
      .update(Object.assign({}, project))

  }

  delete(project: Project): Promise<void> {
    return this.projectCol.doc(project.idProject)
      .delete()
  }

}
