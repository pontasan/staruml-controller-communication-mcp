#!/usr/bin/env node
import { apiGet, apiPost, apiDelete, encId, runTest } from './test-utils.mjs';

const DIR = import.meta.dirname;

await runTest('communication', DIR, async (ctx) => {
  let s = ctx.step('Create communication diagram');
  let diagramId;
  try {
    const res = await apiPost('/api/communication/diagrams', { name: 'Test Communication' });
    diagramId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create lifeline (Client)');
  let clientId;
  try {
    const res = await apiPost('/api/communication/lifelines', { diagramId, name: 'Client', x1: 50, y1: 100, x2: 170, y2: 160 });
    clientId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create lifeline (Server)');
  let serverId;
  try {
    const res = await apiPost('/api/communication/lifelines', { diagramId, name: 'Server', x1: 300, y1: 100, x2: 420, y2: 160 });
    serverId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create connector: Client → Server');
  try {
    await apiPost('/api/communication/connectors', { diagramId, sourceId: clientId, targetId: serverId, name: '1: request()' });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  await ctx.layoutDiagram(diagramId);
  await ctx.exportDiagram(diagramId, 'Export communication image');

  s = ctx.step('Delete diagram');
  try {
    await apiDelete(`/api/communication/diagrams/${encId(diagramId)}`);
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }
});
