import { contentfulService } from "../../../lib/contentful";

export async function getProject(){
  const projects = await contentfulService.getProjectsByMinistryId(process.env.NEXT_PUBLIC_CONTENTFUL_MINISTRY_ID!);
  return projects
}