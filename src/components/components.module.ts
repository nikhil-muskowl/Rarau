import { NgModule } from '@angular/core';
import { StoryComponent } from './story/story';
import { RankingComponent } from './ranking/ranking';
import { FollowingComponent } from './following/following';
import { FollowersComponent } from './followers/followers';
import { ProgressBarComponent } from './progress-bar/progress-bar';
@NgModule({
    declarations: [StoryComponent,
        RankingComponent,
        FollowingComponent,
        StoryComponent,
        FollowersComponent,
    ProgressBarComponent,
    ],
    imports: [],
    exports: [StoryComponent,
        RankingComponent,
        FollowingComponent,
        StoryComponent,
        FollowersComponent,
    ProgressBarComponent,
    ]
})
export class ComponentsModule { }
