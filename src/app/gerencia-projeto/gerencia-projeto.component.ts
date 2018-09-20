import { ProjectService } from './../project.service';
import { Observable } from 'rxjs';
import { Project } from './../project.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';

@Component({
  selector: 'app-gerencia-projeto',
  templateUrl: './gerencia-projeto.component.html',
  styleUrls: ['./gerencia-projeto.component.scss']
})
export class GerenciaProjetoComponent implements OnInit {

  formProject: FormGroup;
  labelButton: string;
  project: Project;
  projects$: Observable<Project[]>
  edit: boolean;
  messages: string;
  id: string;

  //Para upload da imagem
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  task: AngularFireUploadTask;
  complete: boolean;
  caminhoImagem: string;


  constructor(private storage: AngularFireStorage, private projectService: ProjectService, private form: FormBuilder) { }

  ngOnInit() {
    this.initForm()
    this.labelButton = 'Save';
    this.projects$ = this.projectService.getAllProjects();
    this.project = new Project();
  }

  initForm() {
    this.formProject = this.form.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  upload(event) {

    this.complete = false;
    const file = event.target.files[0]
    const path = `imagens/${file.name}`;
    const fileRef = this.storage.ref(path.replace(/\s/g, ''));
    this.task = this.storage.upload(path.replace(/\s/g, ''), file)
    this.task.then(up => {
      fileRef.getDownloadURL().subscribe(url => {
        this.complete = true
        this.caminhoImagem = url

      })
    })
    this.uploadPercent = this.task.percentageChanges();
  }

  saveProject() {
    if (this.formProject.invalid) {
      this.messages = `Verifique os campo sobrigatórios!`
      return;
    }
    this.project = this.formProject.value
    this.project.photoMain = this.caminhoImagem;
    if (!this.edit) {
      this.projectService.save(this.project)
        .then(() => {
          this.messages = `Projeto Salvo com sucesso!`;
          this.formProject.reset();

        })
        .catch((erro) => { this.messages = `Erro ao salvar o projeto: ${erro}` })
    } else {
      this.project.idProject = this.id;
      this.projectService.update(this.project)
        .then(() => {
          this.messages = `Projeto Atulizado com sucesso!`;
          this.formProject.reset();
          this.labelButton = 'Save'

        })
        .catch((erro) => { this.messages = `Erro ao atualizar o projeto: ${erro}` })
    }
  }

  editProject(p: Project) {
    this.edit = true;
    this.labelButton = 'Update';
    this.id = p.idProject
    this.formProject.controls['title'].setValue(p.title)
    this.formProject.controls['description'].setValue(p.description)
  }

  deleteProject(p: Project) {
    this.projectService.delete(p)
      .then(() => {
        this.messages = `Projeto Excluído com sucesso!`;
        this.formProject.reset();

      })
      .catch((erro) => { this.messages = `Erro ao excluir o projeto: ${erro}` })

  }

}
