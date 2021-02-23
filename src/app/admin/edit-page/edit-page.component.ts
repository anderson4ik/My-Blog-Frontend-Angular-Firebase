import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {PostsService} from '../../shared/posts.service';
import {switchMap} from 'rxjs/operators';
import {Post} from '../../shared/interfaces';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AlertServices} from '../shared/services/alert.services';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styles: [
  ]
})
export class EditPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  post: Post;
  submitted: boolean = false;

  uSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private postService: PostsService,
    private alertService: AlertServices
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          return this.postService.getById(params['id']);
        })
      ).subscribe((post: Post) => {
      this.post = post;
      this.form = new FormGroup({
        title: new FormControl(post.title,
          [Validators.required, Validators.minLength(3)]),
        text: new FormControl(post.text,
          [Validators.required, Validators.minLength(2)])
      });
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;
    this.uSub = this.postService.update({
      ...this.post,
      title: this.form.value.title,
      text: this.form.value.text
    }).subscribe(() => {
      this.submitted = false;
      this.alertService.success('Post was updated.');
    })
  }

  ngOnDestroy(): void {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }
}
