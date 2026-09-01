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

export const query = () =>
	v.pipe(v.string(), v.regex(QUERY_ADDRESS, 'expected a Query address (module.Query.name)'));

export const action = () =>
	v.pipe(v.string(), v.regex(ACTION_ADDRESS, 'expected an Action address (module.Action.name)'));

/** A pass-through prop value — string/number/boolean literal from the spec. */
export const literal = () => v.union([v.string(), v.number(), v.boolean()]);

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
		class: opt(literal())
	}),
	Kanban: v.strictObject({
		data: query(),
		onMove: opt(action()),
		columns: opt(literal()),
		title: opt(literal()),
		subtitle: opt(literal()),
		emptyMessage: opt(literal()),
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
	})
};
