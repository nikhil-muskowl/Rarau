import { NgModule } from '@angular/core';
import { StoryComponent } from './story/story';
import { RankingComponent } from './ranking/ranking';
import { FollowingComponent } from './following/following';
import { FollowersComponent } from './followers/followers';
@NgModule({
	declarations: [StoryComponent,
    RankingComponent,
    FollowingComponent,
    StoryComponent,
    FollowersComponent],
	imports: [],
	exports: [StoryComponent,
    RankingComponent,
    FollowingComponent,
    StoryComponent,
    FollowersComponent]
})
export class ComponentsModule {}
