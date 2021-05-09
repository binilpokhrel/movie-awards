import { Pipe, PipeTransform } from "@angular/core";
import { MovieItem } from "../models/movie-item.model";

@Pipe({ name: 'titleYear' })
export class TitleYearPipe implements PipeTransform {
  transform(value: MovieItem): string {
    return `${value.title} (${value.year})`;
  }
}
