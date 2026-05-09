/**
 * Main barrel — re-exports user-facing components and helpers.
 *
 * Most consumption goes through auto-import (via the `presetUI()` factory in
 * `@human-synthesis/norns-ui/auto-import`). This barrel exists for users
 * who prefer explicit imports or who need to reach a component from JS
 * code that auto-import doesn't process (e.g. dynamic mount).
 */

// Phase 1
export { default as Btn } from './components/Btn.n';

// Phase 2 — forms tier
export { default as Checkbox } from './components/Checkbox.n';
export { default as Field } from './components/Field.n';
export { default as FieldGroup } from './components/FieldGroup.n';
export { default as Form } from './components/Form.n';
export { default as Input } from './components/Input.n';
export { default as Radio } from './components/Radio.n';
export { default as Select } from './components/Select.n';
export { default as Switch } from './components/Switch.n';
export { default as Textarea } from './components/Textarea.n';

// Phase 3 — behavior tier (Bits UI)
export { default as Dialog } from './components/Dialog.n';
export { default as Sheet } from './components/Sheet.n';
export { default as Popover } from './components/Popover.n';
export { default as Dropdown } from './components/Dropdown.n';
export { default as Tooltip } from './components/Tooltip.n';
export { default as Tabs } from './components/Tabs.n';
export { default as ToastProvider } from './components/ToastProvider.n';

// 0.0.4 — display layer
export { default as Icon } from './components/Icon.n';
export { default as Card } from './components/Card.n';
export { default as Surface } from './components/Surface.n';
export { default as Banner } from './components/Banner.n';
export { default as Badge } from './components/Badge.n';
export { default as Chip } from './components/Chip.n';
export { default as Avatar } from './components/Avatar.n';
export { default as Skeleton } from './components/Skeleton.n';
export { default as Progress } from './components/Progress.n';
export { default as ProgressCircular } from './components/ProgressCircular.n';

// 0.0.4 — composite layer
export { default as Header } from './components/Header.n';
export { default as Drawer } from './components/Drawer.n';
export { default as HeroBanner } from './components/HeroBanner.n';
export { default as Stepper } from './components/Stepper.n';
export { default as Breadcrumbs } from './components/Breadcrumbs.n';
export { default as Pagination } from './components/Pagination.n';
export { default as Accordion } from './components/Accordion.n';
export { default as Carousel } from './components/Carousel.n';
export { default as Tree } from './components/Tree.n';

// 0.0.4 — wave A
export { default as Separator } from './components/Separator.n';
export { default as Toolbar } from './components/Toolbar.n';
export { default as ButtonGroup } from './components/ButtonGroup.n';
export { default as ToggleButton } from './components/ToggleButton.n';
export { default as ToggleButtonGroup } from './components/ToggleButtonGroup.n';
export { default as Collapsible } from './components/Collapsible.n';
export { default as NumberInput } from './components/NumberInput.n';
export { default as OtpField } from './components/OtpField.n';
export { default as TagsInput } from './components/TagsInput.n';
export { default as Image } from './components/Image.n';
export { default as Audio } from './components/Audio.n';
export { default as Video } from './components/Video.n';
export { default as Timeline } from './components/Timeline.n';

// 0.0.4 — wave B
export { default as Autocomplete } from './components/Autocomplete.n';
export { default as MultiSelect } from './components/MultiSelect.n';
export { default as ContextMenu } from './components/ContextMenu.n';
export { default as RichTooltip } from './components/RichTooltip.n';
export { default as PreviewCard } from './components/PreviewCard.n';
export { default as ScrollArea } from './components/ScrollArea.n';
export { default as ColorPicker } from './components/ColorPicker.n';
export { default as Uploader } from './components/Uploader.n';
export { default as HierarchicalMenu } from './components/HierarchicalMenu.n';
export { default as MegaMenu } from './components/MegaMenu.n';

// 0.0.4 — wave C
export { default as DatePicker } from './components/DatePicker.n';
export { default as DateRangePicker } from './components/DateRangePicker.n';
export { default as TimePicker } from './components/TimePicker.n';
export { default as Calendar } from './components/Calendar.n';
export { default as DataTable } from './components/DataTable.n';

// 0.0.5 — CSS-only motion components
export { default as AvatarGroup } from './components/AvatarGroup.n';
export { default as GradientText } from './components/GradientText.n';
export { default as CopyButton } from './components/CopyButton.n';
export { default as ThemeToggler } from './components/ThemeToggler.n';
export { default as ShinyButton } from './components/ShinyButton.n';
export { default as RippleButton } from './components/RippleButton.n';
// Motion-driven: `import … from '@human-synthesis/norns-ui/motion'`.

// Helpers
export { cn } from './lib/cn.js';
export { variantClasses } from './lib/variants.js';
export { presetUI } from './auto-import.js';
export { toast, notify, dismiss, clear } from './lib/toast.svelte.js';
