import { Pipe, PipeTransform } from "@angular/core";

/**
 * Generated class for the RemovehtmltagsPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: "removehtmltags"
})
export class RemovehtmltagsPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {
    if (value) {
      var result = value
        .replace(/<br[^>]*>/g, "")
        .replace(/<\/br>/g, "\n")
        .replace(/<p[^>]*>/g, "")
        .replace(/<\/p>/g, "\n")
        .replace(/&nbsnbsp;/g, " ")
        .replace(/\&nbsp;/g, " ")
        .replace(/\&amp;/g, "&")
        .replace(/\&rsquo;/g, "'")
        .replace(/\&lt;/g, "<")
        .replace(/\&gt;/g, ">")
        .replace(/\&quot;/g, "'")
        .replace(/\&apos;/g, "'")
        .replace("/<[^>]*>?/g", "")
        .replace(/<\/?[^>]+>/gi, "")
        .replace("/\u00a0/g", "");

      return result;
    } else {
    }
  }
}
