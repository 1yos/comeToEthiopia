/**
 * GSAP + ScrollTrigger setup.
 * Import this once in main.tsx. All components import gsap and ScrollTrigger
 * directly from 'gsap' and 'gsap/ScrollTrigger' — registration happens here.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
