import browse from "https://chez.eliasrhouzlane.com/www/utils/browse.js";

const endpoint = "https://chez.eliasrhouzlane.com";

export default async () =>
  (
    await browse(
      endpoint,
      "/dae/story_vs_storage/data/from_martina/images/results/2019-08-14.2019-08-20.Martina/"
    )
  ).files
    .filter(({ getcontenttype }) => getcontenttype.includes("image"))
    .map(({ href }) => endpoint + href.replace("._", ""));