import { describe, expect, test } from 'bun:test';
import * as v from 'valibot';
import { contracts, query, action, literal, snippet, snippetSlots } from '../src/contracts.js';

const parse = (name, props) => v.safeParse(contracts[name], props);

describe('contracts', () => {
	test('every contract is a strict object schema', () => {
		for (const [name, schema] of Object.entries(contracts)) {
			expect(schema.type, name).toBe('strict_object');
		}
	});

	test('Table accepts a Query data binding with literal props', () => {
		const r = parse('Table', {
			data: 'crm.Query.listDeals',
			columns: 'name,amount,status',
			pageSize: 10,
			striped: true
		});
		expect(r.success).toBe(true);
	});

	test('Table refuses an Action address as the data binding', () => {
		const r = parse('Table', { data: 'crm.Action.reprice' });
		expect(r.success).toBe(false);
		expect(r.issues[0].message).toContain('Query address');
	});

	test('Table refuses unknown props', () => {
		const r = parse('Table', { data: 'crm.Query.listDeals', rows: 'nope' });
		expect(r.success).toBe(false);
	});

	test('Table requires the data binding', () => {
		expect(parse('Table', { columns: 'name' }).success).toBe(false);
	});

	test('Kanban accepts a grouped Query with an Action onMove', () => {
		const r = parse('Kanban', {
			data: 'activities.Query.agenda',
			onMove: 'activities.Action.complete',
			columns: 'planned,done,cancelled',
			title: 'subject'
		});
		expect(r.success).toBe(true);
	});

	test('Kanban refuses a Query address as onMove', () => {
		const r = parse('Kanban', { data: 'a.Query.agenda', onMove: 'a.Query.agenda' });
		expect(r.success).toBe(false);
		expect(r.issues[0].message).toContain('Action address');
	});

	test('Chart accepts a Query with axis keys, refuses unknown props', () => {
		expect(
			parse('Chart', { data: 'deals.Query.byStage', type: 'bar', x: 'stage', y: 'amount' }).success
		).toBe(true);
		expect(parse('Chart', { data: 'deals.Query.byStage', series: 'nope' }).success).toBe(false);
		expect(parse('Chart', {}).success).toBe(false);
	});

	test('Form requires an Action binding', () => {
		expect(parse('Form', { action: 'crm.Action.createDeal' }).success).toBe(true);
		expect(parse('Form', { action: 'crm.Query.listDeals' }).success).toBe(false);
		expect(parse('Form', {}).success).toBe(false);
	});

	test('literal admits spec scalars only', () => {
		for (const ok of ['x', 3, true]) expect(v.safeParse(literal(), ok).success).toBe(true);
		expect(v.safeParse(literal(), { nested: 1 }).success).toBe(false);
	});

	test('query/action helpers pin the address shape', () => {
		expect(v.safeParse(query(), 'crm.Query.list').success).toBe(true);
		expect(v.safeParse(query(), 'crm.Entity.Deal').success).toBe(false);
		expect(v.safeParse(action(), 'crm.Action.move').success).toBe(true);
		expect(v.safeParse(action(), 'not an address').success).toBe(false);
	});

	test('snippet helper pins the Snippet address shape', () => {
		expect(v.safeParse(snippet(), 'crm.Snippet.statusCell').success).toBe(true);
		expect(v.safeParse(snippet(), 'crm.Query.listDeals').success).toBe(false);
		expect(v.safeParse(snippet(), 'not an address').success).toBe(false);
	});

	test('Table/DataTable/Kanban accept Snippet slot bindings', () => {
		expect(
			parse('Table', { data: 'crm.Query.listDeals', cell: 'crm.Snippet.statusCell' }).success
		).toBe(true);
		expect(
			parse('DataTable', { data: 'crm.Query.listDeals', empty: 'crm.Snippet.noRows' }).success
		).toBe(true);
		expect(
			parse('Kanban', { data: 'deals.Query.byStage', card: 'deals.Snippet.dealCard' }).success
		).toBe(true);
		expect(parse('Table', { data: 'crm.Query.listDeals', cell: 'crm.Query.listDeals' }).success).toBe(
			false
		);
	});

	test('realtime contracts pin stream/room bindings (U-09)', () => {
		expect(parse('StreamText', { streamSource: 'games.Endpoint.chat' }).success).toBe(true);
		expect(parse('StreamText', { streamSource: 'games.Worker.matchRoom' }).success).toBe(false);
		expect(parse('StreamText', {}).success).toBe(false);
		expect(
			parse('ChatThread', { roomChannel: 'games.Worker.matchRoom', send: 'chat' }).success
		).toBe(true);
		expect(parse('ChatThread', { roomChannel: 'games.Endpoint.chat' }).success).toBe(false);
		expect(
			parse('Feed', { roomChannel: 'games.Worker.matchRoom', item: 'games.Snippet.eventRow' })
				.success
		).toBe(true);
		expect(parse('PresenceAvatars', { roomChannel: 'games.Worker.matchRoom', max: 3 }).success).toBe(
			true
		);
		expect(parse('LiveLog', { streamSource: 'ops.Endpoint.logs', maxLines: 50 }).success).toBe(true);
	});

	test('snippetSlots signatures match what the components render', () => {
		expect(snippetSlots.Table.cell).toEqual(['row', 'column', 'value']);
		expect(snippetSlots.DataTable.cell).toEqual(['row', 'column', 'value']);
		expect(snippetSlots.Kanban.card).toEqual(['card']);
		for (const [tag, slotProps] of Object.entries(snippetSlots)) {
			expect(contracts[tag], tag).toBeDefined();
			for (const prop of Object.keys(slotProps))
				expect(contracts[tag].entries[prop], `${tag}.${prop}`).toBeDefined();
		}
	});
});
