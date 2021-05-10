import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'pageItemRange' })
export class PageItemRangePipe implements PipeTransform {
  transform(page: number, pageSize: number, maxSize: number): string {
    const lower = (page-1)*maxSize;
    return `${lower + 1}-${lower + pageSize}`;
  }
}
