export type Project = {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  year: string;
  discipline: string;
  role: string;
  cover: string;
  alt: string;
  summary: string;
  overview: string;
  idea: string;
  outcome: string;
  palette: string[];
};

export const projects: Project[] = [
  {
    slug: "slow-form",
    number: "01",
    title: "SLOW FORM",
    subtitle: "A softer kind of presence.",
    year: "2026",
    discipline: "Identity · Campaign · Digital",
    role: "Art direction, identity, digital",
    cover: "/manus-storage/async-images/g7V58voJE1n5czprifrmCS/image-1.webp",
    alt: "An unbranded amber glass vessel lit by a ribbon of warm orange light against a dark background",
    summary: "Building a whole world around the quiet ritual of scent.",
    overview: "A self-initiated world for an imagined independent fragrance house. The challenge was to make a familiar luxury category feel quieter, more tactile, and less polished for polish’s sake.",
    idea: "A slow breath became the visual system: one continuous line of light, a bottle with room around it, and a typographic voice that knows when to stop talking.",
    outcome: "An identity designed to move between bottle, film, and screen without losing its sense of stillness. Every touchpoint leaves a little space for the person on the other side.",
    palette: ["#171514", "#BD6037", "#E9D5BB"],
  },
  {
    slug: "blue-hour",
    number: "02",
    title: "BLUE HOUR",
    subtitle: "An architecture for unhurried days.",
    year: "2025",
    discipline: "Art direction · Digital · Editorial",
    role: "Creative direction, web design",
    cover: "/manus-storage/async-images/g7V58voJE1n5czprifrmCS/image-2.webp",
    alt: "A quiet modernist concrete interior and reflecting pool washed in blue evening light",
    summary: "Translating a feeling of place into a digital experience.",
    overview: "A concept experience for a small architectural retreat imagined at the edge of the sea. Instead of selling an itinerary, Blue Hour invites you to notice the light, the material, and the pause between plans.",
    idea: "The site behaves like the place: generous in its pacing, anchored by architectural photography, and built around a cool blue that deepens as the day winds down.",
    outcome: "A quietly confident digital identity, an editorial booking journey, and a responsive visual system that gives every image the space it needs.",
    palette: ["#0D1B2B", "#627FA4", "#E0C1A1"],
  },
  {
    slug: "open-frequency",
    number: "03",
    title: "OPEN FREQUENCY",
    subtitle: "A louder way to listen.",
    year: "2025",
    discipline: "Identity · Art direction · Motion",
    role: "Visual identity, campaign system",
    cover: "/manus-storage/async-images/g7V58voJE1n5czprifrmCS/image-3.webp",
    alt: "Sculptural vermilion and blue forms reflecting saturated studio light",
    summary: "Making an independent music gathering impossible to ignore.",
    overview: "An imagined gathering for left-field sound, shaped by the artists, makers, and curious listeners who find each other through music. Its identity needed to feel in motion before the first note.",
    idea: "A set of modular forms shift, collide, and make room. The graphic language changes with each lineup while a strong, rhythmic frame keeps every edition recognisable.",
    outcome: "A flexible campaign system for posters, motion, social and the web, built to keep the energy of a live room alive across every format.",
    palette: ["#202343", "#FA5437", "#D4DE59"],
  },
];

export function findProject(slug: string | undefined) {
  return projects.find((project) => project.slug === slug);
}
