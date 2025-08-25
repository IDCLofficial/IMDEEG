import { createClient } from 'contentful';

if (!process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID) throw new Error("Content space ID is missing!")
if (!process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN) throw new Error("Content Access Token is missing!")

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!,
});

export default client; 