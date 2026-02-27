import type { FastifyInstance } from 'fastify';
import * as notebookService from '../services/notebook.service.js';

export async function notebookRoutes(app: FastifyInstance): Promise<void> {
  app.get('/notebook', {
    preHandler: [app.authenticateUser],
  }, async (request) => {
    const entries = await notebookService.getAllEntries(request.userId!);
    return { entries };
  });

  app.post<{
    Body: {
      book_name: string;
      chapter: number;
      verse: number;
      verse_text: string;
      translation?: string;
      notes?: string;
    };
  }>('/notebook', {
    preHandler: [app.authenticateUser],
  }, async (request, reply) => {
    const { book_name, chapter, verse, verse_text, translation, notes } = request.body;

    if (!book_name || !chapter || !verse || !verse_text) {
      return reply.status(400).send({ error: 'book_name, chapter, verse, and verse_text are required' });
    }

    const entry = await notebookService.createEntry(
      request.userId!, book_name, chapter, verse, verse_text, translation ?? 'KJV', notes ?? ''
    );
    return reply.status(201).send({ entry });
  });

  app.put<{
    Params: { id: string };
    Body: { notes: string };
  }>('/notebook/:id', {
    preHandler: [app.authenticateUser],
  }, async (request, reply) => {
    const { notes } = request.body;
    const entry = await notebookService.updateEntryNotes(request.userId!, request.params.id, notes);
    if (!entry) {
      return reply.status(404).send({ error: 'Notebook entry not found' });
    }
    return { entry };
  });

  app.delete<{ Params: { id: string } }>('/notebook/:id', {
    preHandler: [app.authenticateUser],
  }, async (request, reply) => {
    const deleted = await notebookService.deleteEntry(request.userId!, request.params.id);
    if (!deleted) {
      return reply.status(404).send({ error: 'Notebook entry not found' });
    }
    return { success: true };
  });
}
