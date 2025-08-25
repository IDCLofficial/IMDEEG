"use client"

import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import { Project } from "../../../lib/types";


const PROJECTS_PER_PAGE = 5;

export default function ProjectsSection({projects}:{projects:Project[]}) {
 
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
    const start = page * PROJECTS_PER_PAGE;
    const end = start + PROJECTS_PER_PAGE;
    const currentProjects = projects.slice(start, end);

    if(currentProjects.length === 0) {
        return (
            <section className="w-full py-10 md:py-16 bg-white flex flex-col items-center gap-8 md:gap-22 px-4 md:px-8">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center">No projects found</h1>
            </section>
        )
    }

    return (
        <section className="w-full py-10 md:py-16 bg-white flex flex-col items-center gap-8 md:gap-22 px-4 md:px-8">
            {currentProjects.map((project) => (
                <ProjectCard key={project.fields.projectTitle} title={project.fields.projectTitle} description={project.fields.projectDescription} image={`https:${project.fields.projectImage?.fields.file.url}`} />
            ))}
            <div className="flex gap-4 mt-6">
                <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50 cursor-pointer"
                >
                    Previous
                </button>
                <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="px-4 py-2 rounded bg-primary-green text-white disabled:opacity-50 cursor-pointer"
                >
                    Next
                </button>
            </div>
        </section>
    );
}