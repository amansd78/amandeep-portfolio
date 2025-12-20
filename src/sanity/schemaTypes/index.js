import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { authorType } from "./authorType";

import { project } from "./project";
import { siteSettings } from "./siteSettings";

export const schema = {
  types: [blockContentType, categoryType, postType, authorType, project, siteSettings],
};