import { describe, expect, test } from 'bun:test';
import * as v from 'valibot';
import { contracts, query, action, literal } from '../src/contracts.js';

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
});
