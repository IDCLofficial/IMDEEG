import { contentfulService } from "../../../lib/contentful";

export default async function getMedia() {
    const media = await contentfulService.getMediaByMinistryId(process.env.NEXT_PUBLIC_CONTENTFUL_MINISTRY_ID!)
    return media;
}
