import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from '../shared/posts.service';
import {Post} from '../shared/interfaces';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  posts$: Observable<Post[]>;

  constructor(private postService: PostsService) { }

  ngOnInit(): void {
    this.posts$ = this.postService.getAll()
  }
}
