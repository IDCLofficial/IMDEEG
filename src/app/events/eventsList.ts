import { contentfulService } from "../../../lib/contentful";

export default async function getEvents() {
    const events = await contentfulService.getEventsByMinistryId(process.env.NEXT_PUBLIC_CONTENTFUL_MINISTRY_ID!)
    return events;
}
