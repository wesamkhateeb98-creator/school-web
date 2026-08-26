import { Component, Input, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Language } from '../../../../../../core/services/language';
import { PipelineResponse } from '../../../../shared/endpoints/models/results/pipeline-response';
import { PipelineStage } from '../../../../../../core/enums/pipeline-stage';

@Component({
  selector: 'app-pipeline-stage-bar',
  imports: [MatIconModule],
  templateUrl: './pipeline-stage-bar.html',
  styleUrl: './pipeline-stage-bar.scss',
})
export class PipelineStageBarComponent {
  language = inject(Language);

  private _pipeline = signal<PipelineResponse | null>(null);

  @Input()
  set pipeline(value: PipelineResponse | null) {
    this._pipeline.set(value);
  }
  get pipeline(): PipelineResponse | null {
    return this._pipeline();
  }

  stages = [
    { stage: PipelineStage.Entry, labelKey: 'stage_entry_title' as const },
    { stage: PipelineStage.Generation, labelKey: 'stage_generation_title' as const },
    { stage: PipelineStage.Decision, labelKey: 'stage_decision_title' as const },
    { stage: PipelineStage.Publish, labelKey: 'stage_publish_title' as const },
    { stage: PipelineStage.Promotion, labelKey: 'stage_promotion_title' as const },
    { stage: PipelineStage.Completed, labelKey: 'stage_completed_title' as const },
  ];

  currentStage = computed(() => this._pipeline()?.stage ?? null);
  isStale = computed(() => this._pipeline()?.isStale ?? false);
}
