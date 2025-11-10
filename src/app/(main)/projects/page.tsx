import ProjectHeroSection from "./ProjectHeroSection";
import Footer from "../../components/Footer";
import CTASection from "../../components/CTASection";
import ProjectsSection from "./ProjectsSection";
import { getProject } from "./projects";
import { Project } from "../../../../lib/types";

export default async function ProjectsPage() {
  const projects = await getProject()

  return (
    <div className="bg-white">
      <ProjectHeroSection />
      <ProjectsSection projects={projects as unknown as Project[]} />
      <CTASection 
        heading="Ready to Experience the New Imo?"
        subtext="Discover our vision for an inclusive, empowered, and connected state."
        buttonLabel="Contact Us"
        buttonHref="/contact-us"
      />
      <Footer />
    </div>
  );
}