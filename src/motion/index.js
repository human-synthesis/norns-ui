/**
 * `@human-synthesis/norns-ui/motion` — opt-in motion subpath.
 *
 * Importing from this path pulls in [Motion One](https://motion.dev/) (~3 KB
 * gzipped). The default barrel at the package root stays motion-free; if you
 * never import from `/motion` your bundle stays unaffected.
 *
 * Auto-import (via `presetUI()`) deliberately does NOT register these names —
 * we don't want every page to pay the Motion One cost. Import explicitly:
 *
 *   import AnimatedNumber from '@human-synthesis/norns-ui/motion/AnimatedNumber';
 *   import Reveal from '@human-synthesis/norns-ui/motion/Reveal';
 */
export { default as AnimatedNumber } from './AnimatedNumber.n';
export { default as Reveal } from './Reveal.n';
export { default as LiquidButton } from './LiquidButton.n';
export { default as Sparkles } from './Sparkles.n';
export { default as GradientBackground } from './GradientBackground.n';
