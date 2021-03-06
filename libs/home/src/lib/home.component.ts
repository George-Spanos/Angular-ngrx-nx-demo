import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HomeFacade } from './+state/home.facade';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ArticlesFacade, articleListInitialState, ArticleListConfig } from '@realworld/articles/data-access';
import { AuthFacade } from '@realworld/auth/data-access';
import { CommonModule } from '@angular/common';
import { TagsListComponent } from './tags-list/tags-list.component';
import { ArticleListComponent } from '@realworld/articles/feature-articles-list/src';

@UntilDestroy()
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, TagsListComponent, ArticleListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  listConfig$ = this.articlesfacade.listConfig$;
  tags$ = this.facade.tags$;
  isAuthenticated = false;
  unsubscribe$: Subject<void> = new Subject();

  constructor(private facade: HomeFacade, private articlesfacade: ArticlesFacade, private authFacade: AuthFacade) {}

  ngOnInit() {
    this.facade.loadTags();
    this.authFacade.isLoggedIn$.pipe(untilDestroyed(this)).subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
      this.getArticles();
    });
  }

  setListTo(type: string = 'ALL') {
    this.articlesfacade.setListConfig(<ArticleListConfig>{
      ...articleListInitialState.listConfig,
      type,
    });
  }

  getArticles() {
    if (this.isAuthenticated) {
      this.setListTo('FEED');
    } else {
      this.setListTo('ALL');
    }
  }

  setListTag(tag: string) {
    this.articlesfacade.setListConfig(<ArticleListConfig>{
      ...articleListInitialState.listConfig,
      filters: {
        ...articleListInitialState.listConfig.filters,
        tag,
      },
    });
  }
}
