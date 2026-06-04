import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Language } from '../../../../../../core/services/language';
import { SubjectMarkDistributionModel } from '../../../../shared/endpoints/models/age-group/subject-mark-distribution-model';
import { MarkTableRow } from '../../model/mark-table-row';

export interface EditCellEvent {
  studentId: number;
  distributionId: number;
  enteredValue: number | null;
  maxValue: number;
  distributionName: string;
}

@Component({
  selector: 'app-mark-sheet-table',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mark-sheet-table.html',
})
export class MarkSheetTableComponent implements OnChanges {
  language = inject(Language);

  @Input() rows: MarkTableRow[]                          = [];
  @Input() distributions: SubjectMarkDistributionModel[] = [];
  @Input() maxGrade = 0;

  @Output() deleteRow = new EventEmitter<MarkTableRow>();
  @Output() editCell  = new EventEmitter<EditCellEvent>();

  displayedColumns: string[] = [];

  ngOnChanges() {
    const cw = this.courseworkDists();
    const fe = this.finalExamDists();

    this.displayedColumns = [
      'studentName',
      ...cw.map(d => `dist_${d.id}`),
      ...(cw.length ? ['courseworkAvg'] : []),
      ...fe.map(d => `dist_${d.id}`),
      ...(fe.length ? ['finalExamAvg'] : []),
      'totalAvg',
      'action',
    ];
  }

  courseworkDists(): SubjectMarkDistributionModel[] {
    return this.distributions.filter(d => d.markType === 1);
  }

  finalExamDists(): SubjectMarkDistributionModel[] {
    return this.distributions.filter(d => d.markType === 2);
  }

  sortedDistributions(): SubjectMarkDistributionModel[] {
    return [...this.distributions].sort((a, b) => a.markType - b.markType);
  }

  columnHeader(dist: SubjectMarkDistributionModel): string {
    const typeName = dist.markType === 1
      ? this.language.transform('coursework_title')
      : this.language.transform('final_exam_title');
    const max = +(dist.percentage * this.maxGrade).toFixed(2);
    return `${dist.name} — ${typeName} — ${max}`;
  }

  isCellEditable(row: MarkTableRow, distId: number): boolean {
    return !!row.cellMap[distId]?.markEntryId;
  }

  onCellClick(row: MarkTableRow, dist: SubjectMarkDistributionModel) {
    if (!this.isCellEditable(row, dist.id)) return;
    const cell = row.cellMap[dist.id];
    this.editCell.emit({
      studentId:        row.studentId,
      distributionId:   dist.id,
      enteredValue:     cell.enteredValue,
      maxValue:         +(dist.percentage * this.maxGrade).toFixed(2),
      distributionName: dist.name,
    });
  }

  courseworkAvg(row: MarkTableRow): string {
    return this.computeAvg(this.courseworkDists(), row);
  }

  finalExamAvg(row: MarkTableRow): string {
    return this.computeAvg(this.finalExamDists(), row);
  }

  totalAvg(row: MarkTableRow): string {
    const cwVal = this.numericAvg(this.courseworkDists(), row);
    const feVal = this.numericAvg(this.finalExamDists(), row);
    const vals  = [cwVal, feVal].filter((v): v is number => v !== null);
    if (!vals.length) return '—';
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
  }

  private computeAvg(dists: SubjectMarkDistributionModel[], row: MarkTableRow): string {
    const val = this.numericAvg(dists, row);
    return val !== null ? val.toFixed(2) : '—';
  }

  private numericAvg(dists: SubjectMarkDistributionModel[], row: MarkTableRow): number | null {
    if (!dists.length) return null;
    const entered = dists
      .map(d => row.cellMap[d.id]?.enteredValue)
      .filter((v): v is number => v !== null && v !== undefined);
    if (!entered.length) return null;
    return entered.reduce((a, b) => a + b, 0) / entered.length;
  }
}
