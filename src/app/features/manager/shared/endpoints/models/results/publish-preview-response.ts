import { BlockerModel } from './blocker-model';

export interface PublishPreviewResponse {
  sheetCount: number;
  canPublish: boolean;
  blockers: BlockerModel[];
}
