import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Post} from '../../shared/interfaces';
import {PostsService} from '../../shared/posts.service';
import {AlertServices} from '../shared/services/alert.services';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {
  form: FormGroup;

  constructor(
    private  postService: PostsService,
    private alertService: AlertServices
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      text: new FormControl(null, [
        Validators.required,
        Validators.minLength(2)
      ]),
      author: new FormControl(null, [
        Validators.required,
        Validators.minLength(2)
      ]),
    });

  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    const post: Post = {
      title: this.form.value.title,
      text: this.form.value.text,
      author: this.form.value.author,
      date: new Date()
    };

    this.postService.create(post).subscribe(() => {
      this.form.reset();
      this.alertService.success('Post was created successfully.');
    });
  }

}



