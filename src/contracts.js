/**
 * Valibot props contracts for the palette components a generated Page can
 * bind (U-02). The norns generator validates each page `components:` entry
 * against these before emitting, so a bad binding is a structured refusal
 * at generate time instead of a runtime surprise.
 *
 * A contract describes the *normalized spec entry*: the entry's first key
 * (the component slot) is renamed to `data` when it binds a Query and to
 * `action` when it binds an Action, matching the prop the emitter actually
 * passes. Values are what TRON specs can hold: unit addresses for Query/
 * Action bindings, scalars for everything else. Snippet/function props are
 * not spec-bindable and are deliberately absent.
 *
 * Components without a contract here are not refused — they may be custom
 * `.n` components, which carry their own Component-unit contract.
 */

import * as v from 'valibot';

const NAME = '[A-Za-z_][A-Za-z0-9_]*';
export const QUERY_ADDRESS = new RegExp(`^${NAME}\\.Query\\.${NAME}$`);
export const ACTION_ADDRESS = new RegExp(`^${NAME}\\.Action\\.${NAME}$`);
export const SNIPPET_ADDRESS = new RegExp(`^${NAME}\\.Snippet\\.${NAME}$`);
export const STREAM_ADDRESS = new RegExp(`^${NAME}\\.Endpoint\\.${NAME}$`);
export const ROOM_ADDRESS = new RegExp(`^${NAME}\\.Worker\\.${NAME}$`);

export const query = () =>
	v.pipe(v.string(), v.regex(QUERY_ADDRESS, 'expected a Query address (module.Query.name)'));

export const action = () =>
	v.pipe(v.string(), v.regex(ACTION_ADDRESS, 'expected an Action address (module.Action.name)'));

/** A pass-through prop value — string/number/boolean literal from the spec. */
export const literal = () => v.union([v.string(), v.number(), v.boolean()]);

export const snippet = () =>
	v.pipe(v.string(), v.regex(SNIPPET_ADDRESS, 'expected a Snippet address (module.Snippet.name)'));

/** A `stream:` Endpoint binding — the emitter turns it into a streamSource URL. */
export const stream = () =>
	v.pipe(v.string(), v.regex(STREAM_ADDRESS, 'expected an Endpoint address (module.Endpoint.name)'));

/** A `room: true` Worker binding — the emitter turns it into a roomChannel name. */
export const room = () =>
	v.pipe(v.string(), v.regex(ROOM_ADDRESS, 'expected a Worker address (module.Worker.name)'));

const opt = (schema) => v.optional(schema);

export const contracts = {
	Table: v.strictObject({
		data: query(),
		columns: opt(literal()),
		pageSize: opt(literal()),
		striped: opt(literal()),
		dense: opt(literal()),
		stickyHeader: opt(literal()),
		emptyMessage: opt(literal()),
		cell: opt(snippet()),
		empty: opt(snippet()),
		class: opt(literal())
	}),
	DataTable: v.strictObject({
		data: query(),
		columns: opt(literal()),
		striped: opt(literal()),
		dense: opt(literal()),
		stickyHeader: opt(literal()),
		emptyMessage: opt(literal()),
		sortKey: opt(literal()),
		sortDir: opt(literal()),
		cell: opt(snippet()),
		empty: opt(snippet()),
		class: opt(literal())
	}),
	Kanban: v.strictObject({
		data: query(),
		onMove: opt(action()),
		columns: opt(literal()),
		title: opt(literal()),
		subtitle: opt(literal()),
		emptyMessage: opt(literal()),
		card: opt(snippet()),
		empty: opt(snippet()),
		class: opt(literal())
	}),
	Chart: v.strictObject({
		data: query(),
		type: opt(literal()),
		x: opt(literal()),
		y: opt(literal()),
		label: opt(literal()),
		labels: opt(literal()),
		class: opt(literal())
	}),
	Form: v.strictObject({
		action: action(),
		method: opt(literal()),
		enctype: opt(literal()),
		class: opt(literal())
	}),
	Field: v.strictObject({
		label: opt(literal()),
		help: opt(literal()),
		error: opt(literal()),
		name: opt(literal()),
		required: opt(literal()),
		id: opt(literal()),
		class: opt(literal())
	}),
	Input: v.strictObject({
		name: opt(literal()),
		type: opt(literal()),
		value: opt(literal()),
		placeholder: opt(literal()),
		required: opt(literal()),
		size: opt(literal()),
		class: opt(literal())
	}),
	Select: v.strictObject({
		name: opt(literal()),
		value: opt(literal()),
		required: opt(literal()),
		class: opt(literal())
	}),
	Btn: v.strictObject({
		variant: opt(literal()),
		size: opt(literal()),
		type: opt(literal()),
		icon: opt(literal()),
		href: opt(literal()),
		disabled: opt(literal()),
		class: opt(literal())
	}),
	Card: v.strictObject({
		padded: opt(literal()),
		interactive: opt(literal()),
		href: opt(literal()),
		class: opt(literal())
	}),
	Badge: v.strictObject({
		variant: opt(literal()),
		size: opt(literal()),
		class: opt(literal())
	}),
	Banner: v.strictObject({
		variant: opt(literal()),
		icon: opt(literal()),
		class: opt(literal())
	}),
	Pagination: v.strictObject({
		page: opt(literal()),
		total: opt(literal()),
		pageSize: opt(literal()),
		siblingCount: opt(literal()),
		class: opt(literal())
	}),
	Checkbox: v.strictObject({
		name: opt(literal()),
		checked: opt(literal()),
		required: opt(literal()),
		disabled: opt(literal()),
		error: opt(literal()),
		class: opt(literal())
	}),
	Switch: v.strictObject({
		name: opt(literal()),
		checked: opt(literal()),
		required: opt(literal()),
		disabled: opt(literal()),
		error: opt(literal()),
		class: opt(literal())
	}),
	Textarea: v.strictObject({
		name: opt(literal()),
		value: opt(literal()),
		placeholder: opt(literal()),
		rows: opt(literal()),
		required: opt(literal()),
		disabled: opt(literal()),
		error: opt(literal()),
		class: opt(literal())
	}),
	DatePicker: v.strictObject({
		name: opt(literal()),
		value: opt(literal()),
		min: opt(literal()),
		max: opt(literal()),
		placeholder: opt(literal()),
		label: opt(literal()),
		disabled: opt(literal()),
		error: opt(literal()),
		id: opt(literal()),
		class: opt(literal())
	}),
	Uploader: v.strictObject({
		multiple: opt(literal()),
		accept: opt(literal()),
		disabled: opt(literal()),
		placeholder: opt(literal()),
		helper: opt(literal()),
		class: opt(literal())
	}),
	Timeline: v.strictObject({
		data: query(),
		class: opt(literal())
	}),
	Tree: v.strictObject({
		data: query(),
		class: opt(literal())
	}),
	Calendar: v.strictObject({
		value: opt(literal()),
		range: opt(literal()),
		min: opt(literal()),
		max: opt(literal()),
		label: opt(literal()),
		class: opt(literal())
	}),
	StreamText: v.strictObject({
		streamSource: stream(),
		autostart: opt(literal()),
		class: opt(literal())
	}),
	ChatThread: v.strictObject({
		roomChannel: room(),
		send: opt(literal()),
		receive: opt(literal()),
		placeholder: opt(literal()),
		sendLabel: opt(literal()),
		emptyMessage: opt(literal()),
		message: opt(snippet()),
		class: opt(literal())
	}),
	Feed: v.strictObject({
		streamSource: opt(stream()),
		roomChannel: opt(room()),
		receive: opt(literal()),
		max: opt(literal()),
		emptyMessage: opt(literal()),
		item: opt(snippet()),
		class: opt(literal())
	}),
	PresenceAvatars: v.strictObject({
		roomChannel: room(),
		max: opt(literal()),
		size: opt(literal()),
		label: opt(literal()),
		showCount: opt(literal()),
		class: opt(literal())
	}),
	LiveLog: v.strictObject({
		streamSource: opt(stream()),
		roomChannel: opt(room()),
		receive: opt(literal()),
		maxLines: opt(literal()),
		class: opt(literal())
	})
};

/**
 * Snippet slot signatures: tag → prop → ordered arg names the component
 * passes when it renders the slot. The generator checks a bound Snippet
 * unit's declared `args` against this signature (exact names, exact order),
 * so a mismatch refuses at generate time.
 */
export const snippetSlots = {
	Table: { cell: ['row', 'column', 'value'], empty: [] },
	DataTable: { cell: ['row', 'column', 'value'], empty: [] },
	Kanban: { card: ['card'], empty: [] },
	ChatThread: { message: ['message'] },
	Feed: { item: ['item'] }
};
